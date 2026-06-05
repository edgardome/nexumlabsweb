import { procedures } from "./procedures";
import { treatments, trtById } from "./treatments";
import { professionals, proById } from "./professionals";
import { patients } from "./patients";
import { clinic } from "../config/clinic";

const MONTHS_ES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

/** Ingresos por mes (últimos 6 meses) a partir del histórico de procedimientos. */
export function revenueByMonth() {
  const buckets = new Map<string, { label: string; ingresos: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i, 1);
    buckets.set(monthKey(d), { label: MONTHS_ES[d.getMonth()], ingresos: 0 });
  }
  for (const p of procedures) {
    const key = monthKey(new Date(p.fecha));
    const b = buckets.get(key);
    if (b) b.ingresos += p.importe;
  }
  return [...buckets.values()];
}

/** Procedimientos más solicitados (conteo) para la gráfica circular. */
export function topProcedures(limit = 5) {
  const counts = new Map<string, number>();
  for (const p of procedures) {
    counts.set(p.tratamientoId, (counts.get(p.tratamientoId) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([id, value]) => ({
      name: trtById(id)?.nombre.split(" · ")[0] ?? id,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/** Tratamientos más rentables por ingresos acumulados. */
export function revenueByTreatment(limit = 6) {
  const sums = new Map<string, number>();
  for (const p of procedures) {
    sums.set(p.tratamientoId, (sums.get(p.tratamientoId) ?? 0) + p.importe);
  }
  return [...sums.entries()]
    .map(([id, ingresos]) => ({
      name: trtById(id)?.nombre.split(" · ")[0] ?? id,
      ingresos,
    }))
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, limit);
}

/** Resumen de gasto por paciente (para tabla de pacientes). */
export function patientStats(pacienteId: string) {
  const propios = procedures.filter((p) => p.pacienteId === pacienteId);
  return {
    nTratamientos: propios.length,
    totalGastado: propios.reduce((s, p) => s + p.importe, 0),
  };
}

/** Comisiones por profesional para un mes dado (offset 0 = mes actual). */
export function commissionsForMonth(monthsAgo: number) {
  const ref = new Date();
  ref.setMonth(ref.getMonth() - monthsAgo);
  const key = monthKey(ref);
  return professionals.map((pro) => {
    const propios = procedures.filter(
      (p) => p.profesionalId === pro.id && monthKey(new Date(p.fecha)) === key
    );
    const generado = propios.reduce((s, p) => s + p.importe, 0);
    return {
      profesional: pro,
      nTratamientos: propios.length,
      generado,
      comision: Math.round((generado * pro.comisionPct) / 100),
    };
  });
}

/** Ocupación por profesional (nº de procedimientos, últimos 6 meses). */
export function occupancyByProfessional() {
  return professionals.map((pro) => ({
    name: pro.nombre.replace("Dra. ", "").replace("Dr. ", "").replace("Esp. ", ""),
    procedimientos: procedures.filter((p) => p.profesionalId === pro.id).length,
    color: pro.color,
  }));
}

export function totalRevenueThisMonth() {
  const months = revenueByMonth();
  return months.length ? months[months.length - 1].ingresos : 0;
}

export function newPatientsThisMonth() {
  const ref = new Date();
  return patients.filter((p) => {
    const d = new Date(p.desde);
    return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
  }).length;
}

export { MONTHS_ES };
export const accent = clinic.acento;
export const chartPalette = [
  clinic.acento,
  "#6C8CBF",
  "#B58BB0",
  "#7FB7A3",
  "#D89B6C",
  "#9A8FC0",
];

export { professionals, proById, treatments, trtById, patients };
