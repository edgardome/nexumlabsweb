import type { Professional } from "./types";

export const professionals: Professional[] = [
  {
    id: "pro-1",
    nombre: "Dra. Catalina Restrepo",
    rol: "Medicina estética",
    color: "#C9A24B",
    comisionPct: 12,
  },
  {
    id: "pro-2",
    nombre: "Dr. Andrés Restrepo",
    rol: "Cirugía menor y rellenos",
    color: "#6C8CBF",
    comisionPct: 15,
  },
  {
    id: "pro-3",
    nombre: "Esp. Valentina Gómez",
    rol: "Cosmetología y faciales",
    color: "#B58BB0",
    comisionPct: 10,
  },
];

export const proById = (id: string) =>
  professionals.find((p) => p.id === id);
