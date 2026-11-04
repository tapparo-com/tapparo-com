# Step 8 — development review and release handover

**4 November 2026 · Committed following user review and explicit authorization.** The user will perform the production release. No push, deployment or production mutation has been performed or authorized. Kontakt remains a no-email preview in development.

Implementation commits: `43acf65` (search metadata), `3527fe7` (accessibility), `fd98c53` (hero performance), and `d606b3f` (branded 404). All 39 tests, TypeScript and diff checks passed again before committing. Remaining release checks and limitations below stay open.

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
| Home (`f803c306-580e-4053-9b34-84d9cda1f91a`) | Reconcile approved section changes by `_key`: selected hero images and ticker phrases, About image pair/menu link, removed standalone location section, Product images/enquiry link, optional second quote image. Preserve text and production-only edits. |
| Page Intro (`settingsPageIntro`) | Add the reviewed enabled state and iconmark/wordmark image. Preserve Brand name/tagline and drafts; they provide the spoken identity. |
| Hours (`settingsHours`) | Read-only migration proposes Monday–Saturday 10:00–21:00, Sunday closed and public holidays closed. Add missing structured fields only; retain original text. Recheck the owner's latest hours. |
| Navigation Header / Footer | Reconcile the optional Kontakt reference into the current ordered links; preserve all other links/toggles/social references. |
| Kontakt (`rmrWCUj4Zl318b4kDFBbDa`) | Optional new page with reviewed reasons/copy/privacy reference. Keep delivery disabled until activation is complete. If this page is deferred, defer its navigation entries and product enquiry link together. |
| Impressum (`af46cbb8-5fc8-4c34-bfa5-dc2109805a84`) | Case-only `Impressum` → `impressum`, using the existing guarded URL migration after compatible code is deployed. No legal wording changes. |

**Existing production drafts on Home and Navigation Header must be reconciled by the owner.** Do not publish, discard or overwrite those drafts as a side effect of migration. The other three production drafts must also remain intact.

The eight missing assets include the intro SVG and selected homepage photographs. Transfer the original asset binaries through Sanity's asset API/Studio, verify hashes and resulting asset IDs, then use the returned production references. Do not copy development CDN URLs into production content or import raw asset records without their files. Raw `--raw` archives preserve documents/references, **not asset binaries**.

Stories, menu items/prices, legal body, contact details and Brand content do not require a redesign data replacement. Do not import the development dataset over production.

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
