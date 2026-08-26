// Utility formatting terpusat.
// Jangan format Rupiah/liter/tanggal manual di komponen — selalu lewat sini,
// biar konsisten di seluruh app (kesepakatan working principle).

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatVolume(liters: number): string {
  return `${new Intl.NumberFormat("id-ID").format(liters)} L`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
    hour12: false,
  }).format(d);
}

export function daysSince(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Returns today's date in 'YYYY-MM-DD' strictly using Asia/Jakarta (WIB) timezone.
 */
export function getTodayWIB(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Returns the first day of the current month in 'YYYY-MM-01' using Asia/Jakarta (WIB).
 */
export function getStartOfMonthWIB(): string {
  const today = getTodayWIB();
  return `${today.slice(0, 7)}-01`;
}

