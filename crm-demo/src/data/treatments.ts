import type { Treatment } from "./types";

// Precios en EUR (tarifas orientativas de clínica estética en España).
export const treatments: Treatment[] = [
  {
    id: "trt-botox",
    nombre: "Bótox (toxina botulínica)",
    descripcion:
      "Suavizado de líneas de expresión en frente, entrecejo y patas de gallo.",
    duracionMin: 30,
    precio: 290,
    categoria: "Toxina botulínica",
  },
  {
    id: "trt-relleno-labial",
    nombre: "Relleno labial · Ácido hialurónico",
    descripcion:
      "Aumento y perfilado de labios con Restylane Kysse / Juvederm. 0.5–1 ml.",
    duracionMin: 45,
    precio: 350,
    categoria: "Rellenos",
  },
  {
    id: "trt-hilos-pdo",
    nombre: "Hilos tensores PDO",
    descripcion: "Efecto lifting no quirúrgico para flacidez facial leve.",
    duracionMin: 60,
    precio: 590,
    categoria: "Hilos tensores",
  },
  {
    id: "trt-bioestimulador",
    nombre: "Bioestimuladores · Sculptra / Radiesse",
    descripcion:
      "Estimulación de colágeno para mejorar firmeza y calidad de la piel.",
    duracionMin: 50,
    precio: 480,
    categoria: "Bioestimulación",
  },
  {
    id: "trt-meso",
    nombre: "Mesoterapia facial",
    descripcion: "Hidratación profunda y luminosidad con microinyecciones.",
    duracionMin: 40,
    precio: 130,
    categoria: "Facial",
  },
  {
    id: "trt-peeling",
    nombre: "Peeling químico",
    descripcion: "Renovación celular para manchas, textura y poros.",
    duracionMin: 45,
    precio: 95,
    categoria: "Facial",
  },
  {
    id: "trt-prp",
    nombre: "Plasma rico en plaquetas (PRP)",
    descripcion: "Rejuvenecimiento con factores de crecimiento del paciente.",
    duracionMin: 60,
    precio: 240,
    categoria: "Bioestimulación",
  },
  {
    id: "trt-limpieza",
    nombre: "Limpieza facial profunda",
    descripcion: "Extracción, exfoliación e hidratación. Ideal mantenimiento.",
    duracionMin: 60,
    precio: 65,
    categoria: "Facial",
  },
  {
    id: "trt-laser",
    nombre: "Depilación láser",
    descripcion: "Depilación progresiva por zonas con láser de diodo.",
    duracionMin: 30,
    precio: 55,
    categoria: "Láser",
  },
];

export const trtById = (id: string) => treatments.find((t) => t.id === id);
