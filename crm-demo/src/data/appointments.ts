import type { Appointment, AppointmentStatus } from "./types";
import { trtById } from "./treatments";

/** Construye un ISO datetime a partir de un offset de días y una hora local. */
function at(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

interface Seed {
  pacienteId: string;
  tratamientoId: string;
  profesionalId: string;
  dayOffset: number;
  hour: number;
  minute?: number;
  estado: AppointmentStatus;
}

const seeds: Seed[] = [
  // ── HOY ───────────────────────────────────────────────────────────────
  { pacienteId: "pac-1", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: 0, hour: 9, estado: "Confirmada" },
  { pacienteId: "pac-6", tratamientoId: "trt-laser", profesionalId: "pro-3", dayOffset: 0, hour: 10, minute: 30, estado: "Confirmada" },
  { pacienteId: "pac-9", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: 0, hour: 11, minute: 30, estado: "Pendiente" },
  { pacienteId: "pac-19", tratamientoId: "trt-hilos-pdo", profesionalId: "pro-2", dayOffset: 0, hour: 14, estado: "Confirmada" },
  { pacienteId: "pac-3", tratamientoId: "trt-meso", profesionalId: "pro-3", dayOffset: 0, hour: 15, minute: 30, estado: "Confirmada" },
  { pacienteId: "pac-13", tratamientoId: "trt-bioestimulador", profesionalId: "pro-1", dayOffset: 0, hour: 16, minute: 30, estado: "Pendiente" },
  // ── MAÑANA ────────────────────────────────────────────────────────────
  { pacienteId: "pac-2", tratamientoId: "trt-relleno-labial", profesionalId: "pro-2", dayOffset: 1, hour: 9, minute: 30, estado: "Confirmada" },
  { pacienteId: "pac-7", tratamientoId: "trt-peeling", profesionalId: "pro-3", dayOffset: 1, hour: 11, estado: "Confirmada" },
  { pacienteId: "pac-10", tratamientoId: "trt-prp", profesionalId: "pro-1", dayOffset: 1, hour: 13, estado: "Pendiente" },
  { pacienteId: "pac-8", tratamientoId: "trt-relleno-labial", profesionalId: "pro-2", dayOffset: 1, hour: 15, estado: "Confirmada" },
  { pacienteId: "pac-17", tratamientoId: "trt-limpieza", profesionalId: "pro-3", dayOffset: 1, hour: 16, minute: 30, estado: "Confirmada" },
  // ── ESTA SEMANA (futuro) ───────────────────────────────────────────────
  { pacienteId: "pac-4", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: 2, hour: 10, estado: "Confirmada" },
  { pacienteId: "pac-14", tratamientoId: "trt-meso", profesionalId: "pro-3", dayOffset: 2, hour: 12, estado: "Pendiente" },
  { pacienteId: "pac-20", tratamientoId: "trt-limpieza", profesionalId: "pro-3", dayOffset: 2, hour: 14, minute: 30, estado: "Confirmada" },
  { pacienteId: "pac-11", tratamientoId: "trt-relleno-labial", profesionalId: "pro-2", dayOffset: 3, hour: 9, estado: "Confirmada" },
  { pacienteId: "pac-21", tratamientoId: "trt-prp", profesionalId: "pro-1", dayOffset: 3, hour: 11, minute: 30, estado: "Pendiente" },
  { pacienteId: "pac-16", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: 4, hour: 15, estado: "Confirmada" },
  { pacienteId: "pac-15", tratamientoId: "trt-bioestimulador", profesionalId: "pro-2", dayOffset: 5, hour: 10, minute: 30, estado: "Confirmada" },
  // ── PASADO RECIENTE ────────────────────────────────────────────────────
  { pacienteId: "pac-1", tratamientoId: "trt-limpieza", profesionalId: "pro-3", dayOffset: -2, hour: 10, estado: "Realizada" },
  { pacienteId: "pac-6", tratamientoId: "trt-laser", profesionalId: "pro-3", dayOffset: -3, hour: 12, estado: "Realizada" },
  { pacienteId: "pac-9", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: -4, hour: 9, estado: "Realizada" },
  { pacienteId: "pac-2", tratamientoId: "trt-meso", profesionalId: "pro-3", dayOffset: -5, hour: 16, estado: "Realizada" },
  { pacienteId: "pac-5", tratamientoId: "trt-peeling", profesionalId: "pro-3", dayOffset: -6, hour: 11, estado: "Cancelada" },
  { pacienteId: "pac-19", tratamientoId: "trt-hilos-pdo", profesionalId: "pro-2", dayOffset: -7, hour: 14, estado: "Realizada" },
  { pacienteId: "pac-13", tratamientoId: "trt-prp", profesionalId: "pro-1", dayOffset: -8, hour: 15, estado: "Realizada" },
  { pacienteId: "pac-7", tratamientoId: "trt-relleno-labial", profesionalId: "pro-2", dayOffset: -9, hour: 10, minute: 30, estado: "Realizada" },
  { pacienteId: "pac-10", tratamientoId: "trt-botox", profesionalId: "pro-1", dayOffset: -10, hour: 13, estado: "Realizada" },
  { pacienteId: "pac-17", tratamientoId: "trt-bioestimulador", profesionalId: "pro-1", dayOffset: -11, hour: 9, minute: 30, estado: "Realizada" },
  { pacienteId: "pac-21", tratamientoId: "trt-meso", profesionalId: "pro-3", dayOffset: -12, hour: 12, estado: "Realizada" },
  { pacienteId: "pac-4", tratamientoId: "trt-laser", profesionalId: "pro-3", dayOffset: -13, hour: 17, estado: "Realizada" },
  { pacienteId: "pac-12", tratamientoId: "trt-limpieza", profesionalId: "pro-3", dayOffset: -14, hour: 11, estado: "Cancelada" },
  { pacienteId: "pac-3", tratamientoId: "trt-peeling", profesionalId: "pro-3", dayOffset: -15, hour: 16, estado: "Realizada" },
];

export const appointments: Appointment[] = seeds.map((s, i) => ({
  id: `cita-${i + 1}`,
  pacienteId: s.pacienteId,
  tratamientoId: s.tratamientoId,
  profesionalId: s.profesionalId,
  inicio: at(s.dayOffset, s.hour, s.minute ?? 0),
  duracionMin: trtById(s.tratamientoId)?.duracionMin ?? 30,
  estado: s.estado,
}));
