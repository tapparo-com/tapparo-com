import {
  munichHolidays,
  validateClosures,
  validateExceptions,
  validateWeeklySchedule,
  WEEKDAYS,
  type HoursSettings,
  type OpeningDay,
} from "./opening-hours";

// Dataset checks also protect development builds hosted outside Vercel previews.
export function canIndexSite(
  env: Record<string, string | undefined> = process.env,
) {
  return (
    env.NEXT_PUBLIC_SANITY_DATASET === "production" &&
    env.VERCEL_ENV !== "preview"
  );
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

type HoursSpecification = {
  "@type": "OpeningHoursSpecification";
  dayOfWeek?: string;
  opens: string;
  closes: string;
  validFrom?: string;
  validThrough?: string;
};

export function structuredHours(
  settings: HoursSettings | null | undefined,
  year: number,
): {
  openingHoursSpecification?: HoursSpecification[];
  specialOpeningHoursSpecification?: HoursSpecification[];
} {
  if (
    !settings?.weeklySchedule ||
    validateWeeklySchedule(settings.weeklySchedule) !== true ||
    validateExceptions(settings.dateExceptions) !== true ||
    validateClosures(settings.temporaryClosures) !== true
  )
    return {};
  // Equal start/end times have ambiguous structured-data semantics. Keep the
  // public hours/status authoritative rather than publishing misleading data.
  const days = [
    ...Object.values(settings.weeklySchedule),
    ...(settings.dateExceptions || []),
  ];
  if (
    days.some(
      (day) =>
        !day.closed &&
        day.periods?.some((period) => period.start === period.end),
    )
  )
    return {};
  const periods = (day: OpeningDay): HoursSpecification[] =>
    day.closed
      ? [
          {
            "@type": "OpeningHoursSpecification",
            opens: "00:00",
            closes: "00:00",
          },
        ]
      : (day.periods || []).map((period) => ({
          "@type": "OpeningHoursSpecification",
          opens: period.start,
          closes: period.end,
        }));
  const openingHoursSpecification = WEEKDAYS.flatMap((day) =>
    periods(settings.weeklySchedule![day]!).map((period) => ({
      ...period,
      dayOfWeek: `https://schema.org/${day[0].toUpperCase()}${day.slice(1)}`,
    })),
  );
  const dates = new Map<string, OpeningDay>();
  if (settings.closedOnPublicHolidays !== false) {
    for (const date of [
      ...Object.keys(munichHolidays(year)),
      ...Object.keys(munichHolidays(year + 1)),
    ])
      dates.set(date, { closed: true });
  }
  for (const exception of settings.dateExceptions || [])
    dates.set(exception.date, exception);
  const closures = settings.temporaryClosures || [];
  const specialOpeningHoursSpecification: HoursSpecification[] = [...dates]
    .sort(([a], [b]) => a.localeCompare(b))
    .filter(
      ([date]) =>
        !closures.some(
          (closure) =>
            closure.startDate <= date &&
            (!closure.endDate || date <= closure.endDate),
        ),
    )
    .flatMap(([date, day]) =>
      periods(day).map((period) => ({
        ...period,
        validFrom: date,
        validThrough: date,
      })),
    );
  for (const closure of closures)
    specialOpeningHoursSpecification.push({
      "@type": "OpeningHoursSpecification",
      opens: "00:00",
      closes: "00:00",
      validFrom: closure.startDate,
      ...(closure.endDate ? { validThrough: closure.endDate } : {}),
    });
  return {
    openingHoursSpecification,
    ...(specialOpeningHoursSpecification.length
      ? { specialOpeningHoursSpecification }
      : {}),
  };
}
