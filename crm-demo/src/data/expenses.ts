import type { Expense } from "./types";

const thisMonth = (day: number) => {
  const d = new Date();
  d.setDate(day);
  return d.toISOString();
};
const lastMonth = (day: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1, day);
  return d.toISOString();
};

export const expenses: Expense[] = [
  { id: "egr-1", fecha: thisMonth(2), categoria: "Insumos", proveedor: "Allergan España", descripcion: "Lote toxina botulínica x10 viales", importe: 1850 },
  { id: "egr-2", fecha: thisMonth(3), categoria: "Insumos", proveedor: "Galderma", descripcion: "Restylane Kysse x6 jeringas", importe: 1560 },
  { id: "egr-3", fecha: thisMonth(5), categoria: "Nómina", proveedor: "Personal clínico", descripcion: "Quincena equipo médico y recepción", importe: 6800 },
  { id: "egr-4", fecha: thisMonth(5), categoria: "Alquiler", proveedor: "Arrendador local", descripcion: "Alquiler local clínica", importe: 2900 },
  { id: "egr-5", fecha: thisMonth(7), categoria: "Marketing", proveedor: "Meta Ads", descripcion: "Campaña Instagram/Facebook", importe: 880 },
  { id: "egr-6", fecha: thisMonth(8), categoria: "Servicios", proveedor: "Iberdrola · Agua", descripcion: "Suministros (luz y agua)", importe: 340 },
  { id: "egr-7", fecha: thisMonth(10), categoria: "Insumos", proveedor: "Merz Aesthetics", descripcion: "Bioestimulador x4", importe: 1420 },
  { id: "egr-8", fecha: thisMonth(12), categoria: "Marketing", proveedor: "Agencia Aura", descripcion: "Producción contenido redes", importe: 620 },
  { id: "egr-9", fecha: thisMonth(14), categoria: "Servicios", proveedor: "Holded", descripcion: "Software de gestión y CRM", importe: 95 },
  { id: "egr-10", fecha: thisMonth(15), categoria: "Insumos", proveedor: "Suministros Médicos SL", descripcion: "Consumibles, jeringas y agujas", importe: 480 },
  // mes anterior (para comparativos)
  { id: "egr-11", fecha: lastMonth(4), categoria: "Nómina", proveedor: "Personal clínico", descripcion: "Quincena equipo", importe: 6650 },
  { id: "egr-12", fecha: lastMonth(5), categoria: "Alquiler", proveedor: "Arrendador local", descripcion: "Alquiler local clínica", importe: 2900 },
  { id: "egr-13", fecha: lastMonth(9), categoria: "Insumos", proveedor: "Galderma", descripcion: "Reposición rellenos", importe: 1680 },
  { id: "egr-14", fecha: lastMonth(18), categoria: "Marketing", proveedor: "Meta Ads", descripcion: "Campaña valoraciones", importe: 1040 },
];
