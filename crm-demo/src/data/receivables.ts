import type { Receivable, ReceivableStatus } from "./types";

const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const receivables: Receivable[] = [
  { id: "car-1", pacienteId: "pac-19", concepto: "Hilos tensores PDO", total: 590, pagado: 295, vencimiento: daysFromNow(8), plan: "2 cuotas mensuales" },
  { id: "car-2", pacienteId: "pac-13", concepto: "Bioestimuladores Sculptra", total: 960, pagado: 480, vencimiento: daysFromNow(-12), plan: "2 cuotas" },
  { id: "car-3", pacienteId: "pac-2", concepto: "Plan facial trimestral", total: 520, pagado: 390, vencimiento: daysFromNow(15), plan: "4 cuotas" },
  { id: "car-4", pacienteId: "pac-9", concepto: "Bótox full face", total: 380, pagado: 0, vencimiento: daysFromNow(-3), plan: "Pago único" },
  { id: "car-5", pacienteId: "pac-7", concepto: "Relleno labial 1 ml", total: 450, pagado: 225, vencimiento: daysFromNow(20), plan: "2 cuotas" },
  { id: "car-6", pacienteId: "pac-21", concepto: "Paquete PRP x3", total: 690, pagado: 230, vencimiento: daysFromNow(-25), plan: "3 cuotas" },
  { id: "car-7", pacienteId: "pac-6", concepto: "Depilación láser 6 sesiones", total: 330, pagado: 165, vencimiento: daysFromNow(5), plan: "Mensual" },
  { id: "car-8", pacienteId: "pac-15", concepto: "Bioestimulador Radiesse", total: 520, pagado: 470, vencimiento: daysFromNow(30), plan: "Saldo final" },
  { id: "car-9", pacienteId: "pac-5", concepto: "Peeling + mesoterapia", total: 225, pagado: 0, vencimiento: daysFromNow(-40), plan: "Pago único" },
];

export function receivableStatus(r: Receivable): ReceivableStatus {
  const dias = Math.round(
    (new Date(r.vencimiento).getTime() - Date.now()) / 86400000
  );
  if (dias < 0) return "Vencido";
  if (dias <= 10) return "Por vencer";
  return "Al día";
}

export function diasVencimiento(r: Receivable): number {
  return Math.round((new Date(r.vencimiento).getTime() - Date.now()) / 86400000);
}

export const saldo = (r: Receivable) => r.total - r.pagado;
