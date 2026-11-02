import { WEEKDAYS, validateWeeklySchedule, type HoursRow } from "../../lib/opening-hours";

// Deliberately narrow: convert the audited grouped schedule, never guess from
// arbitrary prose. Original fields remain untouched and new fields use setIfMissing.
export function prepareHoursMigration(document: { openingHours?: HoursRow[] | null; weeklySchedule?: unknown; closedOnPublicHolidays?: boolean }) {
  if (document.weeklySchedule != null) return null;
  const rows = document.openingHours;
  if (!rows || rows.length !== 3) throw new Error("Review the existing text hours manually before migrating.");
  const normalize = (value: string) => value.trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+/g, " ");
  const weekdays = rows.find(row => normalize(row.day) === "montag - samstag");
  const sunday = rows.find(row => normalize(row.day) === "sonntag");
  const holiday = rows.find(row => normalize(row.day) === "feiertage");
  const closed = (row?: HoursRow) => row && ["closed", "geschlossen"].includes(normalize(row.hours));
  const times = weekdays?.hours.match(/^(\d{2}:\d{2})\s*[-–—]\s*(\d{2}:\d{2})$/);
  if (!times || !closed(sunday) || !closed(holiday)) throw new Error("Text hours differ from the audited Monday–Saturday / Sunday / holiday model. Review instead of guessing.");
  const weeklySchedule = Object.fromEntries(WEEKDAYS.map(day => [day, {
    _type: day, closed: day === "sunday",
    ...(day !== "sunday" && { periods: [{ _type: "openingPeriod", _key: `${day}-regular`, start: times[1], end: times[2], nextDay: false }] }),
  }]));
  const validation = validateWeeklySchedule(weeklySchedule);
  if (validation !== true) throw new Error(validation);
  return { weeklySchedule: { _type: "weeklySchedule", ...weeklySchedule }, closedOnPublicHolidays: document.closedOnPublicHolidays ?? true };
}
