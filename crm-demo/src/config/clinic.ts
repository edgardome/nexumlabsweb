// ─────────────────────────────────────────────────────────────────────────────
//  BRANDING POR CLÍNICA
//  Edita SOLO este archivo para personalizar la demo para cada clínica.
//  Todo el formateo de moneda y teléfonos del CRM lee de aquí.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClinicConfig {
  nombre: string;
  iniciales: string; // para el logo si no hay imagen
  acento: string; // color de marca (hex)
  moneda: "COP" | "EUR";
  locale: "es-CO" | "es-ES";
  telefonoPais: string; // prefijo internacional por defecto, p. ej. "+57"
}

// Valores por defecto (editables aquí o desde el panel de Configuración de la app).
const defaults: ClinicConfig = {
  nombre: "Clínica Estética Demo",
  iniciales: "CD",
  acento: "#C9A24B", // oro elegante
  moneda: "EUR",
  locale: "es-ES",
  telefonoPais: "+34",
};

// Objeto mutable que lee el resto de la app. Se hidrata en el arranque desde
// localStorage si el usuario ha personalizado la marca en el panel de ajustes.
export const clinic: ClinicConfig = { ...defaults };

const STORAGE_KEY = "nexum-crm:clinic";

/** Aplica overrides guardados. Llamar una vez al arrancar, antes de renderizar. */
export function loadClinicOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) Object.assign(clinic, JSON.parse(raw));
  } catch {
    /* ignore */
  }
}

/** Persiste cambios de marca. La app recarga para aplicarlos en todas partes. */
export function saveClinic(patch: Partial<ClinicConfig>) {
  Object.assign(clinic, patch);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clinic));
  } catch {
    /* ignore */
  }
}

export const clinicDefaults = defaults;
