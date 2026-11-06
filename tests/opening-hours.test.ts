import test from "node:test";
import assert from "node:assert/strict";
import {
  WEEKDAYS,
  berlinInstant,
  getOpeningStatus,
  getHoursRows,
  isDate,
  munichHolidays,
  validatePeriods,
  validateWeeklySchedule,
  validateExceptions,
  validateClosures,
  type HoursSettings,
  type OpeningDay,
} from "../lib/opening-hours";

const period = (start = "10:00", end = "21:00", nextDay = false) => ({
  start,
  end,
  nextDay,
});
const open = (...periods: ReturnType<typeof period>[]): OpeningDay => ({
  closed: false,
  periods,
});
function settings(): HoursSettings {
  return {
    weeklySchedule: Object.fromEntries(
      WEEKDAYS.map((day) => [
        day,
        day === "sunday" ? { closed: true } : open(period()),
      ]),
    ),
    closedOnPublicHolidays: true,
  };
}
const status = (hours: HoursSettings | null, at: string) =>
  getOpeningStatus(hours, new Date(at));

test("Berlin hours use half-open boundaries independently of the visitor timezone", () => {
  const h = settings();
  assert.equal(status(h, "2026-11-02T08:59:59Z"), "closed");
  assert.equal(status(h, "2026-11-02T09:00:00Z"), "open");
  assert.equal(status(h, "2026-11-02T19:59:59Z"), "open");
  assert.equal(status(h, "2026-11-02T20:00:00Z"), "closed");
  assert.equal(status(h, "2026-07-06T08:00:00Z"), "open");
  assert.equal(status(h, "2026-07-06T19:00:00Z"), "closed");
  assert.equal(status(h, "2026-11-08T12:00:00Z"), "closed");
});

test("split periods and overnight service include the previous day and week boundary", () => {
  const h = settings();
  h.weeklySchedule!.monday = open(
    period("10:00", "13:00"),
    period("17:00", "21:00"),
  );
  assert.equal(status(h, "2026-11-02T12:00:00Z"), "closed");
  assert.equal(status(h, "2026-11-02T16:00:00Z"), "open");
  h.weeklySchedule!.saturday = open(period("18:00", "02:00", true));
  assert.equal(status(h, "2026-11-08T00:59:59Z"), "open");
  assert.equal(status(h, "2026-11-08T01:00:00Z"), "closed");
  h.weeklySchedule!.sunday = open(period("18:00", "02:00", true));
  assert.equal(status(h, "2026-11-09T00:30:00Z"), "open");
});

test("Munich holiday calendar includes fixed/movable dates and excludes other cities' holidays", () => {
  const dates = munichHolidays(2026);
  assert.equal(Object.keys(dates).length, 13);
  for (const date of [
    "2026-01-01",
    "2026-01-06",
    "2026-04-03",
    "2026-04-06",
    "2026-05-01",
    "2026-05-14",
    "2026-05-25",
    "2026-06-04",
    "2026-08-15",
    "2026-10-03",
    "2026-11-01",
    "2026-12-25",
    "2026-12-26",
  ])
    assert(dates[date], date);
  assert.equal(munichHolidays(2027)["2027-03-26"], "Karfreitag");
  assert.equal(munichHolidays(2027)["2027-05-27"], "Fronleichnam");
  for (const date of ["2026-08-08", "2026-10-31", "2026-12-24", "2026-12-31"])
    assert.equal(dates[date], undefined);
  assert.equal(status(settings(), "2026-08-15T10:00:00Z"), "closed");
});

test("exceptions override holidays and the whole date; temporary closures win", () => {
  const h = settings();
  h.dateExceptions = [
    { date: "2026-12-25", ...open(period("12:00", "15:00")) },
  ];
  assert.equal(status(h, "2026-12-25T11:00:00Z"), "open");
  assert.equal(status(h, "2026-12-25T14:00:00Z"), "closed");
  h.temporaryClosures = [{ startDate: "2026-12-24", endDate: "2026-12-25" }];
  assert.equal(status(h, "2026-12-25T11:00:00Z"), "closed");
  h.temporaryClosures = [{ startDate: "2026-11-02", endDate: "2026-11-03" }];
  assert.equal(status(h, "2026-11-02T09:00:00Z"), "closed");
  assert.equal(status(h, "2026-11-03T19:59:59Z"), "closed");
  assert.equal(status(h, "2026-11-04T09:00:00Z"), "open");
  h.temporaryClosures = [{ startDate: "2026-11-02" }];
  assert.equal(status(h, "2027-11-02T09:00:00Z"), "closed");
});

test("closed dates truncate overnight service and explicit special hours replace carry-over", () => {
  const h = settings();
  h.weeklySchedule!.saturday = open(period("18:00", "02:00", true));
  h.dateExceptions = [{ date: "2026-11-08", closed: true }];
  assert.equal(status(h, "2026-11-07T22:59:59Z"), "open");
  assert.equal(status(h, "2026-11-07T23:00:00Z"), "closed");
  h.dateExceptions = [
    { date: "2026-11-08", ...open(period("12:00", "14:00")) },
  ];
  assert.equal(status(h, "2026-11-08T00:30:00Z"), "closed");
  h.dateExceptions = [];
  // All Saints' Day is Sunday; the preceding Saturday's service stops at midnight.
  assert.equal(status(h, "2026-11-01T00:30:00Z"), "closed");
  h.closedOnPublicHolidays = false;
  assert.equal(status(h, "2026-11-01T00:30:00Z"), "open");
});

test("daylight-saving transitions resolve gaps and repeated opening/closing times", () => {
  assert.equal(
    new Date(berlinInstant("2026-03-29", "02:30", "start")).toISOString(),
    "2026-03-29T01:30:00.000Z",
  );
  assert.equal(
    new Date(berlinInstant("2026-10-25", "02:30", "start")).toISOString(),
    "2026-10-25T00:30:00.000Z",
  );
  assert.equal(
    new Date(berlinInstant("2026-10-25", "02:30", "end")).toISOString(),
    "2026-10-25T01:30:00.000Z",
  );
  const h = settings();
  h.weeklySchedule!.sunday = open(period("01:30", "03:30"));
  assert.equal(status(h, "2026-03-29T00:30:00Z"), "open");
  assert.equal(status(h, "2026-03-29T01:29:59Z"), "open");
  assert.equal(status(h, "2026-03-29T01:30:00Z"), "closed");
  h.weeklySchedule!.sunday = open(period("02:30", "03:30"));
  assert.equal(status(h, "2026-10-25T00:30:00Z"), "open");
  assert.equal(status(h, "2026-10-25T01:10:00Z"), "open"); // Repeated 02:10 stays inside the real interval.
  assert.equal(status(h, "2026-10-25T02:30:00Z"), "closed");
});

test("validation rejects malformed times, impossible dates, overlap, and ambiguous schedules", () => {
  for (const periods of [
    [],
    [period("9:00")],
    [period("24:00")],
    [period("22:00", "02:00")],
    [period("10:00", "11:00", true)],
    [period("10:00", "12:00"), period("11:00", "13:00")],
  ])
    assert.notEqual(validatePeriods(periods), true);
  assert.equal(
    validatePeriods([period("10:00", "12:00"), period("12:00", "14:00")]),
    true,
  );
  assert.equal(validatePeriods([period("10:00", "10:00", true)]), true);
  assert.equal(validatePeriods([period("18:00", "00:00", true)]), true);
  for (const date of [
    "2026-02-30",
    "2026-13-01",
    "2026-01-99",
    "2025-02-29",
    "01.01.2026",
    "",
    null,
  ])
    assert.equal(isDate(date), false);
  assert.equal(isDate("2028-02-29"), true);
  assert.notEqual(
    validateExceptions([
      { date: "2026-12-24", closed: true },
      { date: "2026-12-24", closed: false },
    ]),
    true,
  );
  assert.notEqual(
    validateClosures([{ startDate: "2026-12-26", endDate: "2026-12-24" }]),
    true,
  );
  const h = settings();
  h.weeklySchedule!.sunday = open(period("23:00", "11:00", true));
  assert.notEqual(validateWeeklySchedule(h.weeklySchedule), true);
  assert.notEqual(validateWeeklySchedule({ monday: { closed: true } }), true);
});

test("missing or invalid configuration yields an honest unknown status", () => {
  assert.equal(status(null, "2026-11-02T12:00:00Z"), "unknown");
  assert.equal(status({}, "2026-11-02T12:00:00Z"), "unknown");
  const h = settings();
  h.dateExceptions = [{ date: "bad-date", closed: true }];
  assert.equal(status(h, "2026-11-02T12:00:00Z"), "unknown");
  assert.equal(getOpeningStatus(settings(), new Date(NaN)), "unknown");
});

const original = {
  openingHours: [
    { _key: "a", day: "Montag - Samstag", hours: "10:00 - 21:00" },
    { _key: "b", day: "Sonntag", hours: "Closed" },
    { _key: "c", day: "Feiertage", hours: "Closed" },
  ],
};
test("displayed hours prefer the weekly schedule and fall back to original text", () => {
  const h = { ...original, ...settings() };
  assert.deepEqual(getHoursRows(h), [
    { _key: "monday", day: "Montag - Samstag", hours: "10:00 - 21:00" },
    { _key: "sunday", day: "Sonntag", hours: "Geschlossen" },
    { _key: "public-holidays", day: "Feiertage", hours: "Geschlossen" },
  ]);
  assert.deepEqual(getHoursRows(original), original.openingHours);
});
