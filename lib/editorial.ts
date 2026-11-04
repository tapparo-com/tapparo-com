export function formatEditorialDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("de-DE", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin",
  });
}
