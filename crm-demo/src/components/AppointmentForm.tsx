import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./ui";
import { usePatients } from "../store/patients";
import { treatments, trtById } from "../data/treatments";
import { professionals } from "../data/professionals";
import type { Appointment, AppointmentStatus } from "../data/types";

export interface AppointmentDefaults {
  pacienteId?: string;
  tratamientoId?: string;
  profesionalId?: string;
  fecha?: string; // yyyy-mm-dd
  hora?: string; // HH:mm
  estado?: AppointmentStatus;
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hm(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AppointmentForm({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
  defaults,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (a: Appointment) => void;
  onDelete?: (id: string) => void;
  initial?: Appointment | null;
  defaults?: AppointmentDefaults;
}) {
  const { patients } = usePatients();
  const [pacienteId, setPacienteId] = useState("");
  const [tratamientoId, setTratamientoId] = useState(treatments[0].id);
  const [profesionalId, setProfesionalId] = useState(professionals[0].id);
  const [fecha, setFecha] = useState(() => ymd(new Date()));
  const [hora, setHora] = useState("10:00");
  const [estado, setEstado] = useState<AppointmentStatus>("Confirmada");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      const d = new Date(initial.inicio);
      setPacienteId(initial.pacienteId);
      setTratamientoId(initial.tratamientoId);
      setProfesionalId(initial.profesionalId);
      setFecha(ymd(d));
      setHora(hm(d));
      setEstado(initial.estado);
    } else {
      setPacienteId(defaults?.pacienteId ?? patients[0]?.id ?? "");
      setTratamientoId(defaults?.tratamientoId ?? treatments[0].id);
      setProfesionalId(defaults?.profesionalId ?? professionals[0].id);
      setFecha(defaults?.fecha ?? ymd(new Date()));
      setHora(defaults?.hora ?? "10:00");
      setEstado(defaults?.estado ?? "Confirmada");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = () => {
    if (!pacienteId) return;
    const inicio = new Date(`${fecha}T${hora}:00`).toISOString();
    // Conserva la duración (p. ej. tras redimensionar) salvo que cambie el tratamiento.
    const trtCambio = !initial || initial.tratamientoId !== tratamientoId;
    const duracionMin = trtCambio
      ? trtById(tratamientoId)?.duracionMin ?? 30
      : initial!.duracionMin;
    onSave({
      id: initial?.id ?? `cita-${Date.now()}`,
      pacienteId,
      tratamientoId,
      profesionalId,
      inicio,
      duracionMin,
      estado,
    });
    onClose();
  };

  const remove = () => {
    if (initial && onDelete && window.confirm("¿Eliminar esta cita?")) {
      onDelete(initial.id);
      onClose();
    }
  };

  const field = "mb-1 block text-xs font-medium text-slate-500";
  const input =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Gestionar cita" : "Nueva cita"}
      footer={
        <div className="flex w-full items-center justify-between">
          {initial && onDelete ? (
            <Button variant="ghost" onClick={remove} className="!text-rose-600 hover:!bg-rose-50">
              <Trash2 className="h-4 w-4" /> Eliminar
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={submit}>{initial ? "Guardar" : "Crear cita"}</Button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={field}>Paciente</label>
          <select className={input} value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className={field}>Tratamiento</label>
          <select className={input} value={tratamientoId} onChange={(e) => setTratamientoId(e.target.value)}>
            {treatments.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={field}>Profesional</label>
          <select className={input} value={profesionalId} onChange={(e) => setProfesionalId(e.target.value)}>
            {professionals.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className={field}>Estado</label>
          <select className={input} value={estado} onChange={(e) => setEstado(e.target.value as AppointmentStatus)}>
            {(["Confirmada", "Pendiente", "Realizada", "Cancelada"] as AppointmentStatus[]).map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={field}>Fecha</label>
          <input type="date" className={input} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div>
          <label className={field}>Hora</label>
          <div className="relative">
            <Clock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
            <input type="time" className={input} value={hora} onChange={(e) => setHora(e.target.value)} />
          </div>
        </div>
      </div>
    </Modal>
  );
}
