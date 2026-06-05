import type { InventoryItem } from "./types";

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const inventory: InventoryItem[] = [
  { id: "inv-1", producto: "Bótox · vial 100U (Allergan)", categoria: "Toxina", unidad: "viales", stock: 3, stockMinimo: 5, proveedor: "Allergan España", caducidad: inDays(180) },
  { id: "inv-2", producto: "Restylane Kysse · jeringa 1ml", categoria: "Relleno", unidad: "jeringas", stock: 8, stockMinimo: 4, proveedor: "Galderma", caducidad: inDays(240) },
  { id: "inv-3", producto: "Juvederm Volift · jeringa 1ml", categoria: "Relleno", unidad: "jeringas", stock: 2, stockMinimo: 4, proveedor: "Allergan España", caducidad: inDays(95) },
  { id: "inv-4", producto: "Hilos PDO Cog 19G", categoria: "Hilos", unidad: "unidades", stock: 24, stockMinimo: 10, proveedor: "MediThreads", caducidad: inDays(420) },
  { id: "inv-5", producto: "Sculptra · vial", categoria: "Bioestimulador", unidad: "viales", stock: 4, stockMinimo: 3, proveedor: "Galderma", caducidad: inDays(300) },
  { id: "inv-6", producto: "Radiesse · jeringa 1.5ml", categoria: "Bioestimulador", unidad: "jeringas", stock: 1, stockMinimo: 3, proveedor: "Merz Aesthetics", caducidad: inDays(150) },
  { id: "inv-7", producto: "Agujas 30G x100", categoria: "Consumible", unidad: "cajas", stock: 12, stockMinimo: 5, proveedor: "Médica Total", caducidad: inDays(700) },
  { id: "inv-8", producto: "Cánulas 22G", categoria: "Consumible", unidad: "unidades", stock: 40, stockMinimo: 15, proveedor: "Médica Total", caducidad: inDays(650) },
  { id: "inv-9", producto: "Ácido kójico peeling", categoria: "Facial", unidad: "frascos", stock: 2, stockMinimo: 4, proveedor: "DermaPro", caducidad: inDays(60) },
  { id: "inv-10", producto: "Tubos PRP estériles", categoria: "Consumible", unidad: "unidades", stock: 30, stockMinimo: 10, proveedor: "BioTubes", caducidad: inDays(500) },
  { id: "inv-11", producto: "Anestésico tópico EMLA", categoria: "Consumible", unidad: "tubos", stock: 6, stockMinimo: 6, proveedor: "Médica Total", caducidad: inDays(120) },
  { id: "inv-12", producto: "Mascarillas hidratantes post-láser", categoria: "Facial", unidad: "unidades", stock: 18, stockMinimo: 10, proveedor: "DermaPro", caducidad: inDays(280) },
];

export const stockBajo = (i: InventoryItem) => i.stock < i.stockMinimo;
