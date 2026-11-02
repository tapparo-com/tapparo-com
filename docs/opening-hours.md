# Opening hours and hero editing

Implemented in development on 2 November 2026 for milestone 4. Approved and committed on 2 November as `0426fae` (hours/live status) and `b265868` (carousel editing/crop preservation). Production is unchanged.

## Owner workflow

Keep shared information in the existing **Site Settings** documents. Brand, contact/address, map, social links, and SEO have not moved. **Navigation** still controls menu entries.

In **Site Settings → Opening Hours**:

1. Expand a weekday under **Weekly opening hours**. Turn **Closed** off and enter opening/closing times in `HH:mm`, using Berlin local time. Add another period for a lunch break.
2. For overnight service, enable **Closes next day**. For example, `18:00 → 02:00` with that option means service continues into the following day. Closing at midnight is `00:00` with the option enabled. Periods must fit within 24 hours and cannot overlap.
3. Keep **Closed on Munich public holidays** enabled to preserve the restaurant's existing policy. For a particular holiday opening, add **Special dates**, choose the date, turn **Closed** off, and enter its hours.
4. Use **Special dates** for a single closed day or different hours. Each entry replaces the entire calendar date, including any service carried over from the previous night. Only one exception per date is allowed.
5. Use **Temporary closures** for a holiday or renovation. Both the first and last dates are closed days. An empty end means closed until further notice; set the last closed date to resume the regular schedule the next day. These closures take priority over special openings.
6. Publish when ready. Internal notes are for the team and are excluded from the frontend query. The old **Original text hours** remain stored and read-only once a weekly schedule exists.

The migrated schedule is Monday–Saturday `10:00–21:00`, Sunday closed, public holidays closed. No special dates or temporary closures were invented.

In **Pages → Home → Hero**:

- **Carousel images** uses the existing `heroImages` array. Add/reorder images, set crops/hotspots, and describe them with alt text. Missing image assets block publication; missing descriptions produce a warning. One selected image will be static in the redesigned hero.
- **Ticker phrases** is one phrase per entry. Drag to reorder, leave empty to hide. The frontend adds bullets and their 8 px spacing.
- Layout, animation duration, and carousel cadence stay in the frontend. The owner does not need to edit those parameters.

Milestone 5 now renders the selected CMS sequence on the local homepage, respecting crops/hotspots. The separate design preview retains its approved demonstration sequence. See [Hero integration](hero-integration.md).

## Rules used by the live indicator

| Priority | Rule |
| --- | --- |
| 1 | An active temporary closure closes the whole date. |
| 2 | A matching special date supplies its closed state or opening periods. |
| 3 | A Munich public holiday is closed when the holiday setting is enabled. |
| 4 | The weekly schedule applies, including valid overnight carry-over. |

The holiday calendar follows the [City of Munich's public-holiday list](https://stadt.muenchen.de/infos/ladenschluss-feiertagsesetz.html), checked 2 November 2026. It includes Mariä Himmelfahrt and the Easter-relative holidays. Augsburg's Friedensfest is excluded. Christmas Eve and New Year's Eve are not automatically closed; use explicit special dates if needed. This preserves the restaurant's own holiday policy. Review the calendar if the location or holiday rules change.

All calculations use `Europe/Berlin`, regardless of the visitor's device time zone. Opening includes the start instant and excludes the closing instant. During the autumn clock change, an ambiguous opening uses the first occurrence and closing uses the last. Missing spring times move forward by the clock-change gap. For example, a missing `02:30` becomes `03:30`.

The hero and menu share one live status hook. It refreshes at minute boundaries and immediately on focus, page restoration, or visibility changes. These are clock updates against the loaded CMS settings; publishing a new schedule follows the site's existing fetch/cache behavior on the next page load. Production data requests currently revalidate after 60 seconds; development requests are uncached. No browser-specific timezone setting or external holiday API is needed.

The server and initial browser render use the neutral **Öffnungszeiten prüfen** state until the client has calculated the status, avoiding hydration disagreement or an invented “open” claim. Missing/invalid structured settings also use this neutral state. Green means open; dark grey red means closed.

The review panel defaults to **Live aus dem CMS**. Its two explicit design overrides allow color/layout checks and do not modify CMS data.

## Compatibility and preservation

- The additive fields are `weeklySchedule`, `closedOnPublicHolidays`, `dateExceptions`, and `temporaryClosures`, all on the existing `settingsHours` singleton.
- Existing `openingHours` text is never removed. Unmigrated datasets continue to render those original rows.
- After migration, footer and SubHero rows are derived from the weekly schedule and grouped when adjacent days match. Closed rows read **Geschlossen**. Special dates affect the live indicator; the displayed weekly list remains the regular schedule.
- The migration added only `weeklySchedule` and `closedOnPublicHolidays` to development `settingsHours`. It used an atomic revision-guarded draft copy, `setIfMissing`, content comparison, and a revision-guarded publish. There was no pre-existing hours draft.
- All 156 other records in the pre/post inventory, including three existing drafts, retained their revisions. Original hours text and keys were preserved exactly.
- Local evidence: `.sanity-backups/development-hours-before.json`, `development-hours-after.json`, and `hours-schema-validation.json`. These backups are ignored by Git.

`sanity/lib/hours-migration.ts` deliberately recognizes only the audited Monday–Saturday / Sunday / holiday text model. It refuses other prose instead of guessing, and returns no patch when structured hours already exist.

Read-only migration audit:

```sh
npx sanity exec scripts/prepare-hours-migration.ts --with-user-token -- --dataset development
```

The command also permits a read-only production audit; it has no apply mode. At the approved final rollout, take a fresh export, recheck the owner's current hours and all drafts, then use guarded `setIfMissing` additions. Preserve existing structured values, and never publish an existing owner draft as part of migration.

## Validation

The tests cover regular boundaries, split shifts, overnight/week carry-over, date/closure priority, holiday dates, both daylight-saving transitions, invalid content, and conservative migration. Studio schema extraction and validation of the migrated development document pass without warnings or errors. Browser checks cover minute-boundary changes with a Los Angeles device timezone, hero/menu agreement, holiday closure, focus/visibility recovery, design overrides, and derived footer rows.

Six local fixtures were also checked through Sanity's validation engine in Studio mode: three valid documents pass, while overlapping hours, duplicate special dates, and reversed closure dates produce publication-blocking errors. The installed CLI reports object-level validation failures as warnings, so Studio-mode validation was checked separately. This is an engine check; an authenticated walkthrough of the editing UI remains part of review.

Public homepage sections, stories, menu, imprint, navigation, and brand content remain intact. Milestone 5 integrates the approved hero into the section renderer; see its separate review record.
