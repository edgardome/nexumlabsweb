import { clinic } from "../config/clinic";

/** Formatea un importe según la moneda y locale de la clínica. */
export function money(value: number): string {
  const fractionDigits = clinic.moneda === "COP" ? 0 : 2;
  return new Intl.NumberFormat(clinic.locale, {
    style: "currency",
    currency: clinic.moneda,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Versión compacta para tarjetas KPI: $1,2 M / $850 K. */
export function moneyCompact(value: number): string {
  const symbol = clinic.moneda === "COP" ? "$" : "€";
  if (Math.abs(value) >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toLocaleString(clinic.locale, {
      maximumFractionDigits: 1,
    })} M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${symbol}${(value / 1_000).toLocaleString(clinic.locale, {
      maximumFractionDigits: 0,
    })} K`;
  }
  return money(value);
}

/** Devuelve el número con el prefijo de país de la clínica si no lo trae. */
export function withCountry(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  return `${clinic.telefonoPais} ${trimmed}`;
}

/** Genera el enlace de WhatsApp a partir de un teléfono. */
export function waLink(phone: string): string {
  const digits = withCountry(phone).replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(clinic.locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(clinic.locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(clinic.locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayShort(iso: string): string {
  return new Date(iso).toLocaleDateString(clinic.locale, {
    day: "2-digit",
    month: "short",
  });
}

export function formatDayLong(value: string | Date): string {
  return new Date(value).toLocaleDateString(clinic.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} d`;
}

export function initials(name: string): string {
  return name
    .replace(/^(Dra?\.|Esp\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
