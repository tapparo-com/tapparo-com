import { defineArrayMember, defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";
import {
  WEEKDAYS, validateDay, validateWeeklySchedule, validateExceptions, validateClosures,
} from "../../lib/opening-hours";

const period = defineArrayMember({
  name: "openingPeriod", type: "object", title: "Opening period", icon: ClockIcon,
  fields: [
    defineField({ name: "start", title: "Opens at", type: "string", placeholder: "10:00", description: "Opening time in Europe/Berlin, using 24-hour HH:mm format." }),
    defineField({ name: "end", title: "Closes at", type: "string", placeholder: "21:00", description: "Closing time in Europe/Berlin. For midnight or an overnight closing, also enable Closes next day." }),
    defineField({ name: "nextDay", title: "Closes next day", type: "boolean", initialValue: false, description: "Enable for overnight service, e.g. 18:00–02:00. Use 00:00 and enable this for midnight." }),
  ],
  preview: {
    select: { start: "start", end: "end", nextDay: "nextDay" },
    prepare: ({ start, end, nextDay }) => ({ title: `${start || "…"} – ${end || "…"}${nextDay ? " (next day)" : ""}` }),
  },
});
const dayFields = () => [
  defineField({ name: "closed", title: "Closed", type: "boolean", initialValue: true, description: "Turn off to enter opening periods." }),
  defineField({ name: "periods", title: "Opening periods", type: "array", of: [period],
    description: "Use 24-hour Berlin times (HH:mm). Add a second period for a lunch break.",
    hidden: ({ parent }) => parent?.closed !== false,
  }),
];
const emptyWeek = Object.fromEntries(WEEKDAYS.map(day => [day, { _type: day, closed: true }]));

export const settingsHours = defineType({
  name: "settingsHours", title: "Opening Hours", type: "document", icon: ClockIcon,
  fields: [
    defineField({
      name: "weeklySchedule", title: "Weekly opening hours", type: "object",
      description: "The regular week, always in Europe/Berlin time. Used by the website's hours and live open/closed indicator. Date exceptions and temporary closures below take priority.",
      options: { collapsible: false }, initialValue: emptyWeek,
      fields: WEEKDAYS.map(day => defineField({
        name: day, title: day.charAt(0).toUpperCase() + day.slice(1), type: "object", options: { collapsible: true, collapsed: true },
        description: "Regular hours for this weekday. Special dates, holiday rules and temporary closures can override them. Public weekday labels are displayed in German.",
        fields: dayFields(), initialValue: { closed: true },
      })),
      validation: rule => rule.custom(validateWeeklySchedule).error(),
    }),
    defineField({
      name: "closedOnPublicHolidays", title: "Closed on Munich public holidays", type: "boolean", initialValue: true,
      description: "Automatically includes all Munich public holidays, including Mariä Himmelfahrt. Add a date exception to open on a specific holiday. Christmas Eve and New Year's Eve need their own exceptions if closed.",
    }),
    defineField({
      name: "dateExceptions", title: "Special dates", type: "array",
      description: "One entry per date: closed or special opening periods. Replaces the entire calendar date, including overnight service from the previous day. Temporary closures take priority.",
      validation: rule => rule.custom(validateExceptions).error(),
      of: [defineArrayMember({ name: "dateException", type: "object", title: "Special date", icon: ClockIcon,
        fields: [
          defineField({ name: "date", type: "date", description: "The Berlin calendar date whose regular hours or holiday closure should be replaced.", options: { dateFormat: "DD.MM.YYYY" }, validation: rule => rule.required() }),
          ...dayFields(),
          defineField({ name: "note", title: "Internal note", type: "string", description: "Optional reminder for the team, e.g. Christmas Eve. Not displayed on the website." }),
        ],
        initialValue: { closed: true }, validation: rule => rule.custom(validateDay).error(),
        preview: { select: { date: "date", closed: "closed", note: "note" }, prepare: ({ date, closed, note }) => ({ title: date || "Choose date", subtitle: [closed ? "Closed" : "Special hours", note].filter(Boolean).join(" · ") }) },
      })],
    }),
    defineField({
      name: "temporaryClosures", title: "Temporary closures", type: "array",
      description: "Holidays, renovations, or other closures. First and last dates are both closed days. Leave the end empty to close until further notice. Overrides every weekly or special-date opening.",
      validation: rule => rule.custom(validateClosures).error(),
      of: [defineArrayMember({ name: "temporaryClosure", type: "object", title: "Closure", icon: ClockIcon,
        fields: [
          defineField({ name: "startDate", title: "First closed day", type: "date", description: "Closure starts at the beginning of this Berlin calendar date.", options: { dateFormat: "DD.MM.YYYY" }, validation: rule => rule.required() }),
          defineField({ name: "endDate", title: "Last closed day", type: "date", description: "This whole date is closed too. Leave empty for an indefinite closure.", options: { dateFormat: "DD.MM.YYYY" } }),
          defineField({ name: "note", title: "Internal note", type: "string", description: "Optional reminder for the team. Not displayed on the website." }),
        ],
        preview: { select: { start: "startDate", end: "endDate", note: "note" }, prepare: ({ start, end, note }) => ({ title: `${start || "Choose date"} – ${end || "until further notice"}`, subtitle: note || "Closed" }) },
      })],
    }),
    defineField({
      name: "openingHours", title: "Original text hours", type: "array",
      description: "Preserved original content. Once weekly hours are set above, the site derives its displayed hours from that schedule; these original values remain for migration history.",
      readOnly: ({ document }) => Boolean(document?.weeklySchedule),
      hidden: ({ value }) => value === undefined,
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "day", type: "string", description: "Original display label, retained for history. Superseded when a weekly schedule exists.", validation: rule => rule.required() }),
        defineField({ name: "hours", type: "string", description: "Original hours text. It does not drive the live open/closed indicator.", validation: rule => rule.required() }),
      ], preview: { select: { title: "day", subtitle: "hours" } } })],
    }),
  ],
  preview: { prepare: () => ({ title: "Opening Hours" }) },
});
