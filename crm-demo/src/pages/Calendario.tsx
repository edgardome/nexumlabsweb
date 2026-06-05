import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, GripVertical, Info, Plus } from "lucide-react";
import { PageHeader, Card, Select } from "../components/ui";
import { AppointmentForm } from "../components/AppointmentForm";
import type { AppointmentDefaults } from "../components/AppointmentForm";
import { useAppointments } from "../store/appointments";
import { usePatients } from "../store/patients";
import { useToast } from "../store/toast";
import { formatTime } from "../lib/format";
import { trtById } from "../data/treatments";
import { professionals, proById } from "../data/professionals";
import type { Appointment } from "../data/types";

const START_HOUR = 8;
const END_HOUR = 20;
const SLOT_MIN = 30;
const SLOT_H = 30; // px por slot de 30 min
const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN;

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // lunes = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const statusStyle: Record<Appointment["estado"], string> = {
  Confirmada: "",
  Pendiente: "border-dashed",
  Realizada: "opacity-80",
  Cancelada: "opacity-50 line-through",
};

export default function Calendario() {
  const { appointments, moveAppointment, updateAppointment, addAppointment, deleteAppointment } = useAppointments();
  const { byId } = usePatients();
  const toast = useToast();
  const [vista, setVista] = useState<"dia" | "semana">("semana");
  const [cursor, setCursor] = useState(() => new Date());
  const [filtroPro, setFiltroPro] = useState("todos");
  const [dragId, setDragId] = useState<string | null>(null);

  // Redimensionado (cambiar duración arrastrando el borde inferior)
  const [resize, setResize] = useState<{ id: string; startY: number; startDur: number } | null>(null);
  const [previewDur, setPreviewDur] = useState<{ id: string; dur: number } | null>(null);
  const previewRef = useRef<{ id: string; dur: number } | null>(null);
  useEffect(() => {
    previewRef.current = previewDur;
  }, [previewDur]);

  useEffect(() => {
    if (!resize) return;
    const onMove = (e: MouseEvent) => {
      const delta = Math.round((e.clientY - resize.startY) / SLOT_H);
      const dur = Math.max(SLOT_MIN, Math.min(240, resize.startDur + delta * SLOT_MIN));
      setPreviewDur({ id: resize.id, dur });
    };
    const onUp = () => {
      const p = previewRef.current;
      if (p) {
        updateAppointment(p.id, { duracionMin: p.dur });
        toast(`Duración actualizada a ${p.dur} min`);
      }
      setResize(null);
      setPreviewDur(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resize, updateAppointment, toast]);

  // Crear (clic en hueco) o gestionar (clic en bloque) una cita
  const [formOpen, setFormOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [createDefaults, setCreateDefaults] = useState<AppointmentDefaults>({});

  const handleSave = (a: Appointment) => {
    if (editingAppt) {
      updateAppointment(a.id, a);
      toast("Cita actualizada");
    } else {
      addAppointment(a);
      toast("Cita creada");
    }
  };
  const handleDelete = (id: string) => {
    deleteAppointment(id);
    toast("Cita eliminada", "info");
  };

  const dayCount = vista === "dia" ? 1 : 7;
  const dias = useMemo(() => {
    const base = vista === "dia" ? new Date(cursor) : startOfWeek(cursor);
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: dayCount }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [cursor, vista, dayCount]);

  const visibles = useMemo(
    () => appointments.filter((a) => filtroPro === "todos" || a.profesionalId === filtroPro),
    [appointments, filtroPro]
  );

  const horas = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  const shift = (dir: number) => {
    const d = new Date(cursor);
    d.setDate(d.getDate() + dir * (vista === "dia" ? 1 : 7));
    setCursor(d);
  };

  const slotFromEvent = (e: React.DragEvent | React.MouseEvent, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const y = e.clientY - rect.top;
    return Math.max(0, Math.min(TOTAL_SLOTS - 1, Math.floor(y / SLOT_H)));
  };

  const onDrop = (e: React.DragEvent, dayDate: Date) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    setDragId(null);
    if (!id) return;
    const slot = slotFromEvent(e, e.currentTarget as HTMLElement);
    const minutes = START_HOUR * 60 + slot * SLOT_MIN;
    const nuevo = new Date(dayDate);
    nuevo.setHours(0, 0, 0, 0);
    nuevo.setMinutes(minutes);
    moveAppointment(id, nuevo.toISOString());
    toast("Cita reprogramada");
  };

  const onColumnClick = (e: React.MouseEvent, dayDate: Date) => {
    if (resize || dragId) return;
    const slot = slotFromEvent(e, e.currentTarget as HTMLElement);
    const minutes = START_HOUR * 60 + slot * SLOT_MIN;
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    setEditingAppt(null);
    setCreateDefaults({
      fecha: toYMD(dayDate),
      hora: `${hh}:${mm}`,
      profesionalId: filtroPro !== "todos" ? filtroPro : undefined,
    });
    setFormOpen(true);
  };

  const rangoLabel =
    vista === "dia"
      ? dias[0].toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : `${dias[0].toLocaleDateString("es-ES", { day: "numeric", month: "short" })} – ${dias[6].toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Calendario"
        subtitle="Arrastra para reprogramar, estira el borde para cambiar la duración y haz clic en un hueco para crear una cita."
        actions={
          <Select value={filtroPro} onChange={setFiltroPro}>
            <option value="todos">Todos los profesionales</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </Select>
        }
      />

      {/* Barra de navegación */}
      <Card className="mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 p-0.5">
            {(["dia", "semana"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVista(v)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  vista === v ? "bg-[var(--accent)] text-white" : "text-slate-500 hover:text-ink"
                }`}
              >
                {v === "dia" ? "Día" : "Semana"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => shift(-1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm font-medium capitalize text-ink">{rangoLabel}</span>
            <button onClick={() => shift(1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCursor(new Date())}
              className="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Hoy
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {professionals.map((p) => (
            <span key={p.id} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              {p.nombre.replace("Dra. ", "").replace("Dr. ", "").replace("Esp. ", "")}
            </span>
          ))}
        </div>
      </Card>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
        <Info className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
        Los cambios se guardan al instante y se reflejan en Citas, el Dashboard y la ficha del paciente.
      </div>

      {/* Rejilla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className={vista === "semana" ? "min-w-[760px]" : ""}>
            {/* Cabecera de días */}
            <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: `56px repeat(${dayCount}, 1fr)` }}>
              <div className="border-r border-slate-100" />
              {dias.map((d, i) => {
                const hoy = sameDay(d, new Date());
                const dow = (d.getDay() + 6) % 7;
                return (
                  <div key={i} className={`border-r border-slate-100 px-2 py-2 text-center ${hoy ? "bg-[var(--accent-soft)]" : ""}`}>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">{DIAS[dow]}</p>
                    <p className={`text-sm font-semibold ${hoy ? "text-[var(--accent)]" : "text-ink"}`}>{d.getDate()}</p>
                  </div>
                );
              })}
            </div>

            {/* Cuerpo */}
            <div className="grid" style={{ gridTemplateColumns: `56px repeat(${dayCount}, 1fr)` }}>
              {/* Horas */}
              <div className="border-r border-slate-100">
                {horas.map((h) => (
                  <div key={h} className="relative border-b border-slate-50 text-right" style={{ height: SLOT_H * 2 }}>
                    <span className="absolute right-1.5 -top-2 text-[11px] text-slate-400">{String(h).padStart(2, "0")}:00</span>
                  </div>
                ))}
              </div>

              {/* Días */}
              {dias.map((d, i) => {
                const hoy = sameDay(d, new Date());
                const citasDia = visibles.filter((a) => sameDay(new Date(a.inicio), d));
                return (
                  <div
                    key={i}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => onDrop(e, d)}
                    onClick={(e) => onColumnClick(e, d)}
                    className={`group/col relative cursor-copy border-r border-slate-100 ${hoy ? "bg-[var(--accent-soft)]/40" : ""}`}
                    style={{ height: TOTAL_SLOTS * SLOT_H }}
                  >
                    {/* Líneas de slots (no capturan eventos) */}
                    <div className="pointer-events-none absolute inset-0">
                      {Array.from({ length: END_HOUR - START_HOUR }, (_, k) => (
                        <div key={k} className="border-b border-slate-50" style={{ height: SLOT_H * 2 }} />
                      ))}
                    </div>

                    {/* Bloques */}
                    {citasDia.map((a) => {
                      const start = new Date(a.inicio);
                      const startMin = start.getHours() * 60 + start.getMinutes();
                      const top = ((startMin - START_HOUR * 60) / SLOT_MIN) * SLOT_H;
                      const dur = previewDur?.id === a.id ? previewDur.dur : a.duracionMin;
                      const height = Math.max((dur / SLOT_MIN) * SLOT_H - 3, 22);
                      const pro = proById(a.profesionalId);
                      const pac = byId(a.pacienteId);
                      const trt = trtById(a.tratamientoId);
                      if (top < -SLOT_H || top > TOTAL_SLOTS * SLOT_H) return null;
                      return (
                        <div
                          key={a.id}
                          draggable={resize?.id !== a.id}
                          onDragStart={(e) => {
                            e.dataTransfer.setData("text/plain", a.id);
                            e.dataTransfer.effectAllowed = "move";
                            setDragId(a.id);
                          }}
                          onDragEnd={() => setDragId(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAppt(a);
                            setFormOpen(true);
                          }}
                          title={`${pac?.nombre} · ${trt?.nombre} · ${pro?.nombre} · ${dur} min`}
                          className={`group absolute left-1 right-1 cursor-grab overflow-hidden rounded-lg border-l-[3px] bg-white px-1.5 py-1 text-left shadow-sm ring-1 ring-slate-200/70 transition active:cursor-grabbing ${statusStyle[a.estado]} ${dragId === a.id ? "opacity-40" : "hover:shadow-md hover:ring-slate-300"}`}
                          style={{ top, height, borderLeftColor: pro?.color ?? "var(--accent)" }}
                        >
                          <div className="flex items-start gap-1">
                            <GripVertical className="mt-0.5 h-3 w-3 shrink-0 text-slate-300 group-hover:text-slate-400" />
                            <div className="min-w-0 flex-1 leading-tight">
                              <p className="truncate text-[11px] font-semibold text-ink">
                                {formatTime(a.inicio)} · {pac?.nombre?.split(" ")[0] ?? "—"}
                              </p>
                              {height > 34 && (
                                <p className="truncate text-[10px] text-slate-500">{trt?.nombre.split(" · ")[0]}</p>
                              )}
                            </div>
                          </div>

                          {/* Handle de redimensionado */}
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setResize({ id: a.id, startY: e.clientY, startDur: a.duracionMin });
                            }}
                            onDragStart={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-x-0 bottom-0 h-2 cursor-ns-resize opacity-0 transition group-hover:opacity-100"
                          >
                            <div className="mx-auto mb-0.5 h-1 w-6 rounded-full bg-slate-300" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <Plus className="h-3.5 w-3.5" /> Haz clic en cualquier hueco libre para crear una cita en esa fecha y hora.
      </p>

      <AppointmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initial={editingAppt}
        defaults={createDefaults}
      />
    </div>
  );
}
