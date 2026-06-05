import type { Patient } from "./types";

// Fechas relativas a la fecha actual para que la demo luzca "viva".
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const patients: Patient[] = [
  { id: "pac-1", nombre: "María Fernández López", telefono: "612 408 890", email: "mafe.lopez@gmail.com", ciudad: "Madrid", desde: daysAgo(420), ultimaVisita: daysAgo(12), etiqueta: "Activo", alergias: "Lidocaína (reacción leve)", notas: "Prefiere citas por la tarde." },
  { id: "pac-2", nombre: "Valentina Soria", telefono: "611 905 772", email: "valen.soria@outlook.com", ciudad: "Madrid", desde: daysAgo(210), ultimaVisita: daysAgo(28), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "Interesada en plan de mantenimiento trimestral." },
  { id: "pac-3", nombre: "Daniela Ríos", telefono: "620 778 114", email: "dani.rios@gmail.com", ciudad: "Barcelona", desde: daysAgo(15), ultimaVisita: daysAgo(15), etiqueta: "Nuevo", alergias: "Ninguna conocida", notas: "Llegó por campaña de Instagram. Primera valoración hecha." },
  { id: "pac-4", nombre: "Carolina Mejías", telefono: "615 220 663", email: "caro.mejias@gmail.com", ciudad: "Madrid", desde: daysAgo(540), ultimaVisita: daysAgo(45), etiqueta: "Activo", alergias: "Penicilina", notas: "" },
  { id: "pac-5", nombre: "Andrea Castaño", telefono: "601 559 002", email: "andrea.cast@gmail.com", ciudad: "Sevilla", desde: daysAgo(330), ultimaVisita: daysAgo(190), etiqueta: "Inactivo", alergias: "Ninguna conocida", notas: "No responde desde hace meses. Reactivar con promo." },
  { id: "pac-6", nombre: "Laura Gutiérrez", telefono: "612 884 449", email: "laura.g@gmail.com", ciudad: "Madrid", desde: daysAgo(95), ultimaVisita: daysAgo(7), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "Bono de 6 sesiones de láser en curso." },
  { id: "pac-7", nombre: "Sofía Ramírez", telefono: "618 332 778", email: "sofia.ramirez@gmail.com", ciudad: "Málaga", desde: daysAgo(60), ultimaVisita: daysAgo(20), etiqueta: "Activo", alergias: "Látex", notas: "" },
  { id: "pac-8", nombre: "Julia Patiño", telefono: "600 998 123", email: "julia.patino@gmail.com", ciudad: "Barcelona", desde: daysAgo(8), ultimaVisita: null, etiqueta: "Nuevo", alergias: "Ninguna conocida", notas: "Pidió valoración de relleno labial. Aún no asiste." },
  { id: "pac-9", nombre: "Camila Torres", telefono: "617 445 908", email: "camila.torres@gmail.com", ciudad: "Madrid", desde: daysAgo(720), ultimaVisita: daysAgo(33), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "Paciente fiel. Bótox cada 5 meses." },
  { id: "pac-10", nombre: "Paula Gil", telefono: "613 667 221", email: "paula.gil@gmail.com", ciudad: "Madrid", desde: daysAgo(150), ultimaVisita: daysAgo(60), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-11", nombre: "Isabel Moreno", telefono: "620 110 556", email: "isa.moreno@gmail.com", ciudad: "Valencia", desde: daysAgo(40), ultimaVisita: daysAgo(40), etiqueta: "Nuevo", alergias: "Ácido acetilsalicílico (AAS)", notas: "" },
  { id: "pac-12", nombre: "Natalia Vargas", telefono: "601 223 778", email: "nata.vargas@gmail.com", ciudad: "Madrid", desde: daysAgo(480), ultimaVisita: daysAgo(210), etiqueta: "Inactivo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-13", nombre: "Gabriela Ospina", telefono: "615 778 334", email: "gabi.ospina@gmail.com", ciudad: "Zaragoza", desde: daysAgo(120), ultimaVisita: daysAgo(18), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "Interés en bioestimuladores para 2026." },
  { id: "pac-14", nombre: "Mariana Acosta", telefono: "612 009 661", email: "mariana.acosta@gmail.com", ciudad: "Madrid", desde: daysAgo(25), ultimaVisita: daysAgo(25), etiqueta: "Nuevo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-15", nombre: "Lucía Herrera", telefono: "622 884 220", email: "lucia.herrera@gmail.com", ciudad: "Barcelona", desde: daysAgo(300), ultimaVisita: daysAgo(50), etiqueta: "Activo", alergias: "Frutos secos", notas: "Reside en Barcelona, viaja a Madrid cada trimestre." },
  { id: "pac-16", nombre: "Elena Navarro", telefono: "655 120 778", email: "elena.navarro@gmail.com", ciudad: "Valencia", desde: daysAgo(70), ultimaVisita: daysAgo(70), etiqueta: "Nuevo", alergias: "Ninguna conocida", notas: "Primer contacto por WhatsApp." },
  { id: "pac-17", nombre: "Sara Jiménez", telefono: "617 220 884", email: "sara.jimenez@gmail.com", ciudad: "Madrid", desde: daysAgo(380), ultimaVisita: daysAgo(38), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-18", nombre: "Verónica Cardona", telefono: "600 556 119", email: "vero.cardona@gmail.com", ciudad: "Bilbao", desde: daysAgo(200), ultimaVisita: daysAgo(95), etiqueta: "Inactivo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-19", nombre: "Ana Quintero", telefono: "618 990 442", email: "ana.q@gmail.com", ciudad: "Madrid", desde: daysAgo(55), ultimaVisita: daysAgo(9), etiqueta: "Activo", alergias: "Ibuprofeno", notas: "Plan de pagos activo para hilos tensores." },
  { id: "pac-20", nombre: "Manuela Pérez", telefono: "615 334 776", email: "manuela.perez@gmail.com", ciudad: "Madrid", desde: daysAgo(18), ultimaVisita: daysAgo(18), etiqueta: "Nuevo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-21", nombre: "Daniela Mesa", telefono: "612 447 998", email: "daniela.mesa@gmail.com", ciudad: "Alicante", desde: daysAgo(260), ultimaVisita: daysAgo(70), etiqueta: "Activo", alergias: "Ninguna conocida", notas: "" },
  { id: "pac-22", nombre: "Alejandra Rincón", telefono: "601 778 220", email: "ale.rincon@gmail.com", ciudad: "Madrid", desde: daysAgo(610), ultimaVisita: daysAgo(120), etiqueta: "Inactivo", alergias: "Ninguna conocida", notas: "" },
];

export const pacById = (id: string) => patients.find((p) => p.id === id);
