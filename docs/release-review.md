# Step 8 — development review and release handover

**4 November 2026 · Committed following user review and explicit authorization.** The user will perform the production release. No push, deployment or production mutation has been performed or authorized. Kontakt remains a no-email preview in development.

Implementation commits: `43acf65` (search metadata), `3527fe7` (accessibility), `fd98c53` (hero performance), and `d606b3f` (branded 404). All 39 tests, TypeScript and diff checks passed again before committing. Remaining release checks and limitations below stay open.

## Audit follow-up — Impressum, 404 and footer

**4 November 2026 · Implemented for user review; uncommitted.** The user selected these three areas from the design audit. Other audit recommendations remain outside this pass.

- Added a compact contents row to the Impressum: Impressum, Datenschutz and Kontaktformular. Links are generated from existing CMS headings, with unique fragment IDs, keyboard-focusable destinations and clearance below the header. Native anchors work without JavaScript and use the existing reduced-motion handling. All legal text and the update date are preserved; no new CMS fields are required.
- Clarified the 404's primary link to “Zur Speisekarte”, retaining its orange background, iconmark/wordmark, focaccia headline, animated underline and return-home link.
- Tightened footer spacing and type, placed page/social links in adjacent groups with aligned headings, and retained 44px link targets. Tablet uses a two-column information layout; small screens stack the information above the link groups. The small logo and back-to-top control remain. All destinations, hours, contact details and visibility controls still come from the CMS.
- The user confirmed `hello@tapparo.de` as the public contact address. Kontakt's visible email links now read the same Contact site setting as the footer, including the no-JavaScript fallback. Existing Impressum wording already uses `.de`. Server delivery remains separately configured under the original `.com` requirement; confirm the receiving inbox during Kontakt activation, as tracked in its owner guide.

Verification: isolated optimized build against development, all 39 existing tests, TypeScript and diff checks; Chromium/WebKit views from 320–2560px; full legal-text comparison; unique heading IDs; keyboard/native anchors, direct fragments and reduced/normal motion; single footer link-group variants; 44px link targets; real 404 status and no overflow; public email links without JavaScript. Browser evidence is saved locally in `.sanity-backups/footer-legal-review/`. No emails were sent, no CMS documents were changed, and production remains untouched.

## Audit follow-up — mobile footer and Stories

**4 November 2026 · Implemented for user review; uncommitted.** Footer hours, contact details and page/social groups are now left-aligned below 768px. Desktop/tablet alignment and the compact logo/back-to-top row remain as previously reviewed. All CMS links and touch target sizes are preserved.

Stories receive 13px card metadata, a CMS cover-image framing choice for artwork, and a cleaned plain-text bakery excerpt. The `/opening` artwork now displays in full, including on cards. Long desktop articles have a cover that stays alongside the prose within the article's bounds; small/short viewports scroll normally. The duplicate return action before related stories has been removed. Full titles, bodies, dates, cover references, related-story choices, card order and two-column layout are preserved. See the [secondary-page owner guide](secondary-pages.md#stories-audit-follow-up--4-november-2026).

Verification: 39 tests, TypeScript, schema extraction, slug audit and isolated optimized development build pass. Chromium/WebKit checks cover eight layouts from 320–2560px, all ten articles, card alignment and loading/focus, full artwork, bounded scrolling, normal/reduced motion and no-JavaScript access. Only the two documented development story fields changed; all 144 unrelated content/draft revisions remain unchanged. Evidence and snapshots: `.sanity-backups/stories-footer-review/`. No production changes, emails, commits, push or deployment.

## Audit follow-up — homepage sections

**5 November 2026 · Implemented for user review; uncommitted.** Refined mobile reading sizes/line spacing in About, Product and the founders’ quote. Varied the image compositions: narrower About portrait with a wider companion, more prominence for the gallery’s food image, a smaller Product preparation inset, and a larger main portrait with a smaller companion in the quote. Preserved desktop type, full text, selected assets, ordering, links, hours-before-menu sequence and motion. Responsive image sizes track the adjusted layouts. The hero/header/navigation and Speisekarte audit items remain separate.

TypeScript, all 39 tests, slug audit, isolated optimized build and diff checks pass. Ten Chromium/WebKit layouts from 320–2560px and fourteen content variants at two widths in both engines cover content preservation, image fallbacks, centering, source-size caps, motion/focus, reduced motion and no JavaScript. All 146 development content/draft revisions are unchanged. There is no additional production content migration for this pass. See the [homepage implementation record](homepage-redesign.md#homepage-sections-audit-follow-up--5-november-2026); local evidence is in `.sanity-backups/home-sections-review/`.

## Audit follow-up — header, hero, navigation, Speisekarte and Kontakt

**5 November 2026 · Implemented for user review; uncommitted.** Completed the remaining actionable design-audit items. The header remains transparent, retreats during downward reading and returns upward/on keyboard focus. Known photograph regions use white artwork with a small shadow. The hero leads with existing finished food/preparation imagery, requests cover-aware image sizes and has optional owner-editable desktop introductory copy and a Speisekarte link. The original viewport composition, ordering route and carousel cadence remain.

Navigation has a visible current-page state, room for German labels, a separate social-link gap and 44px minimum link heights. Speisekarte exposes all twelve named categories through a native sticky chooser, with a current category, native anchors, Escape/outside dismissal and small dark text. Its centered menu/prices/allergen layout remains. Kontakt collapses repeated mobile introduction copy after question one, clarifies the message field and updates focus/scroll after rendering each question. The owner declined a response-time promise, so the wording is unchanged.

Development-only content changes: the Home hero's image order plus two new optional strings; header, existing header draft and footer menu labels; `menuPage.title`; six allergen labels. The connector's draft-only mutation does not provide the required atomic published-and-draft field update, so the established CLI pattern used a hard project/development guard, a full before snapshot and revision-guarded transaction. Full-content comparison of all 146 documents verifies exactly these fields; 135 unrelated document/draft revisions are unchanged. No draft was published or discarded. All eight selected images/crops/hotspots/alt text, menu items/prices, legal and story bodies are preserved. There are no production changes.

Verification: 40 regression tests (including cover/crop/source-size regression coverage), TypeScript, schema extraction, development slug checks, diff checks and an isolated optimized build pass. Ten Chromium/WebKit layouts from 320–2560px cover viewport-fitting hero/order/status, 44px navigation links, menu focus containment, all twelve category destinations, native history/same-fragment keyboard navigation, current-category tracking, header direction/contrast/focus behavior and Kontakt's complete review/edit flow without submitting. No-JavaScript category and email fallbacks pass. Mobile Kontakt's message-step action is visible at 320×568 and 390×844; short landscape can still require scrolling. Physical keyboard/screen-reader checks and real email activation remain open.

Four additional normal-motion Chromium/WebKit checks at 390px and 1440px verify first/repeat entrances, image playback, live reduced-motion stopping, stationary ordering hover, scrolled-menu visibility/restoration and smooth category jumps without runtime errors. WebKit correctly skips the intro when it restores a scrolled page.

Photo playback retains the 1.2-second nominal interval and waits for loaded images; cold high-density image requests can make the first pass slower. This is not a fresh performance certification or a closure of the earlier mobile LCP finding. The owner’s existing development server and its build directory were preserved.

Owner controls and details: [hero/header](homepage-redesign.md#remaining-design-audit--5-november-2026), [Speisekarte](secondary-pages.md#speisekarte-audit-follow-up--5-november-2026), [Kontakt](contact-page.md#mobile-audit-follow-up--5-november-2026). Backups and review evidence are in `.sanity-backups/remaining-audit/`. The narrow production candidates are added to the handover table below; they require fresh comparisons and owner reconciliation, not a dataset import.

## Changes made during verification

- Corrected the document language to German and Open Graph locale to `de_DE`.
- Restored the orange, illustrated 404 after visual review, using Site Settings → Brand → Supporting Logo and Logo. “Suchst du nach Focaccia?” leads to the Speisekarte through the shared animated “Die gibt’s hier!” link, with a secondary return-home link. The page retains a German heading, keyboard focus styles and a real 404 response.
- Made story overview headings follow the page heading. Article and legal headings now form a consecutive screen-reader outline while preserving the CMS wording and existing type sizes.
- Localized story-card dates to German.
- Improved small-text contrast: dark ticker text on the existing orange background; dark category/allergen labels; orange underlines and selection borders instead of low-contrast small orange link text. The large ordering SVG keeps its orange hover state.
- Fixed menu keyboard containment in WebKit, including its default behavior of skipping links when tabbing. Escape still closes the menu and restores focus.
- Gave the leading hero image an explicit high fetch priority. The intro travels using transforms instead of changing its top/left position; its route, timing and image crop behavior are retained.
- Honored homepage SEO overrides and protected development datasets and Vercel previews with `noindex, nofollow` and a disallowing robots file. Production indexing requires `NEXT_PUBLIC_SANITY_DATASET=production` outside a Vercel preview.
- Replaced German display strings in Restaurant JSON-LD with structured weekly hours and dated exceptions/closures. Invalid, unmigrated or ambiguous 24-hour schedules omit machine-readable hours rather than inventing them. JSON-LD escapes `<` in CMS text, following [Next.js guidance](https://nextjs.org/docs/app/guides/json-ld). Hours follow [OpeningHoursSpecification](https://schema.org/OpeningHoursSpecification).

## Preservation and verification

The optimized review build was tested against **development**, separately from the existing local development server. It used an isolated checkout so it did not overwrite the `.next` directory used by `localhost:3000`. The temporary review server has been stopped; the existing development server remains available for review.

| Check | Result |
| --- | --- |
| Automated tests | 39 pass, including the existing URL, ordering, opening-hours and contact protection tests plus JSON-LD, indexing and heading regressions. |
| TypeScript / optimized build | Pass. Development published-slug audit has no errors, warnings or pending changes. |
| Routes | All 15 public pages return 200; unknown pages return 404. Case/trailing-slash/home aliases preserve the intended canonical destination and query strings. `/order` returns the expected 307 to Degaso; no order was submitted. |
| Links / search metadata | Internal links resolve; 15 unique sitemap entries; canonical URLs, descriptions, German language, structured hours and preview indexing protection checked. |
| Preserved content | All ten articles, their related references/covers/dates, menu groups/items/prices/variants/allergen references, legal wording and homepage rich text checked against the current CMS snapshot. |
| Accessibility | Automated axe checks on public templates, the 404 and open menu, plus scrolled homepage sections, footer/story hover, allergens and contact validation/selection states. No detected violations in those checks; this is not a claim of full WCAG conformance. |
| Layout / interaction | Secondary-page checks cover nine viewport sizes (36 layouts per browser); hero/menu checks cover another seven sizes per browser, spanning 320–5092 px and short landscape viewports. Chromium and WebKit checks include hero content above the fold, full-width ticker, menu opened at several scroll positions, focus containment/return, no-JavaScript fallbacks and the complete Kontakt demo flow. |
| Motion / hours | First-visit intro, autoplay and a live switch to reduced motion verified. Opening/closing minute boundaries, shared menu status and holidays verified with a Los Angeles device timezone; unit tests also cover split service, overnight periods, closures and both DST transitions. |
| Failure recovery | Broken first image shows a brand fallback; slow images reserve their space; a broken upcoming image keeps the last loaded frame; a stalled navigation cannot leave the page covered indefinitely. |
| CMS workflow | Authenticated local Studio: edited a ticker phrase, reordered carousel images, changed opening time, changed an item price and edited/published a story using isolated development copies. Verified stored values and the published page/story routes, then removed all four test documents. No existing owner document was edited. |
| Cache refresh | A published test change reached the optimized build without rebuilding or redeploying. Observed propagation: **121 seconds**. ISR is request-driven and the Sanity CDN/Next caches can require another cycle; 60 seconds is a revalidation window, not a delivery guarantee. |

Fresh raw exports at the start and end of step 8 match **exactly, including every revision**:

- Development: 211 records, including three owner drafts; no added, removed or changed records after test cleanup.
- Production: 198 records, including five drafts; no added, removed or changed records. Its content also matches the original 31 October baseline, excluding revision/timestamp metadata in that older comparison.

Development already differed from the October baseline before step 8: approved homepage, hours, navigation, intro and Kontakt changes; the old `Revamp` page/draft and two older drafts were already absent. These were recorded, not restored or deleted during this step.

### Performance

Lighthouse 13.6, first visit, optimized local build:

| Measure | Simulated mobile | Desktop |
| --- | --- | --- |
| Performance | 89 | 99 |
| Accessibility / best practices | 100 / 100 | 100 / 100 |
| First contentful paint | 1.1 s | 0.3 s |
| Largest contentful paint | 3.8 s | 0.8 s |
| Total blocking time | 30 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |

The initial mobile run scored 83 (LCP 4.3 s, CLS 0.094). A desktop run exposed CLS 0.191 during the intro; transform-based travel removed measured layout shift. The intro's path and final rectangle were also checked in Chromium and WebKit. Image sizing remains responsive and the first image is discoverable/eager/high-priority; no extra animation dependency was added.

**Mobile LCP still needs improvement to reach a 2.5-second target.** Further work should be measured against the approved first-visit presentation; do not treat a single laboratory score as a field-performance guarantee. No claim of passing real-user Core Web Vitals is made.

These are local laboratory measurements, not production measurements. Lighthouse SEO is 69 solely because the development build intentionally blocks indexing; the other SEO audits pass. Do not remove preview protection to improve that score. Verify production indexing after release.

### Review still needed

- Physical-device testing and a spoken screen-reader walkthrough. Browser viewport and accessibility-tree tests do not replace these.
- Follow-up found during 404 review: an unknown single-segment CMS URL returns 404 but needs JavaScript to display the recovery UI. A nested unmatched route renders the complete 404 without JavaScript. Reproduced the single-segment behavior with a synchronous, data-free version in an isolated checkout too; the visual 404 change does not fix this existing route-error fallback limitation.
- The requested continuous ticker/carousel has no on-page pause control. Reduced motion stops both and the carousel pauses offscreen/in the menu, but the no-control design remains a limitation against [WCAG 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). No controls were added against the approved design.
- Owner copy review: the About section's first-image alt text still describes the former orange menu image; several global/page SEO descriptions remain English. These pre-existing CMS values were preserved for review.
- Kontakt service activation and real email delivery remain separate work in the [activation checklist](contact-page-plan.md#remaining-activation-checklist). Its controlled test-delivery mode is still pending. Current automated contact checks use no-email demo mode or mocked service responses.

## Production content handover

This is a **review inventory**, not permission to execute it. The ignored `.sanity-backups/step8/production-content-review.json` contains current production revisions, before-values and development candidate values for seven documents, plus the eight required assets missing from production. Refresh this comparison immediately before release; it is not an import file.

| Document / area | Targeted change to review |
| --- | --- |
| Home (`f803c306-580e-4053-9b34-84d9cda1f91a`) | Reconcile approved section changes by `_key`: selected hero images and ticker phrases, the reviewed food-first hero order and optional `description`/`menuLinkLabel`, About image pair/menu link, removed standalone location section, Product images/enquiry link, optional second quote image. Preserve text and production-only edits. |
| Menu title / allergen labels | Review “Speisekarte” for `menuPage.title` and German labels for the existing C/D/E/F/N/S allergens. Preserve codes, item references and information; Gluten needs no change. Added after the original inventory. |
| Page Intro (`settingsPageIntro`) | Add the reviewed enabled state and iconmark/wordmark image. Preserve Brand name/tagline and drafts; they provide the spoken identity. |
| Hours (`settingsHours`) | Read-only migration proposes Monday–Saturday 10:00–21:00, Sunday closed and public holidays closed. Add missing structured fields only; retain original text. Recheck the owner's latest hours. |
| Navigation Header / Footer | Reconcile the optional Kontakt reference and “Speisekarte” label for the menu reference into the current ordered links; preserve all other links/toggles/social references and owner drafts. |
| Kontakt (`rmrWCUj4Zl318b4kDFBbDa`) | Optional new page with reviewed reasons/copy/privacy reference. Keep delivery disabled until activation is complete. If this page is deferred, defer its navigation entries and product enquiry link together. |
| Opening story (`44d73d40-b25a-4cad-8520-59cdffd04a3e`) | Set `coverImage.fit` to `contain` after reviewing the latest cover. Preserve the asset, any owner crop, all text and any draft. Added after the original inventory. |
| Bakery story (`0904d3f2-070d-4513-9a6b-dc2d291e2c59`) | Remove only the two literal `**` markers from the current plain-text excerpt, if still present. Preserve wording and body; reconcile newer edits/drafts. Added after the original inventory. |
| Impressum (`af46cbb8-5fc8-4c34-bfa5-dc2109805a84`) | Case-only `Impressum` → `impressum`, using the existing guarded URL migration after compatible code is deployed. No legal wording changes. |

**Existing production drafts on Home and Navigation Header must be reconciled by the owner.** Do not publish, discard or overwrite those drafts as a side effect of migration. The other three production drafts must also remain intact.

The eight missing assets include the intro SVG and selected homepage photographs. Transfer the original asset binaries through Sanity's asset API/Studio, verify hashes and resulting asset IDs, then use the returned production references. Do not copy development CDN URLs into production content or import raw asset records without their files. Raw `--raw` archives preserve documents/references, **not asset binaries**.

Stories need only the two targeted corrections above, not a data replacement. Menu items/prices, legal body, contact details and Brand content do not require a redesign data replacement. Do not import the development dataset over production.

## User-owned release sequence

1. **Completed:** the user reviewed the development result and authorized the implementation commits listed above. Complete the remaining release checks and separately decide when to release; commit approval did not authorize production changes.
2. Take new raw production and development exports, preserve the required original asset files, and recheck owner edits/drafts against the review inventory. Stop and reconcile conflicts rather than overwriting them.
3. Repeat the read-only migration checks:

   ```sh
   npm run slugs:normalize -- --dataset production
   npx sanity exec scripts/prepare-hours-migration.ts --with-user-token -- --dataset production
   ```

   The 4 November dry runs found only the legacy Impressum slug and the additive hours fields described above. Neither command applies changes.
4. Set the intended production environment: production Sanity dataset, canonical `https://tapparo.com`, and **`CONTACT_DELIVERY_MODE=disabled`** until the separate activation work is complete. Confirm Studio CORS access for the intended host. Keep development/previews on their own dataset and non-live contact mode.
5. Deploy the reviewed compatible code first. Check all existing public routes, especially lowercase `/impressum`, before changing production slugs. Keep the temporary build exception for the legacy slug until migration completes.
6. Transfer the reviewed assets, then apply only reconciled content changes with current revision guards. Preserve array keys, references and owner drafts. The hours and home/intro/navigation changes need a deliberately reviewed content patch; the comparison JSON is not an executable migration.
7. Execute the case-only slug procedure in [URL normalization](url-normalization.md#production-release-order). Run its strict audit and repeat the dry run afterward; remove the temporary legacy exception only as a separately reviewed code cleanup.
8. Allow request-driven caches to refresh. Verify home/intro/carousel/hours, every story, Speisekarte prices/allergens, Impressum, navigation/footer, metadata/sitemap/robots, the `/order` redirect and the chosen Kontakt fallback/live state. Check that production has no unintended `noindex`.
9. Record the actual code commit, deployment reference, content patch/backup references and smoke-test outcome in `PROJECT_PLAN.md`. The assistant has not executed any production release action.

## Rollback

- Preserve the previous deployment reference and field-level before-values before releasing. Revert to a reviewed compatible deployment if necessary; keep lowercase routing support because browsers may cache permanent redirects.
- For content, fetch the latest affected documents and restore only the fields changed by the release, with revision guards. Stop on intervening owner changes. Do not restore an entire old dataset.
- Revert new navigation/product references before removing a newly created Kontakt page. Disable sending immediately if delivery is uncertain; do not invent a successful confirmation.
- Restore the previous intro/image references and section values before considering deletion of newly uploaded assets. Keep uploaded assets until references are checked; orphaned assets are safer than broken images during rollback.
- The original text-hours field remains available for rollback. A missing/invalid structured schedule intentionally shows a neutral hours prompt, not a guessed open state.
- After rollback, repeat route, content and cache checks and record what was restored. Never publish or delete an owner draft as part of rollback.

## Local evidence

Ignored directory: `.sanity-backups/step8/`. Keep exports, logs and screenshots out of commits.

- `development-before/after.tar.gz`, `production-before/after.tar.gz`, `preservation-final.json`.
- `development-baseline-comparison.json`, `production-baseline-comparison.json`, `production-content-review.json`.
- `tests-final.log`, `types-final.log`, `tests-precommit.log`, `types-precommit.log`, `build-final.log`, `routes.json`.
- `audit-before/after.json`, `accessibility-states.json`, `content-layout-checks.json`, `webkit-content-layout-checks.json`, `interactions.json`, `intro-motion.json`, `home-preservation.json`, `failures.json` and responsive screenshots.
- `cms-workflow.json`, `cache-refresh.json`, `cms-fixture-cleanup.json`: isolated fixture edits, publication/cache evidence and confirmed zero remaining fixtures.
- `production-slugs-dry-run.log`, `production-hours-dry-run.json`.
- `lighthouse-mobile-final.json` and `lighthouse-desktop-final.json`, alongside earlier measurements.
- `404-review.json`, `404-review.log`, `404-build.log` and `404-chromium/webkit-390/1440.png`: subsequent orange 404 review. Twelve layouts across both browsers, accessible contrast/focus, menu navigation and restoration of the normal page background pass; the no-JavaScript scope is documented above.


## Audit work committed — 6 November 2026

The user authorized committing the prior audit refinements before the next hero/menu revision. Commits: `b891ad1` (legal/404/footer), `f2046b9` (Stories), `1bac920` (homepage sections), `ae14093` (hero/navigation/Speisekarte), and `714d982` (Kontakt). The historical “uncommitted” notes above describe their original review state. All 40 tests, TypeScript and diff checks passed immediately before this commit series. No push, deployment, email or production changes. The newly approved hero/menu composition work is separate and remains subject to review.

## Hero/menu Taste implementation — 6 November 2026

The backed-up hero/menu revision is committed at the user’s request as `64b8021` and `b523589`, preserving the current iteration before a further design plan. This does not represent final visual or release approval. Previous audit work and documentation are committed through `36c8955`; the baseline is tagged `backup/hero-menu-before-taste-2026-11-06`. Full details, measurements and scanner triage are in the [hero/menu review](hero-menu-taste-review.md#implementation--6-november-2026).

- Desktop information is grouped beside the food photograph; the overlay retains a paused photograph. Mobile uses matching logo/action/status anchors and consistent gutters. Large-screen content remains centered while the photo/ticker bleed to the viewport edge.
- The ticker uses large orange text on cream at 24px/s; reduced motion gives one manually scrollable phrase sequence. The CMS-branded intro is shortened, retaining its accessible restaurant identity and interruption behavior.
- Forty existing tests, TypeScript, diff checks and an isolated optimized build pass. Thirty-two main and twelve edge checks pass across Chromium/WebKit, including nine viewport sizes from 320–5092px, scrolling/resizing, focus/Escape, normal/reduced motion, no-JavaScript access, long labels, image failures and route changes.
- Two discovered edge defects were fixed: WebKit's static-ticker arrow scrolling after closing the menu, and short-landscape navigation passing beneath the close control.
- Ten relevant raw development documents match their backup exactly. The existing CMS fields remain the source for imagery, phrases, identity and navigation. There are no content/schema/dependency migrations for this revision.
- Evidence is local and ignored under `.sanity-backups/hero-menu-taste-2026-11-06/`. The desktop Taste inspector still reports seven failures/five warnings; its brand conflicts, repeated-ticker/heading misclassification and unrelated Home findings are explicitly documented. This is not a claim of a clean full-site scanner or accessibility audit.

The previously listed physical-device/spoken screen-reader checks, measured mobile LCP follow-up, no-JavaScript CMS-slug 404 limitation, no-pause-control limitation and Kontakt activation are still open. No new Lighthouse score is claimed for this revision. No release, push, emails or production changes were performed; the user retains production-release ownership.


## Pending hero/navigation visual revision — 6 November 2026

The new composition and follow-up refinements are committed at the user’s explicit request and remain under visual review; earlier full build/browser evidence does not validate this newer implementation. See the [current plan](hero-navigation-redesign-plan.md). Basic TypeScript/diff checks and three representative Chromium layouts pass, with no recorded runtime errors or horizontal overflow. The initial visual pass did not include a full regression suite, production build or browser/device matrix. Subsequent code checks are recorded below; fresh browser and optimized-build checks remain pending.

Before release:

- Obtain visual lock-in for the revised hero branding, mobile image balance, full-width ticker and centered menu.
- Visually verify the subsequent hero entrance fixes described below, including the first-visit photo handoff and returning to Home under the page cover.
- Complete focused responsive, CMS-variation, keyboard, reduced-motion, intro/route-transition and browser checks against the locked-in design, then run the appropriate build/regression checks.
- Include the local Header Navigation field-description changes in the eventual Studio release. The ordering link is inserted after Home in application code; this is explained to editors and is not a new editable navigation field.

Production release remains user-owned. No CMS document mutations, schema deployment, live emails, push or release actions occurred in this refinement.

## Typography, Home entrance and section-border fixes — 6 November 2026

Implemented after explicit approval of the three-part bug-fix plan:

- Story authors/dates use the existing 14px caption treatment, without forced capitals or expanded tracking. Footer headings use 16px Instrument Sans at medium weight. CMS spellings and dates remain intact.
- A hero mounted beneath the page-transition cover consumes its entrance immediately, preventing a second wipe after the cover leaves. Entrance state is owned by the hero instead of also being mirrored onto the site shell. The first-visit animated photograph reveals the underlying photo at animation completion rather than through an independent CSS timer. Slow/erroring first-image loading now removes both listeners when settling, and explicit interruptions consume a pending entrance, preventing late events from restarting it. Direct fresh-load and returning-load entrances remain available.
- Menu navigation, category boundaries, the allergen section, Home product-section boundaries and related-story boundaries use full-width outer sections with the existing centered inner containers. Item/card dividers and reading widths retain their existing layout. The recent menu-header offset fix remains in place. No broad layout refactor was required.

Validation: TypeScript, diff checks and all 40 existing regression tests pass. Ten additional React StrictMode/DOM-simulation lifecycle checks exercise covered entry with and without prior visits, uncovering, fresh/repeat loads, late image callbacks, scroll restoration, reduced motion and interruptions. The pre-fix hook fails the covered-entry regression. These temporary checks use existing local dependencies and are saved in `.sanity-backups/bug-fixes-2026-11-06/`; no dependencies were added. Home, Menu, Stories, an article and the design preview return HTTP 200, with rendered-HTML/compiled-CSS checks for container boundaries, author casing and a single entrance owner.

**Verification limit:** native Chrome automation rejected navigation again, and the in-app browser is unavailable. Fresh mobile/desktop/ultrawide screenshots, frame-by-frame motion playback, browser back/forward, actual keyboard/anchor interaction and production-build verification remain pending. DOM simulation does not establish visual timing or browser layout. These fixes are included in the commit checkpoint below; no push, deployment or CMS changes occurred.

## Direct-entry welcome, category dropdown and footer alignment — 6 November 2026

- Direct visits to non-Home pages now show the existing CMS-branded welcome once per tab, using the same session key as Home. The shared artwork/fade is extracted without changing Home's photo handoff. The secondary-page welcome stays tied to the initial route, skips repeat visits, and settles on navigation, interaction, reduced motion or delayed hydration. Without JavaScript the page stays visible. The Studio field description now reflects this site-wide behavior; no content documents were edited.
- The category dropdown's darker background and bottom border span the viewport. Its links sit in a centered 624px inner column aligned with the menu content, with matching page gutters, two columns on desktop and one below 768px. This follows the user's clarification that only the contents should be constrained. Bounded scrolling, category order, native anchors and the header offset remain intact.
- Footer information is left-aligned across four desktop columns within the same capped container/gutters as Home's quote. The bottom wordmark and “nach oben” row sit outside that cap and use the header's viewport insets. Tablet/mobile grouping remains responsive.

Validation: TypeScript and all 40 existing tests pass. The temporary React StrictMode/DOM lifecycle checks now total 18, including direct non-Home welcome, shared Home/non-Home session state, repeat loads, disabled/reduced/expired entrances and pointer interruption. Local Home, Menu, Stories and Kontakt return HTTP 200 with the expected intro ownership; all 12 category links and compiled dropdown styles are present. Evidence is in `.sanity-backups/bug-fixes-2026-11-06/`.

Fresh browser visual/motion verification is still pending: Chrome input again returned a changed-app rejection and no browser automation surface is available. The checks above do not establish browser layout or frame timing. These changes are committed locally as recorded below.

## Design refinement commit checkpoint — 6 November 2026

The user explicitly requested sensible commits for the complete current work:

| Commit | Scope |
| --- | --- |
| `c7f46ce` | Full-height hero, bottom ticker, stationary header, centered navigation, shared preview and stable hero/photo entrances. |
| `398e1cc` | Once-per-tab branded welcome on direct visits to secondary pages, sharing Home’s state and CMS settings. |
| `98e041f` | Header-safe sticky categories, viewport-wide dropdown with bounded content, and full-width structural section borders. |
| `5525c86` | Normal-case story metadata/footer headings, left-aligned footer information and header-aligned bottom row. |

The accompanying documentation commit saves this plan and verification record. Source checksums match the pre-commit working tree, and the staged hero snapshot passes an isolated TypeScript check. Existing TypeScript/diff, 40 regression-test, 18 entrance-lifecycle, five welcome-bootstrap and local route-rendering checks remain valid. This commit-only step introduces no runtime changes or new dependencies.

Fresh responsive screenshots, browser motion/interaction checks and an optimized build remain pending. The commit request preserves the current iteration; it does not imply final visual acceptance or release approval. No push, deployment, CMS mutation or email sending occurred.
