# Tapparo website — implementation plan

Created: 31 October 2026  
Last updated: 2 November 2026

Status: Milestones 1–4 are locked in, committed, and locally validated. Milestone 4 was approved on 2 November 2026: `0426fae` adds structured hours and live status; `b265868` clarifies carousel editing and preserves image crops. Milestone 5 is now in progress: integrate the approved hero, CMS-selected carousel, shared navigation, and page motion. All implementation and content work uses development. Production rollout remains deferred until the full result is approved. Further implementation commits require explicit lock-in.

## Working agreement

- Work through the milestones in sequence, starting with the urgent URL fix.
- Keep each milestone independently reviewable while completing the work in development.
- **Do not commit work until the user explicitly locks it in.** Writing this plan does not constitute approval of an implementation.
- **Use the `development` dataset for implementation, content changes, migrations, and review previews. Keep production unchanged until the user is happy with the full result and approves the production rollout.** Locking in an individual milestone does not authorize production changes.
- At final release, apply reviewed, targeted migrations to production with fresh backups and verification. Do not replace production wholesale with development or overwrite intervening owner edits.
- Update this file as work progresses: record completed tasks, review decisions, validation evidence, and any resulting commit or release reference.
- Preserve the owner's simple Sanity workflow: Site Settings, Navigation, and reusable sections that build pages, alongside the dedicated menu, stories, and legal editing workflows.

## Progress tracker

| Milestone | Status | Locked in | Commit / release |
| --- | --- | --- | --- |
| 1. URL normalization | Committed — production deferred to final release | Yes — 1 November 2026 | `ad16b6d`, `9ea6df0`, `8cef96a` / not released |
| 2. Ordering route | Committed — production deferred to final release | Yes — 1 November 2026 | `c9ca238` / not released |
| 3. Design and motion direction | Committed — approved direction, production integration in step 5 | Yes — 2 November 2026 | `d9d30c8`, `fb0c54c` / not released |
| 4. Sanity enhancements | Committed — production deferred to final release | Yes — 2 November 2026 | `0426fae`, `b265868`; ticker field: `d9d30c8` |
| 5. Hero, carousel, and shared motion | In progress | No | — |
| 6. Remaining homepage sections | Not started | No | — |
| 7. Stories, menu, and imprint | Not started | No | — |
| 8. Verification, polish, and release | Not started | No | — |

Suggested status progression: Not started → In progress → Ready for review → Locked in → Committed → Released, where applicable.

## Requirements to preserve

- Next.js application, Vercel deployment, and Sanity CMS.
- Home, stories overview, individual stories, menu, and imprint/legal pages.
- Existing content, images, references, story URLs, menu information, legal text, and unpublished drafts.
- Existing colors: background `#F5F4F2`, foreground `#181818`, accent `#E84F2F`.
- Existing typography: Instrument Sans and Space Grotesk, plus the supplied brand SVG artwork.
- Owner-controlled navigation and section composition.
- Global brand, contact, map, opening-hours, social, and SEO settings as the sources of shared information.
- Every “jetzt bestellen” CTA leads to `/order`, which redirects to Degaso. Menu-viewing links remain `/menu`.
- The hero's leading image is a carousel whose images and order are controlled in Sanity, with quick, polished transitions.
- Hero content fits the viewport height, including ordering and status. All redesigned content uses a shared maximum width of 2100 px; the desktop image has its own narrower cap.
- Carousel: 100 ms crossfade every 2.5 seconds, no visible controls. Ticker: autoplay without a pause button. Both respect reduced motion.
- Hero and menu share the status indicator (green open, dark grey red closed). Menu labels have no numbers or arrows; the stationary handdrawn toggle animates between open/close; both ordering SVGs change only color on hover.
- The hero image has zero left inset, including above the 2100 px content cap. A 1 px orange outline surrounds the viewport and remains visible with the menu open.
- Ordering and status retain their original viewport-relative arrangement in the menu on mobile and desktop; the menu’s separate logo and ordering artwork animate into and out of those layout positions. The menu uses the same responsive grid independently of page scroll, so its logo and status remain visible; closing preserves the underlying scroll position. Social links use the same treatment as the main navigation.
- Ticker content is an ordered CMS array of phrases. The renderer adds `•` with 8 px on each side; editors do not enter separators.
- The ticker sits at the bottom on mobile as well as desktop. Mobile logo/menu move up into the space previously occupied by the ticker.
- Motion follows the supplied `villas.mov` reference: dedicated first-visit welcome, photograph handoff into the hero, and staggered element reveals. Repeat visits get a shorter entrance; reduced motion gets immediate content.

## Assessment baseline — 31 October 2026

These observations are a dated baseline, not a substitute for a fresh export and audit before production changes.

### Routing and environments

- The lockfile resolves Next.js to `15.5.12`.
- No URL-normalization middleware or redirects are currently configured in the repository.
- Page, story, and legal lookups use case-sensitive slug matching.
- Those document types share the root URL namespace. Cross-type, case-insensitive uniqueness and reserved-route validation are missing.
- The explicit slug validation currently requires a value but does not enforce lowercase formatting.
- Production has one uppercase slug: `Impressum`. All 10 published story slugs are lowercase.
- No case-insensitive collisions were found among published page, story, and legal routes during the audit.
- Live `/Impressum` returns `200`; `/impressum` returns `404`.
- Live `/Menu` returns `404`; `/menu` returns `200`.
- Live `/order` returns `404`.
- The production sitemap includes double-slash URLs, such as `https://tapparo.com//menu`, and the uppercase imprint URL.
- Canonical link tags were absent from the sampled HTML responses.
- Sanity project: `64kcdhuf` — Tapparo Website.
- Separate `production` and `development` datasets exist. Local `.env.local` selects `development`.
- Development also contains a `revamp` page; do not overwrite unrelated development work when preparing migrations.

### Content inventory

| Published content | Count |
| --- | ---: |
| Stories | 10 |
| Menu items | 93 |
| Menu categories | 12 |
| Allergens | 7 |
| Homepage sections | 8 |

The published homepage currently contains, in order:

1. Hero — one selected image.
2. Address — presented through a quote section.
3. About — SubHero text, menu link, and optional hours presentation.
4. Gallery — three images.
5. Large text — “no rules. just taste.”
6. Stories.
7. “Das Produkt” — product text.
8. Founders' quote — Annabell & Maximilian Tapparo.

The imprint, settings, navigation, asset references, and drafts must also be preserved. Verify preservation by document IDs and content, not counts alone.

### Existing implementation to reuse

- `sectionHero.heroImages` already supports image selection, ordering, hotspots, and alt text.
- The current hero rotates images every four seconds with a 1.2-second crossfade. This behavior will be replaced by the agreed faster treatment.
- Motion is already installed, with reveal, menu, and page-transition components.
- The homepage uses the section renderer; menu and stories use dedicated templates assembled from section components. Preserve these simple editing models.
- Opening hours are currently free-text rows: Monday–Saturday `10:00–21:00`, Sunday closed, and holidays closed. They need a structured representation before they can reliably drive live status.

## Design references and mapping

- [Desktop hero sketch](https://www.figma.com/design/3q59vsOlsZk1A5Lu7HES4c/tapparo?node-id=2576-9397)
- [Mobile hero sketch](https://www.figma.com/design/3q59vsOlsZk1A5Lu7HES4c/tapparo?node-id=2576-9370)
- [Villas Tamarindo reference](https://villas-tamarindo.com/)
- [Degaso ordering destination](https://order.degaso.de/1b33fef5-2777-434b-8960-03889fcfb1d7)

The reference combines asymmetric composition, oversized typography, generous space, image choreography, and coordinated transitions. Its source uses GSAP/ScrollTrigger, Lenis, and Swup. Translate the visual behavior into Next.js and the existing Motion integration; any additional animation dependency needs a demonstrated purpose.

| Reference treatment | Proposed Tapparo mapping |
| --- | --- |
| Asymmetric image-led hero and oversized branding | Figma desktop/mobile layouts with the CMS-controlled carousel |
| Spacious editorial introduction | About / `sectionSubhero` |
| Large villa showcase panels | Selected story highlights, used sparingly |
| Experiences imagery and layered compositions | Gallery and mood-image sections |
| Oversized statements and animated text | “no rules. just taste.” / `sectionLargeText` |
| Services text-and-image composition | “Das Produkt” / `sectionText` |
| Editorial quotations | Existing founders' quote |
| Expressive navigation and substantial footer | CMS navigation, contact, hours, social links, and imprint |

Keep Tapparo's identity and content. Adapt the reference's prolonged introduction and desktop-heavy pinned sequences to restaurant visitors who need quick access to ordering, hours, location, and the menu.

## 1. Fix URL normalization

Priority: first implementation milestone. Review in development; production rollout waits for approval of the full result.

- [x] Export production content and capture the route/content inventory, including drafts and asset references.
- [x] Define the URL policy: lowercase public paths, consistent trailing slashes, clean URL joining, reserved routes, and a consistent convention for newly generated slugs.
- [x] Implement conditional `308` redirects in `middleware.ts`, suitable for Next.js 15.
- [x] Preserve query parameters; exclude Studio, API, framework, and asset paths; redirect only when the destination differs.
- [x] Add shared slug generation and validation for pages, posts, and legal pages, covering manual edits and generated values.
- [x] Enforce case-insensitive uniqueness across their shared namespace, excluding the same document's draft/published pair, and protect reserved routes.
- [x] Validate menu-category slugs in their separate anchor namespace.
- [x] Add validation to migration/import workflows; Studio validation alone does not govern every API write.
- [x] Introduce compatible lookup behavior before migrating the uppercase production slug, so the lowercase destination remains available throughout rollout.
- [x] Dry-run the migration against both datasets; apply and verify `Impressum` → `impressum` in development without publishing drafts.
- [ ] At the approved final release (milestone 8), deploy the locked-in compatible code, then apply the production migration and verify the live site.
- [ ] Remove the temporary build exception for the existing production `Impressum` document after rollout; review that cleanup before committing.
- [x] Update internal URL construction, navigation links, sitemap generation, and canonical metadata consistently.
- [x] Preserve existing story slugs; use explicit redirect aliases for future substantive slug renames.
- [x] Verify mixed-case URLs, trailing slashes, repeated slashes, query strings, unknown routes, reserved routes, collisions, and redirect-loop prevention.

Local implementation and verification are complete. See [rollout instructions and test evidence](docs/url-normalization.md). Continue subsequent milestones in development; production remains unchanged until the approved final release.

Acceptance: old uppercase links resolve correctly; canonical lowercase URLs return content; the sitemap contains clean canonical URLs; invalid or colliding slugs are caught before publication.

Implementation references: [Next.js 15 middleware](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware), [Vercel routing middleware — available on all plans](https://vercel.com/docs/routing-middleware), [Sanity slug configuration](https://www.sanity.io/docs/studio/slug-type). This solution does not depend on dashboard-managed redirects.

## 2. Establish `/order`

- [x] Add a server-side `307` redirect from `/order` to `https://order.degaso.de/1b33fef5-2777-434b-8960-03889fcfb1d7`.
- [x] Audit existing ordering CTAs and establish `/order` as their destination. No existing “jetzt bestellen” CTAs were found in the code or current development content; the planned SVG hero CTA will use this route in milestone 5.
- [x] Keep menu-viewing links pointed at `/menu`.
- [x] Treat ordering as an outbound journey in the transition system, without an overlay delaying or trapping navigation.
- [x] Verify direct visits, CTA clicks, new tabs, and the destination's availability without placing an order.

Implementation: `app/order/route.ts` returns an uncached `307` to the fixed destination in `lib/ordering.ts`, independent of CMS availability and the site's Coming Soon layout. Query parameters cannot replace the destination. `TransitionLink` disables prefetch for ordering links and uses full document navigation; `ButtonLink` inherits that behavior. Existing menu links and their transitions are preserved. No CMS content changes or migration were needed.

Verification: all 11 existing regression tests, TypeScript checks, and an isolated production build using the development dataset pass. HTTP checks cover the redirect, uppercase/encoded variants, query strings, `HEAD`, unchanged public pages, and exclusion from the sitemap. Browser checks use a temporary fixture outside the repository to exercise the shared button/link components: normal clicks, query/object hrefs, new tabs, browser back, prevented clicks, no ordering prefetch or overlay, and the retained menu transition. The actual Degaso destination returned `200` and displayed Tapparo's ordering page; repeated interaction checks intercepted only the external destination response. No order was placed. Local evidence: `.sanity-backups/order-verification.json`.

Acceptance: all ordering entry points reach the specified Degaso destination. The temporary redirect allows the provider destination to change later without permanently cached redirects.

## 3. Lock design and motion direction

Revision sequence requested 1 November 2026 (hero and navigation only):

1. Fit the hero to the viewport height, reserve room for ordering and status, and establish a shared 2100 px content cap with a narrower desktop photograph.
2. Remove carousel/ticker controls; use a 100 ms crossfade every 2.5 seconds and respect reduced motion.
3. Keep a stationary menu toggle with animated original handdrawn strokes; simplify CMS navigation, add the small logo, shared status, and ordering artwork with orange-only hover.
4. Remove About from this preview, then verify responsive geometry, menu accessibility, playback, and hover behavior. Preserve the real homepage and all its content.

All four correction passes are implemented and verified in the development preview. They supersede the earlier carousel alternatives and representative About-section review. Commit authorization was subsequently given on 2 November; production changes remain deferred.

Second review sequence requested 1 November 2026:

1. Restore the flush-left image and orange frame around the viewport.
2. Keep the actual ordering link and status mounted at unchanged coordinates while the menu opens around them.
3. Present social links alongside the primary navigation with identical treatment.
4. Add the ordered CMS ticker phrase field and automatic bullets with 8 px spacing on each side.
5. Verify responsive geometry, continuity throughout animation, keyboard access, and development content preservation.

All five passes are implemented. The ticker field is the only milestone-4 work brought forward; live status and the remaining schema work are still deferred.

Motion review sequence requested 2 November 2026:

1. Sample the supplied `villas.mov` recording, distinguish the first-visit intro from individual element entrances, and map the applicable motion to Tapparo.
2. Build the dedicated first-visit welcome and image handoff, followed by masked logo/ordering reveals and staggered status/address/menu/ticker. Provide a shorter repeat-load entrance and reduced-motion behavior.
3. Move the mobile ticker to the bottom and move logo/menu up, preserving viewport fit and stationary ordering/status through menu changes.
4. Verify first/repeat visits, slow images, early interaction, resizing, no-JavaScript behavior, reduced motion, and the existing layout/playback guarantees.

All four passes are implemented. The [design direction](docs/design-direction.md#video-study--2-november-2026) records the timed video analysis and mapping. The user approved these development changes for commit on 2 November.

- [x] Preserve the desktop sketch's composition: image left; status/address upper right; logo and ordering artwork below; ticker along the bottom.
- [x] Preserve the mobile sketch's artwork and responsive composition, with the latest requested order: logo/navigation; image; ordering artwork; status/address; ticker at the bottom.
- [x] Specify tablet, narrow-screen, and shorter-screen behavior rather than simply scaling the desktop frame.
- [x] Agree on image crops, spacing, navigation behavior, and the treatment of the brand SVG assets.
- [x] Prototype carousel cadence and transition style.
- [x] Define the first-entry sequence, internal page-transition sample, and reduced-motion alternatives.
- [x] Implement viewport-height sizing, shared 2100 px content cap, and narrower desktop image.
- [x] Remove carousel/ticker controls and apply the requested 100 ms / 2.5-second cadence.
- [x] Rebuild the menu with a stationary animated handdrawn toggle, plain CMS links, small CMS logo, shared status, and ordering SVG.
- [x] Use green open / dark grey red closed indicators and orange-only ordering hover with no movement.
- [x] Keep About outside the hero and this milestone's preview.
- [x] Restore zero left image inset and a persistent orange viewport outline.
- [x] Match the original hero arrangement in a viewport-relative menu grid; keep its logo, ordering, and status visible after scrolling, and preserve the page position on close.
- [x] Animate the menu’s own logo and ordering artwork through masks; reveal/hide the entire opaque panel together, keeping the original hero painted underneath to avoid overlapping artwork and position snaps.
- [x] Style CMS social links exactly like the primary navigation.
- [x] Connect the ticker to an ordered CMS phrase array; automatically add bullets with 8 px spacing and enough repetition for wide screens.
- [x] Analyze the supplied first-visit recording and implement the welcome, photograph handoff, masked artwork, and staggered detail reveals.
- [x] Distinguish first visits from repeat loads and provide replay for both in the review panel.
- [x] Move the mobile ticker to the bottom and move logo/menu up without sacrificing above-the-fold ordering/status.
- [x] Review and lock the revised hero and navigation before proceeding to milestone 4 — authorized 2 November 2026.

Review at [the local development preview](http://localhost:3000/design-preview); read the [design and motion direction](docs/design-direction.md) for responsive rules, asset provenance, reference mapping, and review decisions. The preview is development-only and excluded from indexing. It uses the original Figma artwork and development navigation/brand/contact/ticker data. Review-only settings below the hero allow status and reduced-motion checks. Since milestone 4, status defaults to the live development schedule; the review panel also offers explicit design overrides. The demonstration image sequence does not change the CMS hero selection. About remains a separate, unchanged section on the real homepage. Ticker phrases are editable under **Pages → Home → Hero → Ticker phrases** in the development Studio.

User-specified carousel motion remains a 100 ms crossfade every 2.5 seconds, without visible carousel or ticker controls. The 2 November video study led to a dedicated 2.85-second first-visit welcome, once per tab session, and a 1.15-second repeat-load hero entrance. The welcome uses the existing logo and CMS tagline, “Tagesbar & Focacceria.” The image reveals horizontally, then settles into the carousel slot as the intact logo/ordering SVGs rise through masks and smaller details follow. Autoplay begins after the entrance settles. Early interaction, resizing, or reduced motion finishes/skips the entrance; slow images use a short fallback, and no JavaScript leaves content visible. The menu retains its 350 ms stroke animation and 450 ms panel reveal. Its own logo and ordering artwork rise through masks over 500 ms; on close, they leave in 180 ms before the panel finishes its 400 ms retraction (120 ms lead-in). Ordering SVG hover changes only color. The live status was connected in milestone 4. Full hero CMS image integration and production shared components remain in milestone 5.

Verification: 11 regression tests, TypeScript, the development slug audit, and an isolated production build using development data pass. Chrome checks cover nine sizes from 320 × 568 through 3840 × 1080: viewport fitting, width caps, flush-left image, four-sided frame, no overflow, stationary toggle/order/status, focus/Escape, CMS links/logo, social typography, exact 8 px separator spacing, and a complete ticker loop at the widest cap. Initial frame-by-frame checks at the page top confirmed zero ordering/status movement. The later scroll correction supersedes the same-element implementation with a separate viewport grid using the same components. Normal-motion checks measure 100 ms fades and 2508–2509 ms between transition starts; hover playback, reduced motion, orange-only hover, rapid menu reversal, and `/order` 307 all pass. No runtime/hydration errors were observed. Evidence: `.sanity-backups/hero-continuity-verification.json` and `.sanity-backups/hero-motion-verification.json`.

Review completed: the user authorized commits and continuation to step 4 on 2 November. Commits: `d9d30c8` (CMS ticker phrases), `fb0c54c` (responsive hero, navigation, artwork, and motion preview). About and other content sections remain in milestone 6.

Additional 2 November verification: timed desktop/mobile screenshots and browser checks confirm the dedicated first visit, short repeat visit, both replay actions, bottom-aligned ticker, early Escape/Tab, resize recovery, slow-image fallback, live system reduced-motion changes, and useful no-JavaScript rendering. Nine viewport checks and frame-by-frame menu continuity still pass. Carousel remains 100 ms / approximately 2508 ms, with no controls added. All 11 regressions and the isolated development-data build/type checks pass. Evidence: `.sanity-backups/hero-entrance-verification.json`, `.sanity-backups/hero-entrance-recovery.json`, and the existing continuity/motion reports. No CMS mutation was required for this revision.

Menu scroll clarification: the menu now uses the hero’s responsive grid in its own viewport layer. Logo, status, ordering, and links keep their initial viewport arrangement instead of inheriting the hero’s scrolled document coordinates. The hero remains in normal flow underneath, inert while covered; closing preserves scroll and returns focus to the toggle. Checks pass at three scroll depths across nine viewports, with normal-motion frame sampling at three sizes and open-menu resizing. Evidence: `.sanity-backups/menu-scroll-verification.json`. No CMS changes were needed.

## 4. Extend Sanity without complicating editing

- [x] Reuse `sectionHero.heroImages`; update labels and guidance for the new leading-image carousel.
- [x] Add an ordered list of owner-editable ticker phrases to the hero section. Brought forward during step 3 at the user's request: local schema/query and preview rendering implemented; development Home hero seeded with the existing six phrases. Separators and spacing are frontend-owned.
- [x] Keep brand assets, contact information, map URL, hours, and SEO in their existing settings documents.
- [x] Add an easy structured weekly opening schedule, date exceptions, and temporary closures.
- [x] Preserve the existing holiday-closure policy using the Munich calendar, with explicit special-date openings and closure overrides.
- [x] Calculate live status in `Europe/Berlin`, including daylight-saving changes, overnight periods, and updates while a page remains open.
- [x] Keep schema changes additive, migrate existing values carefully, and leave existing drafts unpublished.
- [x] Provide and validate standard Studio fields for carousel images, ticker text, hours, and closures, with no layout or animation parameters. The authenticated editor walkthrough is part of the user review.

Acceptance: the new features are editable through the existing simple CMS organization, with global information maintained in one place.

Ticker development change: `f803c306-580e-4053-9b34-84d9cda1f91a`, hero key `s1`, field `tickerPhrases`. A revision-guarded draft was created from the published development document, checked against the original, and published only to development. There was no existing homepage draft. The only content difference is the six-phrase array; all other changes are Sanity revision metadata. Before/after backups are in `.sanity-backups/development-ticker-before.json` and `.sanity-backups/development-ticker-after.json`. At final production rollout, add the field with a fresh backup and a guarded `setIfMissing`, preserving any newer owner values and all existing drafts.

Implementation completed in development on 2 November 2026:

- **Site Settings → Opening Hours** now contains a fixed seven-day week, multiple daily periods, overnight closing, Munich holiday closure, special dates, and temporary closures. Closures take priority over exceptions, which take priority over holidays and the regular week.
- The existing text hours were preserved exactly. Only `weeklySchedule` and `closedOnPublicHolidays` were added to development `settingsHours`, using a fresh backup, revision-guarded draft copy, `setIfMissing`, comparison, and guarded publish. No existing hours draft was present; all 156 other inventoried records, including three drafts, retained their revisions. Production was not read or mutated for this step.
- The hero/menu preview uses one live status, calculated in `Europe/Berlin` at minute boundaries and on browser focus/visibility changes. It handles DST gaps/repeated times, overnight carry-over, holiday/date overrides, and unknown or invalid settings. CMS edits appear on the next data load under the existing cache policy.
- Footer/SubHero rows derive from the same weekly schedule after migration, with original-text fallback for unmigrated datasets. Original data is retained; closed display rows now read “Geschlossen.”
- `heroImages` keeps its existing identity, with clearer carousel guidance, alt-text warnings, and crop/hotspot query preservation. The approved demonstration image sequence remains until step 5.
- Added the [owner and implementation guide](docs/opening-hours.md), a conservative migration helper, a read-only migration audit command, and nine opening-hours regression tests.

Validation: all 20 tests, TypeScript, the development slug audit, and an isolated development-data build pass. Local Studio schema extraction and migrated-document validation pass. Sanity's validation engine in Studio mode accepts three valid editing fixtures and returns publication-blocking errors for overlap, duplicate dates, and reversed closures. The installed CLI downgrades object-level rules to warnings, so its output alone was not used to verify publication blocking. Browser checks verify minute-boundary open/close updates, shared hero/menu status with a Los Angeles device timezone, holiday closure, focus/visibility/page-restoration recovery, design overrides, and derived footer rows. The unauthenticated headless Studio remained on its account-loading view, so the authenticated editing walkthrough is left explicitly for review rather than claimed as tested.

Evidence: `.sanity-backups/development-hours-before.json`, `development-hours-after.json`, `hours-schema-validation.json`, `hours-fixture-validation.json`, `hours-studio-validation.json`, and `check-live-hours.cjs`. Step 4 was locked in on 2 November and committed as `0426fae` and `b265868`. The client clock supplies the current instant, interpreted in Europe/Berlin; SSR starts neutral to prevent stale or mismatched status. Step 5 is now authorized.

## 5. Build the hero, carousel, and shared motion

- [ ] Implement both Figma compositions as responsive layouts.
- [ ] Use the supplied logo and “jetzt bestellen” SVG artwork, with an accessible link label and the correct `/order` destination.
- [ ] Render the selected Sanity images in their owner-defined order inside the leading-image area.
- [ ] Carry over the requested 100 ms crossfade on a 2.5-second start-to-start cadence.
- [ ] Keep the logo, address, live status, and ordering CTA stable during image changes.
- [ ] Keep the carousel free of visible controls, counters, and manual gestures; autoplay unless motion is reduced.
- [ ] Handle a single image as a static hero and provide a safe empty-image fallback.
- [ ] Preload the next image, respect Sanity crops/hotspots, and prevent layout shifts.
- [ ] Pause autoplay when offscreen or when the tab is hidden; support reduced motion.
- [ ] Implement the owner-controlled moving ticker without a pause button; respect reduced motion and background visibility.
- [ ] Carry over the shared 2100 px content cap, viewport-fitting hero, and narrower desktop image cap.
- [ ] Carry over the stationary handdrawn menu toggle, small CMS logo, plain navigation labels, shared status, and orange-only SVG ordering hover.
- [ ] Carry over zero left image inset, the viewport outline, stationary ordering/status during menu transitions, main-link social styling, and automatic 8 px ticker separators.
- [ ] Carry over the reviewed first-visit welcome and image handoff, shorter repeat-load entrance, and reduced-motion/interaction fallbacks.
- [ ] Coordinate internal page transitions, navigation overlay, and section motion using shared timings and easing.
- [ ] Verify keyboard use, focus management, anchors, browser back/forward, modifier-key links, and recovery from failed navigation.

Review point: lock the hero appearance, carousel cadence, ticker behavior, menu animation, and page-transition timing.

## 6. Redesign the remaining homepage

- [ ] Apply the agreed reference mapping to existing section components.
- [ ] Account for every existing homepage block and asset in the redesigned layout.
- [ ] Preserve the full About and product texts, brand statement, gallery, stories, address, and founders' quote.
- [ ] Present shared address information from Site Settings. Review any removal of its existing standalone section explicitly.
- [ ] Keep section selection and ordering controlled through Sanity.
- [ ] Make galleries usable on mobile and ensure every existing image remains reachable.
- [ ] Check section behavior when reordered, omitted, or used with shorter/longer content.

Acceptance: all existing homepage content has a verified place, and the page remains assembled from reusable CMS-controlled sections.

## 7. Redesign stories, menu, and imprint

- [ ] Redesign the stories overview and individual article templates.
- [ ] Preserve story bodies, images, authors, dates, related-story references, and existing URLs.
- [ ] Preserve menu category order, prices, price variants, extras, availability rules, and allergens.
- [ ] Give the menu clear category navigation and readable typography with restrained motion.
- [ ] Preserve the full imprint text and maintain access through the footer.
- [ ] Retain the dedicated menu, stories, and legal editing workflows.
- [ ] Review representative article, menu, and imprint layouts before finalizing all templates.

Review point: all page types are approved, with content preservation verified against the baseline.

## 8. Verify, polish, and release

- [ ] Compare document IDs, text, images, references, and draft state against the baseline; do not rely on counts alone.
- [ ] Recheck all routes, redirects, internal links, canonical tags, sitemap entries, and ordering CTAs.
- [ ] Test desktop and mobile browsers, keyboard navigation, reduced motion, and automatic carousel/ticker playback.
- [ ] Test opening-hour boundaries, closures, holiday handling, daylight-saving changes, and overnight schedules.
- [ ] Test slow-loading images and navigation failures.
- [ ] Check loading speed, layout stability, image sizing, and animation responsiveness.
- [ ] Verify the owner's workflow in development: edit ticker text, reorder carousel images, change hours, update a menu item, and publish a story.
- [ ] Confirm that CMS updates reach the website with the expected cache/revalidation behavior.
- [ ] Complete the final visual and functional review.
- [ ] Obtain approval of the full result and the production rollout; individual milestone lock-in does not authorize this release.
- [ ] Take fresh production backups, compare current production content with the baseline, and dry-run targeted migrations that preserve drafts and intervening owner edits. Do not copy development over production wholesale.
- [ ] Prepare rollback instructions for code and any content migrations.
- [ ] Commit only the work explicitly locked in by the user, and record the commit reference here.
- [ ] Perform the agreed release, deploying compatible code before the production slug migration as documented in `docs/url-normalization.md`; run production smoke checks and record the release reference here.

Acceptance: content preservation, functional behavior, visual quality, performance, and CMS usability pass review, with a clear rollback path.

## Decisions still to lock in

- First-entry animation duration and replay policy; current preview is a 2.85 s welcome once per tab session and 1.15 s repeat-load entrance.
- Tablet and shorter-screen hero behavior.
- Holiday-closure representation and temporary-closure controls.
- Placement of existing homepage content, including whether the standalone address section remains.
- Scope of pinned story showcases and any additional animation dependency.

## Decision and progress log

| Date | Entry |
| --- | --- |
| 31 October 2026 | Repository, production data, live routes, reference site, and both Figma hero sketches assessed. No implementation or production content changes made. |
| 31 October 2026 | User clarified that the leading hero image must be a quickly animating carousel with owner-selected CMS images. Added to the plan. |
| 31 October 2026 | Plan saved in the repository at the user's request. Implementation milestones remain unstarted and uncommitted. |
| 31 October 2026 | Step 1 authorized. Saved raw snapshots (production: 198 documents / 5 drafts; development: 200 documents / 6 drafts). Implemented middleware, shared URL rules, Studio validation, normalized queries/links/canonicals/sitemap, build audit, and revision-guarded migration tooling. |
| 31 October 2026 | Development imprint slug normalized and verified as the only content change. Production dry run proposes the same single change; production has not been mutated. 11 tests, TypeScript, a production-data build, and HTTP checks for all 14 public pages pass. Work remains uncommitted and undeployed. |
| 31 October 2026 | User clarified that all work stays on the development dataset until the full result is satisfactory. Production updates are deferred to the approved final release, including URL normalization. Individual milestone lock-in still controls commits and does not authorize production rollout. |
| 1 November 2026 | User explicitly authorized a series of commits for step 1. Committed URL routing and metadata (`ad16b6d`), Studio slug validation (`9ea6df0`), and migration tooling with regression checks (`8cef96a`). Updated the plan and rollout documentation in the accompanying documentation commit. |
| 1 November 2026 | Before committing, reran all 11 tests, TypeScript validation, and the development published-slug audit; all pass, with no pending development slug changes. Production remains unchanged. No push or deployment performed; later milestones remain unstarted pending the requested check-in. |
| 1 November 2026 | Step 2 authorized and implemented: `/order` redirects to Degaso with `307` and `Cache-Control: no-store`; shared ordering links bypass prefetch and page-transition overlays. Verified against development with regression tests, type checking, an isolated build, HTTP checks, and browser interactions. Existing menu links are unchanged. No CMS mutations, commit, push, or deployment performed; ready for review. |
| 1 November 2026 | User explicitly authorized commits for step 2. Committed the ordering route and navigation behavior as `c9ca238`; recorded completion and verification in the accompanying documentation commit. No CMS changes, push, or deployment performed. |
| 1 November 2026 | Step 3 authorized. Re-read both Figma sketches, downloaded the original artwork, and examined the reference site's desktop/mobile layout and motion. Prepared `/design-preview` with responsive hero, carousel alternatives, ticker controls, sample status, navigation, and the complete existing About section. Added `docs/design-direction.md`. The direction awaits user review; no CMS mutations, commits, push, or deployment performed. |
| 1 November 2026 | Step 3 verification passed: regression tests, TypeScript, a development-data production build, and six responsive viewport/browser interaction checks. Corrected the mobile sketch crop and reduced-motion hydration behavior during review. Design approval remains pending. |
| 1 November 2026 | User narrowed step 3 to the hero and navigation and specified viewport-height fitting, a 2100 px content cap, automatic 100 ms crossfades every 2.5 seconds, no carousel/ticker controls, a stationary handdrawn menu toggle, plain CMS links, small menu logo, shared colored status, and orange-only ordering hover. Implemented all corrections and removed About from the preview. Nine viewport checks, animation timing/interaction checks, 11 regressions, TypeScript, and an isolated development-data build pass. Preview remains uncommitted; no CMS mutations, push, deployment, or move to the next milestone. |
| 1 November 2026 | Second hero review: restored the flush-left photograph and orange viewport outline; kept one ordering link and status block mounted at unchanged coordinates throughout menu opening/closing; promoted social links to the main navigation treatment. Added `sectionHero.tickerPhrases` to the local Studio/query and seeded only the development Home hero with the existing six phrases, using revision guards and before/after preservation checks. The ticker now inserts automatic bullets with 8 px spacing and measures repetition to avoid wide-screen gaps. Nine responsive checks, frame-by-frame menu checks at three sizes, playback/accessibility checks, 11 tests, TypeScript, and an isolated development-data build pass. No commits, production changes, push, or deployment. |
| 2 November 2026 | Reviewed the supplied 7.915 s `villas.mov` at 250 ms intervals. Adapted the horizontal photo reveal, intro focus/fade, image-to-layout handoff, masked branding, and staggered details into a 2.85 s first-visit welcome and 1.15 s repeat-load entrance. Moved the mobile ticker to the bottom and logo/menu up. Verified first/repeat/replay, early interaction, slow-image fallback, no-JavaScript rendering, resize and live reduced-motion recovery, nine viewports, stationary menu elements, and retained carousel cadence. Regression/type/build checks pass. Updated the design notes and plan; no content mutations, commits, push, or deployment. |
| 2 November 2026 | Corrected menu behavior after scrolling: an independent viewport grid reuses the original responsive composition and shared ordering/status components. The menu logo and status remain visible, the page keeps its scroll position, and the toggle/focus behavior is preserved. Verified 27 viewport/scroll combinations plus normal-motion opening/closing and resizing. This supersedes the earlier same-DOM-element interpretation; changes remain uncommitted. |
| 2 November 2026 | Reviewed both supplied menu recordings. Replaced the backdrop-only animation with a mask over the complete opaque menu, added independent masked entrances/exits for its logo and ordering SVG, and kept the inert hero painted underneath. This removes floating artwork and the scrolled-position snap on close. Verified top/scrolled transitions at three sizes, rapid reversals, orange-only hover, and reduced-motion scroll/focus behavior. No CMS changes or commits. |
| 2 November 2026 | User locked in the completed design work and requested commits, documentation updates, then continuation to step 4. Committed `d9d30c8` (owner-managed ticker phrases) and `fb0c54c` (approved hero/navigation preview). All 11 regressions, TypeScript, isolated development-data build, 27 viewport/scroll checks, and six normal-motion artwork checks pass. No push, deployment, or production mutation. |
| 2 November 2026 | Committed the step-3 records as `71a8815`, then implemented step 4 in development. Added structured hours/exceptions/closures, migrated only `settingsHours`, connected live preview status and derived display rows, clarified carousel editing, and added tests plus an owner guide. All existing drafts and original text remain unchanged; 20 tests, type/build checks, schema validation, and live-browser checks pass. Step 4 is ready for review and uncommitted; no production changes, push, deployment, or step-5 work. |

| 2 November 2026 | User approved step 4 and requested focused commits followed by step 5. Committed structured hours/live status as `0426fae` and carousel editing/crop preservation as `b265868`; all 20 tests and type checks pass. Confirmed browser-clock status with neutral SSR rendering. Recorded completion and began CMS hero/navigation integration; production remains unchanged. |
