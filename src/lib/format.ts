import { VENUE_TIME_ZONE } from "./config";

const LOCALE = "es";

function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase(LOCALE) + text.slice(1);
}

function parts(iso: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: VENUE_TIME_ZONE, ...options }).format(new Date(iso));
}

/** "Sábado 21 de noviembre" */
export function formatLongDate(iso: string): string {
  return capitalize(parts(iso, { weekday: "long", day: "numeric", month: "long" }).replace(",", ""));
}

/** "Sábado 21 de noviembre, 14:00" */
export function formatLongDateTime(iso: string): string {
  return `${formatLongDate(iso)}, ${parts(iso, { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}

/** Partes para la DateBar: día de la semana, número y mes. */
export function dateBarParts(iso: string): { weekday: string; day: string; month: string } {
  return {
    weekday: parts(iso, { weekday: "long" }).toLocaleUpperCase(LOCALE),
    day: parts(iso, { day: "numeric" }),
    month: parts(iso, { month: "long" }).toLocaleUpperCase(LOCALE),
  };
}

export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
