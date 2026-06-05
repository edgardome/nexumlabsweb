import type { Conversation } from "./types";

const minsAgo = (n: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
};

export const seedConversations: Conversation[] = [
  {
    id: "conv-1",
    telefono: "+34 611 905 772",
    nombre: "Valentina Soria",
    canal: "WhatsApp",
    agenteSilenciado: false,
    solicitudAtendida: false,
    ultimaActividad: minsAgo(6),
    solicitud: {
      procedimiento: "Bótox (toxina botulínica)",
      resumen:
        "Cliente interesada en Bótox para frente y entrecejo. Quiere agendar cita de valoración esta semana. Preguntó por costos según área de aplicación.",
      recibida: minsAgo(6),
    },
    mensajes: [
      { id: "m1", rol: "cliente", texto: "Hola, buenas tardes 🙌 quería información sobre el bótox", hora: minsAgo(22) },
      { id: "m2", rol: "agente", texto: "¡Hola! Con gusto te ayudo 😊 En la clínica aplicamos toxina botulínica para frente, entrecejo y patas de gallo. ¿Te gustaría una valoración para definir las zonas?", hora: minsAgo(21) },
      { id: "m3", rol: "cliente", texto: "Sí, me interesa. ¿Cuánto cuesta?", hora: minsAgo(18) },
      { id: "m4", rol: "agente", texto: "El valor depende de las zonas a tratar. En la valoración el médico te da el plan exacto y el precio cerrado. La valoración no tiene costo si decides realizarte el procedimiento 💛 ¿Te agendo esta semana?", hora: minsAgo(17) },
      { id: "m5", rol: "cliente", texto: "Perfecto, esta semana me sirve. En la tarde mejor", hora: minsAgo(7) },
    ],
  },
  {
    id: "conv-2",
    telefono: "+34 600 998 123",
    nombre: "Julia Patiño",
    canal: "WhatsApp",
    agenteSilenciado: true,
    solicitudAtendida: false,
    ultimaActividad: minsAgo(35),
    solicitud: {
      procedimiento: "Relleno labial · Ácido hialurónico",
      resumen:
        "Cliente quiere aumento labial con ácido hialurónico (0.5 ml). Es su primera vez, pidió ver resultados naturales. Lista para agendar.",
      recibida: minsAgo(40),
    },
    mensajes: [
      { id: "m1", rol: "cliente", texto: "Hola! quiero hacerme los labios pero algo natural, no exagerado", hora: minsAgo(58) },
      { id: "m2", rol: "agente", texto: "¡Hola Julia! Para un resultado natural recomendamos empezar con 0.5 ml de ácido hialurónico (Restylane Kysse), ideal para primera vez. Hidrata y define sin sobrecargar 👄", hora: minsAgo(57) },
      { id: "m3", rol: "cliente", texto: "Me encanta. ¿Duele?", hora: minsAgo(50) },
      { id: "m4", rol: "agente", texto: "Aplicamos anestesia tópica antes, así que la molestia es mínima 🙌 ¿Quieres que te agende una cita de valoración con el Dr. Restrepo?", hora: minsAgo(48) },
      { id: "m5", rol: "cliente", texto: "Sí porfa, cuando haya disponibilidad", hora: minsAgo(41) },
      { id: "m6", rol: "humano", texto: "Hola Julia, soy Daniela de la clínica 😊 Tenemos hueco mañana a las 15:00, ¿te viene bien?", hora: minsAgo(34) },
    ],
  },
  {
    id: "conv-3",
    telefono: "+34 622 884 220",
    nombre: "Lucía Herrera",
    canal: "WhatsApp",
    agenteSilenciado: false,
    solicitudAtendida: true,
    ultimaActividad: minsAgo(180),
    solicitud: {
      procedimiento: "Bioestimuladores · Sculptra",
      resumen:
        "Cliente de Barcelona, viaja a Madrid en julio. Quiere reservar bioestimuladores durante su estancia. Solicita presupuesto y fechas disponibles.",
      recibida: minsAgo(190),
    },
    mensajes: [
      { id: "m1", rol: "cliente", texto: "Buenas, viajo a Madrid en julio y quiero hacerme Sculptra mientras esté allí", hora: minsAgo(210) },
      { id: "m2", rol: "agente", texto: "¡Hola Lucía! Perfecto 🙌 Sculptra requiere idealmente 2 sesiones separadas. ¿Cuántos días estarás en Madrid? Así organizamos el protocolo durante tu estancia.", hora: minsAgo(208) },
      { id: "m3", rol: "cliente", texto: "Estaré 3 semanas", hora: minsAgo(200) },
      { id: "m4", rol: "agente", texto: "Genial, alcanzamos a hacer las 2 sesiones con el intervalo recomendado. Te paso disponibilidad y cotización al equipo para confirmarte fechas 💛", hora: minsAgo(198) },
      { id: "m5", rol: "humano", texto: "Hola Lucía, soy la Dra. Catalina. Tenemos cupo la primera y tercera semana de julio. Te envío la cotización al correo ✅", hora: minsAgo(182) },
    ],
  },
  {
    id: "conv-4",
    telefono: "+34 620 778 114",
    nombre: null,
    canal: "WhatsApp",
    agenteSilenciado: false,
    solicitudAtendida: false,
    ultimaActividad: minsAgo(15),
    solicitud: {
      procedimiento: "Depilación láser",
      resumen:
        "Cliente sin nombre registrado. Interesada en depilación láser de piernas completas. Preguntó por número de sesiones y precio del paquete.",
      recibida: minsAgo(15),
    },
    mensajes: [
      { id: "m1", rol: "cliente", texto: "hola, info de depilacion laser piernas completas porfa", hora: minsAgo(26) },
      { id: "m2", rol: "agente", texto: "¡Hola! 😊 Para piernas completas el protocolo suele ser de 6 a 8 sesiones cada 4-6 semanas. Manejamos paquetes con descuento. ¿Me confirmas tu nombre para registrarte y agendar tu primera sesión?", hora: minsAgo(25) },
      { id: "m3", rol: "cliente", texto: "y cuanto sale el paquete?", hora: minsAgo(16) },
    ],
  },
  {
    id: "conv-5",
    telefono: "+34 612 884 449",
    nombre: "Laura Gutiérrez",
    canal: "WhatsApp",
    agenteSilenciado: false,
    solicitudAtendida: true,
    ultimaActividad: minsAgo(1440),
    solicitud: null,
    mensajes: [
      { id: "m1", rol: "cliente", texto: "Hola, quería confirmar mi sesión de láser de mañana", hora: minsAgo(1500) },
      { id: "m2", rol: "agente", texto: "¡Hola Laura! Confirmado ✅ Tu sesión es mañana a las 10:30 con la Esp. Valentina. Recuerda venir sin cremas ni bronceador 🙌", hora: minsAgo(1498) },
      { id: "m3", rol: "cliente", texto: "Perfecto, gracias!", hora: minsAgo(1495) },
    ],
  },
];
