export const TIME_ZONE = "Europe/Berlin";
export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export const DAY_LABELS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
export type Weekday = typeof WEEKDAYS[number];
export type OpeningPeriod = { _key?: string; start: string; end: string; nextDay?: boolean };
export type OpeningDay = { closed: boolean; periods?: OpeningPeriod[] | null };
export type DateException = OpeningDay & { _key?: string; date: string; note?: string };
export type TemporaryClosure = { _key?: string; startDate: string; endDate?: string; note?: string };
export type HoursRow = { _key: string; day: string; hours: string };
export type HoursSettings = {
  openingHours?: HoursRow[] | null;
  weeklySchedule?: Partial<Record<Weekday, OpeningDay>> | null;
  closedOnPublicHolidays?: boolean;
  dateExceptions?: DateException[] | null;
  temporaryClosures?: TemporaryClosure[] | null;
};
export type OpeningStatus = "open" | "closed" | "unknown";

const MINUTE = 60_000, DAY = 86_400_000;
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number(value.slice(0, 4)) >= 2000 && Number(value.slice(0, 4)) <= 2199
    && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}
function utcDate(date: string) { return Date.parse(`${date}T00:00:00Z`); }
export function addDays(date: string, amount: number) { return new Date(utcDate(date) + amount * DAY).toISOString().slice(0, 10); }
function weekday(date: string) { return WEEKDAYS[(new Date(utcDate(date)).getUTCDay() + 6) % 7]; }
function minutes(time: string) { const [h, m] = time.split(":").map(Number); return h * 60 + m; }
function localParts(instant: number) {
  const parts = Object.fromEntries(formatter.formatToParts(instant).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}
function wallTimestamp(instant: number) { const p = localParts(instant); return utcDate(p.date) + minutes(p.time) * MINUTE; }

// Resolve Berlin wall time to a real instant. Repeated times use the first opening
// and last closing; missing spring times move forward by the DST gap.
export function berlinInstant(date: string, time: string, boundary: "start" | "end") {
  const wall = utcDate(date) + minutes(time) * MINUTE;
  const offsets = new Set([-DAY, 0, DAY].map(delta => wallTimestamp(wall + delta) - (wall + delta)));
  const candidates = [...offsets].map(offset => wall - offset);
  const exact = candidates.filter(candidate => wallTimestamp(candidate) === wall);
  if (exact.length) return boundary === "start" ? Math.min(...exact) : Math.max(...exact);
  return Math.min(...candidates.filter(candidate => wallTimestamp(candidate) > wall));
}

export function validatePeriods(periods: unknown): true | string {
  if (!Array.isArray(periods) || periods.length === 0) return "Add at least one opening period, or mark this day closed.";
  const intervals: [number, number][] = [];
  for (const period of periods) {
    if (!period || !timePattern.test(period.start) || !timePattern.test(period.end)) return "Use 24-hour times in HH:mm format (00:00–23:59).";
    if (period.nextDay !== undefined && typeof period.nextDay !== "boolean") return "Closes next day must be on or off.";
    const start = minutes(period.start), end = minutes(period.end) + (period.nextDay ? 1440 : 0);
    if (end <= start || end - start > 1440) return "Closing must follow opening within 24 hours. For overnight service, enable Closes next day.";
    intervals.push([start, end]);
  }
  intervals.sort((a, b) => a[0] - b[0]);
  if (intervals.some((interval, i) => i > 0 && interval[0] < intervals[i - 1][1])) return "Opening periods must not overlap.";
  return true;
}
export function validateDay(value: unknown): true | string {
  const day = value as OpeningDay | undefined;
  if (!day || typeof day.closed !== "boolean") return "Choose whether this day is closed.";
  return day.closed ? true : validatePeriods(day.periods);
}
export function validateWeeklySchedule(value: unknown): true | string {
  if (value == null) return true; // Existing documents retain their text hours until migrated.
  const schedule = value as NonNullable<HoursSettings["weeklySchedule"]>;
  for (const [index, day] of WEEKDAYS.entries()) {
    const result = validateDay(schedule[day]);
    if (result !== true) return `${DAY_LABELS[index]}: ${result}`;
    const current = schedule[day]!, next = schedule[WEEKDAYS[(index + 1) % 7]];
    if (!current.closed && next?.closed === false && validatePeriods(next.periods) === true) {
      const carry = Math.max(0, ...current.periods!.filter(p => p.nextDay).map(p => minutes(p.end)));
      if (next.periods!.some(p => minutes(p.start) < carry)) return `${DAY_LABELS[index]}: overnight hours overlap the following day's opening.`;
    }
  }
  return true;
}
export function validateExceptions(value: unknown): true | string {
  if (value == null) return true;
  if (!Array.isArray(value)) return "Enter date exceptions as a list.";
  const dates = new Set<string>();
  for (const item of value) {
    if (!isDate(item?.date)) return "Choose a valid exception date (2000–2199).";
    if (dates.has(item.date)) return "Use only one exception per date.";
    dates.add(item.date);
    const result = validateDay(item); if (result !== true) return `${item.date}: ${result}`;
  }
  return true;
}
export function validateClosures(value: unknown): true | string {
  if (value == null) return true;
  if (!Array.isArray(value)) return "Enter temporary closures as a list.";
  for (const closure of value) {
    if (!isDate(closure?.startDate)) return "Choose a valid first closed day (2000–2199).";
    if (closure.endDate && (!isDate(closure.endDate) || closure.endDate < closure.startDate)) return "The last closed day must be on or after the first closed day.";
  }
  return true;
}

// Munich's public holidays, including Mariä Himmelfahrt; Augsburg's local
// Friedensfest is intentionally excluded. Source and review date are in docs/opening-hours.md.
export function munichHolidays(year: number): Record<string, string> {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = (h + l - 7 * m + 114) % 31 + 1;
  const easter = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return {
    [`${year}-01-01`]: "Neujahr", [`${year}-01-06`]: "Heilige Drei Könige",
    [addDays(easter, -2)]: "Karfreitag", [addDays(easter, 1)]: "Ostermontag",
    [`${year}-05-01`]: "Tag der Arbeit", [addDays(easter, 39)]: "Christi Himmelfahrt",
    [addDays(easter, 50)]: "Pfingstmontag", [addDays(easter, 60)]: "Fronleichnam",
    [`${year}-08-15`]: "Mariä Himmelfahrt", [`${year}-10-03`]: "Tag der Deutschen Einheit",
    [`${year}-11-01`]: "Allerheiligen", [`${year}-12-25`]: "1. Weihnachtstag", [`${year}-12-26`]: "2. Weihnachtstag",
  };
}
function daySchedule(settings: HoursSettings, date: string) {
  if (settings.temporaryClosures?.some(c => c.startDate <= date && (!c.endDate || date <= c.endDate))) return { closed: true, override: true } as const;
  const exception = settings.dateExceptions?.find(e => e.date === date);
  if (exception) return { ...exception, override: true };
  if (settings.closedOnPublicHolidays !== false && munichHolidays(Number(date.slice(0, 4)))[date]) return { closed: true, override: true } as const;
  return { ...settings.weeklySchedule![weekday(date)]!, override: false };
}
export function getOpeningStatus(settings: HoursSettings | null | undefined, now = new Date()): OpeningStatus {
  if (!settings?.weeklySchedule || !Number.isFinite(now.getTime()) || validateWeeklySchedule(settings.weeklySchedule) !== true
    || validateExceptions(settings.dateExceptions) !== true || validateClosures(settings.temporaryClosures) !== true) return "unknown";
  const date = localParts(now.getTime()).date;
  const today = daySchedule(settings, date);
  if (today.closed && today.override) return "closed";
  // A date exception replaces that entire calendar date, including any carry-over.
  const dates = today.override ? [date] : [addDays(date, -1), date];
  for (const startDate of dates) {
    const schedule = daySchedule(settings, startDate);
    if (schedule.closed) continue;
    for (const period of schedule.periods || []) {
      const start = berlinInstant(startDate, period.start, "start");
      const end = berlinInstant(period.nextDay ? addDays(startDate, 1) : startDate, period.end, "end");
      if (start <= now.getTime() && now.getTime() < end) return "open";
    }
  }
  return "closed";
}

// Keep existing public hours components on the same source as the live status.
// Original text is retained in Sanity and remains the fallback on unmigrated datasets.
export function getHoursRows(settings: HoursSettings | null | undefined): HoursRow[] {
  if (!settings?.weeklySchedule || validateWeeklySchedule(settings.weeklySchedule) !== true) return settings?.openingHours || [];
  const rows: HoursRow[] = [];
  let start = 0;
  const text = WEEKDAYS.map(day => {
    const entry = settings.weeklySchedule![day]!;
    return entry.closed ? "Geschlossen" : [...entry.periods!].sort((a, b) => a.start.localeCompare(b.start)).map(p => `${p.start} - ${p.end}${p.nextDay ? " (Folgetag)" : ""}`).join(", ");
  });
  for (let index = 0; index < WEEKDAYS.length; index++) {
    if (index < 6 && text[index] === text[index + 1]) continue;
    rows.push({ _key: WEEKDAYS[start], day: start === index ? DAY_LABELS[start] : `${DAY_LABELS[start]} - ${DAY_LABELS[index]}`, hours: text[index] });
    start = index + 1;
  }
  if (settings.closedOnPublicHolidays !== false) rows.push({ _key: "public-holidays", day: "Feiertage", hours: "Geschlossen" });
  return rows;
}
