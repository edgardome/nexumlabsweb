import type { Procedure } from "./types";
import { treatments, trtById } from "./treatments";
import { patients } from "./patients";
import { professionals } from "./professionals";

// Genera un histórico realista de procedimientos de los últimos ~6 meses,
// distribuido por mes para que las gráficas de ingresos luzcan coherentes.

const patientIds = patients.map((p) => p.id);
const proIds = professionals.map((p) => p.id);
const trtIds = treatments.map((t) => t.id);

// Nº aproximado de procedimientos por mes (mes 0 = hace 5 meses … mes 5 = actual)
const perMonth = [34, 39, 37, 46, 43, 31];

function dateInMonth(monthsAgo: number, day: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo, day);
  d.setHours(10 + (day % 7), 0, 0, 0);
  return d.toISOString();
}

const list: Procedure[] = [];
let seq = 0;
for (let m = 5; m >= 0; m--) {
  const count = perMonth[5 - m];
  for (let i = 0; i < count; i++) {
    const trtId = trtIds[(seq * 3 + i) % trtIds.length];
    const base = trtById(trtId)!.precio;
    // pequeña variación de importe (descuentos / ml extra)
    const factor = 1 + (((seq * 7 + i) % 5) - 2) * 0.04;
    list.push({
      id: `proc-${seq + 1}`,
      fecha: dateInMonth(m, 2 + ((i * 2 + seq) % 26)),
      pacienteId: patientIds[(seq * 5 + i) % patientIds.length],
      tratamientoId: trtId,
      profesionalId: proIds[(seq + i) % proIds.length],
      importe: Math.round((base * factor) / 5) * 5,
    });
    seq++;
  }
}

export const procedures: Procedure[] = list.sort(
  (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
);
