import { useMemo, useState } from "react";
import { Plus, CalendarDays, ChevronLeft, ChevronRight, CalendarX2 } from "lucide-react";
import { PageHeader, Card, Badge, Button, Select, Avatar, EmptyState } from "../components/ui";
import { AppointmentForm } from "../components/AppointmentForm";
import { useAppointments } from "../store/appointments";
import { usePatients } from "../store/patients";
import { useToast } from "../store/toast";
import { formatDayLong, formatTime } from "../lib/format";
import type { Appointment, AppointmentStatus } from "../data/types";
import { trtById } from "../data/treatments";
import { professionals, proById } from "../data/professionals";

const statusTone: Record<AppointmentStatus, "emerald" | "amber" | "rose" | "blue"> = {
  Confirmada: "emerald",
  Pendiente: "amber",
  Cancelada: "rose",
  Realizada: "blue",
};

const dayKey = (iso: string) => new Date(iso).toDateString();

export default function Citas() {
  const { appointments: citas, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { byId } = usePatients();
  const toast = useToast();
  const [vista, setVista] = useState<"dia" | "semana">("dia");
  const [refDate, setRefDate] = useState(() => new Date());
  const [filtroPro, setFiltroPro] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);

  const visibles = useMemo(() => {
    const start = new Date(refDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    if (vista === "dia") end.setDate(end.getDate() + 1);
    else end.setDate(end.getDate() + 7);

    return citas
      .filter((c) => {
        const t = new Date(c.inicio).getTime();
        if (t < start.getTime() || t >= end.getTime()) return false;
        if (filtroPro !== "todos" && c.profesionalId !== filtroPro) return false;
        if (filtroEstado !== "todos" && c.estado !== filtroEstado) return false;
        return true;
      })
      .sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio));
  }, [citas, refDate, vista, filtroPro, filtroEstado]);

  const grouped = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const c of visibles) {
      const k = dayKey(c.inicio);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(c);
    }
    return [...map.entries()];
  }, [visibles]);

  const shift = (dir: number) => {
    const d = new Date(refDate);
    d.setDate(d.getDate() + dir * (vista === "dia" ? 1 : 7));
    setRefDate(d);
  };

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (c: Appointment) => {
    setEditing(c);
    setFormOpen(true);
  };
  const handleSave = (c: Appointment) => {
    if (editing) {
      updateAppointment(c.id, c);
      toast("Cita actualizada");
    } else {
      addAppointment(c);
      toast("Cita creada");
    }
  };
  const handleDelete = (id: string) => {
    deleteAppointment(id);
    toast("Cita eliminada", "info");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Citas"
        subtitle="Agenda de la clínica y gestión de citas."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Nueva cita
          </Button>
        }
      />

      <Card className="mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
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
            <span className="inline-flex items-center gap-1.5 px-2 text-sm font-medium text-ink">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              {formatDayLong(refDate)}
            </span>
            <button onClick={() => shift(1)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setRefDate(new Date())}
              className="ml-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Hoy
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filtroPro} onChange={setFiltroPro}>
            <option value="todos">Todos los profesionales</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </Select>
          <Select value={filtroEstado} onChange={setFiltroEstado}>
            <option value="todos">Todos los estados</option>
            {(["Confirmada", "Pendiente", "Realizada", "Cancelada"] as AppointmentStatus[]).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </Select>
        </div>
      </Card>

      {grouped.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<CalendarX2 className="h-6 w-6" />}
            title="No hay citas en este periodo"
            hint="Cambia de día o crea una nueva cita."
          />
        </Card>
      ) : (
        <div className="space-y-5">
          {grouped.map(([day, items]) => (
            <div key={day}>
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {formatDayLong(day)}
              </p>
              <Card className="divide-y divide-slate-100">
                {items.map((c) => {
                  const pac = byId(c.pacienteId);
                  const trt = trtById(c.tratamientoId);
                  const pro = proById(c.profesionalId);
                  return (
                    <div
                      key={c.id}
                      onClick={() => openEdit(c)}
                      className="flex cursor-pointer items-center gap-4 p-4 transition hover:bg-slate-50"
                    >
                      <div className="w-14 shrink-0 text-center">
                        <p className="text-sm font-semibold text-ink">
                          {formatTime(c.inicio)}
                        </p>
                        <p className="text-[11px] text-slate-400">{c.duracionMin} min</p>
                      </div>
                      <span className="h-10 w-px shrink-0 bg-slate-100" />
                      <Avatar name={pac?.nombre ?? "?"} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{pac?.nombre}</p>
                        <p className="truncate text-xs text-slate-500">{trt?.nombre}</p>
                      </div>
                      <div className="hidden items-center gap-2 sm:flex">
                        <Avatar name={pro?.nombre ?? "?"} color={pro?.color} size={24} />
                        <span className="text-xs text-slate-500">{pro?.nombre}</span>
                      </div>
                      <Badge tone={statusTone[c.estado]}>{c.estado}</Badge>
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      )}

      <AppointmentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initial={editing}
      />
    </div>
  );
}
