export interface Professional {
  id: string;
  nombre: string;
  rol: string;
  color: string; // color para avatar/identificación
  comisionPct: number; // % de comisión sobre lo generado
}

export type TreatmentCategory =
  | "Toxina botulínica"
  | "Rellenos"
  | "Bioestimulación"
  | "Hilos tensores"
  | "Facial"
  | "Láser";

export interface Treatment {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMin: number;
  precio: number;
  categoria: TreatmentCategory;
}

export type PatientTag = "Activo" | "Nuevo" | "Inactivo";

export interface Patient {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  desde: string; // ISO fecha de alta
  ultimaVisita: string | null; // ISO
  etiqueta: PatientTag;
  alergias: string; // alergias / contraindicaciones — crítico antes de cualquier procedimiento
  notas: string;
}

export type DocumentKind = "antes" | "despues" | "documento";

export interface ClinicDocument {
  id: string;
  pacienteId: string;
  tipo: DocumentKind;
  titulo: string;
  mime: string;
  dataUrl: string; // imagen/documento codificado (data URL) — persistido en localStorage
  fecha: string; // ISO
}

export type AppointmentStatus =
  | "Confirmada"
  | "Pendiente"
  | "Cancelada"
  | "Realizada";

export interface Appointment {
  id: string;
  pacienteId: string;
  tratamientoId: string;
  profesionalId: string;
  inicio: string; // ISO datetime
  duracionMin: number;
  estado: AppointmentStatus;
}

export interface Procedure {
  id: string;
  fecha: string; // ISO
  pacienteId: string;
  tratamientoId: string;
  profesionalId: string;
  importe: number;
}

export type ReceivableStatus = "Al día" | "Por vencer" | "Vencido";

export interface Receivable {
  id: string;
  pacienteId: string;
  concepto: string;
  total: number;
  pagado: number;
  vencimiento: string; // ISO
  plan: string;
}

export type ExpenseCategory =
  | "Insumos"
  | "Nómina"
  | "Alquiler"
  | "Marketing"
  | "Servicios";

export interface Expense {
  id: string;
  fecha: string;
  categoria: ExpenseCategory;
  proveedor: string;
  descripcion: string;
  importe: number;
}

export interface InventoryItem {
  id: string;
  producto: string;
  categoria: string;
  unidad: string;
  stock: number;
  stockMinimo: number;
  proveedor: string;
  caducidad: string; // ISO
}

export interface ChatMessage {
  id: string;
  rol: "cliente" | "agente" | "humano";
  texto: string;
  hora: string; // ISO
}

export interface AppointmentRequest {
  procedimiento: string;
  resumen: string;
  recibida: string; // ISO
}

export interface Conversation {
  id: string;
  telefono: string;
  nombre: string | null;
  canal: "WhatsApp";
  mensajes: ChatMessage[];
  solicitud: AppointmentRequest | null;
  solicitudAtendida: boolean;
  agenteSilenciado: boolean; // true = tomado por humano
  ultimaActividad: string; // ISO
}
