// Formatting at render time. API values stay raw (price as string, dates as ISO-8601 UTC).

export type Currency = "USD" | "KHR";

/** Dates are shown in Cambodia time, so server and client render the same text. */
const TIME_ZONE = "Asia/Phnom_Penh";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const khr = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** "4.5" USD → "$4.50" · "18000" KHR → "18,000៛" */
export function formatPrice(price: string, currency: Currency): string {
  const amount = Number(price);
  return currency === "USD" ? usd.format(amount) : `${khr.format(amount)}៛`;
}

const date = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "short",
  day: "numeric",
});

const time = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "2026-10-23T08:30:00Z" → "Oct 23, 2026" */
export function formatDate(iso: string): string {
  return date.format(new Date(iso));
}

/** "2026-10-23T08:30:00Z" → "3:30 PM" */
export function formatTime(iso: string): string {
  return time.format(new Date(iso));
}

/** "2026-10-23T08:30:00Z" → "Oct 23, 2026, 3:30 PM" */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}
