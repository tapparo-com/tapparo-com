# Working in this repository

## Conventions

- Preserve the current appearance, content, URLs and behavior during cleanup. Keep changes simple and local to the feature.
- Use the Node version in `.nvmrc`, npm and the committed lockfile. Setup and commands are in [README.md](README.md).
- Use TypeScript, named exports and the `@/` alias. Framework entry points keep their required default exports. Type CMS results and props; narrow untrusted values instead of using `any`.
- Prefer Server Components. Use `"use client"` for interaction, browser APIs or animation. Keep CMS reads and secrets on the server.
- Put Tailwind utilities directly in the owning TSX markup. Use complete class names for conditional variants. Custom CSS belongs in `app/globals.css`; no CSS Modules or separate files of class strings. Prefer existing tokens; use inline styles for runtime values. Prettier sorts classes when formatting.
- Keep behavior with its feature. Share helpers or components when there is actual reuse; avoid additional abstraction or enforcement tooling for conventions.
- Run `npm run typecheck` and `npm test` for code changes, and `npm run build` before release. Build in a separate checkout if a dev server is using `.next`. Check affected UI on mobile and desktop, including keyboard/reduced motion when relevant.
- Test meaningful behavior, not class strings or deleted backups. Keep documentation here and in the existing contact plan; no additional agent files, project plans or progress journals.
- Work against the `development` dataset. The user handles production deployment and content migration. Do not push, deploy, activate email or change production during routine code work. Keep secrets and personal enquiry data out of Git.

## Code map

| Location                                                                   | Responsibility                                                                                                                                         |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/(site)/`                                                              | Published page composition and shared public layout. Home, Menu and Stories have dedicated routes; `[slug]` resolves pages, posts and legal documents. |
| `app/order/route.ts`                                                       | `307` redirect to the fixed ordering destination from `lib/ordering.ts`.                                                                               |
| `app/api/contact/route.ts`                                                 | Contact demo validation; no email delivery or Sanity draft preview.                                                                                    |
| `app/studio/`                                                              | Embedded Sanity editor, outside the public site shell.                                                                                                 |
| `components/sections/`                                                     | CMS section renderers, dispatched by `SectionRenderer`.                                                                                                |
| `components/hero/`, `homepage/`, `pages/`, `stories/`, `menu/`, `contact/` | Feature-owned presentation and interaction. These folders live under `components/`.                                                                    |
| `components/ui/`                                                           | Shared links, media, underlines and transitions.                                                                                                       |
| `lib/`                                                                     | Content types, URL, SEO, image, ordering, hours, contact and motion rules.                                                                             |
| `sanity/`                                                                  | Schemas, queries, client and content fetching.                                                                                                         |
| `tests/`                                                                   | Runtime behavior tests.                                                                                                                                |

A CMS feature spans schema → query projection → TypeScript type → renderer. Update those together and handle missing optional fields/references. `lib/content.ts` owns shared content types; `sanity/lib/content.ts` resolves a slug once for rendering and metadata, in page → post → legal order.

Public queries use published content only. Local development reads fresh data; optimized builds use request-driven 60-second revalidation, so publication may take another cache cycle to appear. Already-open pages need a reload. The contact endpoint reads its published form configuration uncached on submission. Studio schema `preview` entries are editor labels/thumbnails, not unpublished website previews.

`lib/urls.ts` owns URL normalization and slug rules. Public paths are lowercase without trailing slashes; `/home` redirects to `/`. Pages, posts and legal documents share a case-insensitive slug namespace; menu categories have their own anchor namespace. Keep existing slugs stable and add redirects for substantive renames. Use `TransitionLink` internally, `/menu` for menu browsing and `ORDER_PATH` for ordering. `/order` bypasses page transitions and prefetch.

The welcome runs once per tab session. Home uses its first hero image; other pages use shared artwork. Preserve interruption/return-navigation behavior. The carousel follows CMS order/crop/hotspot, defaults to 1.2 seconds, and pauses when hidden, offscreen, covered or reduced motion is enabled. A single image is static.

`lib/opening-hours/` uses Europe/Berlin. Priority is temporary closure → date exception → Munich holiday policy → weekly schedule. Exceptions replace the whole date, including overnight carry-over. Footer/About show regular hours; legacy text remains a fallback. Invalid configuration produces a neutral status. Keep DST, overnight and exception behavior covered by tests.

## Editing in Studio

Publish edits to make them visible; there is no website draft-preview workflow. Check the selected dataset before editing. Keep array keys, asset references and unrelated owner drafts intact.

- **Site Settings:** Brand owns identity/artwork; Page Intro owns the welcome artwork/toggle; Contact owns public email/phone/address; SEO owns shared metadata and Coming Soon. Coming Soon leaves Studio and ordering available.
- **Navigation:** Select and order existing page/social references. Header inserts the fixed ordering link. Creating a social link alone does not display it.
- **Pages:** Reorder sections and edit their content. Keep Hero first on Home. Hero supports images, ticker, introduction and an optional second link; enable it and choose a published destination. Its legacy `menuLinkLabel` is no longer displayed. Image crop/hotspot and alt text belong to the image fields.
- **Opening Hours:** Enter all weekdays under Weekly opening hours, using 24-hour times. Enable Closes next day for overnight periods. Special dates override the entire date; temporary closures include both end dates. Holiday hours and Christmas/New Year's Eve exceptions need explicit review. Original text hours remain stored.
- **Menu:** Menu Page orders categories; categories order items. Unavailable items are hidden. Allergen codes and item references stay stable when labels change. These edits do not update the ordering provider.
- **Stories:** Post date controls sorting, not scheduled publication. Cover framing, excerpt and rich text are separate fields. Related stories use the chosen selection or fall back to recent posts. Post images use the title as alt-text fallback.
- **Legal:** Edit full rich text, SEO and update date; heading links are automatic. Preserve published URLs.
- **Kontakt:** The form and its CMS copy exist, but delivery is unimplemented. Development uses a labelled no-email demo; production shows direct email. Remaining work and editing details are in [the contact plan](docs/contact-page-plan.md).

## Manual production release

The cleanup itself needs no CMS migration. The redesign's development content does need reconciliation with production. The user performs this release.

1. Check the candidate with typecheck, tests, build and a mobile/desktop review. Use project `64kcdhuf`, dataset `production`, `NEXT_PUBLIC_SITE_URL=https://tapparo.com` and `CONTACT_DELIVERY_MODE=disabled` for the production build. Rebuild after public environment changes. The embedded Studio ships with the application; configure its origin in Sanity CORS. Check Vercel's Git integration before pushing, as a push may deploy automatically.
2. Compare current production content and drafts with development. Save a fresh export and required original media privately before editing. Never import development wholesale over production or publish an owner's unrelated draft. Reconcile only the fields below; if using API patches, use current revisions and address array entries by `_key`.
3. Upload missing original assets to production and use the returned asset references, preserving crop/hotspot/alt data. Use the current development hero image order. Do not paste development CDN URLs into content.
4. Deploy compatible routing before changing the legal slug. Confirm `/impressum` works while the stored slug is still `Impressum`, then change only that slug to `impressum` in Studio and publish after reviewing any draft. Keep legal text intact. Check `/Impressum` redirects and the canonical URL is lowercase.
5. Enter structured hours through **Site Settings → Opening Hours**. Confirm the actual schedule, preserve exceptions/closures and original text, and publish. No migration script is needed.
6. After caches refresh, check Home images/intro/hours, menu, stories, legal text, navigation, direct-email fallback, `/order`, redirects, 404, sitemap and production indexing. Development/preview builds intentionally block indexing. Keep the previous deployment and before-values for reverting only release-owned changes.

### Redesign content to reconcile

This inventory came from published data on 6 November 2026; drafts were not inspected. Recheck current content before applying it.

| Target                                                 | Intended change                                                                                                                                                                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home `f803c306-580e-4053-9b34-84d9cda1f91a`, Hero `s1` | Seven ordered `heroImages`, description, ticker and `secondaryLink`: enabled, label `speisekarte ansehen`, reference `menuPage`. The optional second link has no fallback; stage this field before release if it must stay visible. |
| Home location `83a69bd55c60`                           | Remove only the redundant standalone address section.                                                                                                                                                                               |
| Home About `88ad61dd7dc5`                              | Replace first image, add secondary image, change button `5c662a2a7534` label to `speisekarte`; preserve body, destination and hours. Review outdated first-image alt text.                                                          |
| Home Product `127c47c7f4bd`                            | Add secondary image; add the enquiry link only if Kontakt is included, using its production reference and reason `catering`.                                                                                                        |
| Home Quote `s4`                                        | Add primary alt text and secondary image; preserve quote and attribution.                                                                                                                                                           |
| Home Gallery / Large Text / Stories                    | Preserve content and order; reviewed Home has seven sections after the duplicate removal.                                                                                                                                           |
| `settingsPageIntro`                                    | Create if still absent, after checking drafts: enabled with the reviewed artwork. Preserve Brand settings.                                                                                                                          |
| `settingsHours`                                        | Add missing structured weekly hours: reviewed development is Mon–Sat 10:00–21:00, Sunday/holidays closed. Reconfirm with the owner.                                                                                                 |
| `menuPage`, `navigationHeader`, `navigationFooter`     | Use `Speisekarte` for menu title/labels and `Impressum` for footer legal label. Keep existing references/keys/order.                                                                                                                |
| Opening post `44d73d40-b25a-4cad-8520-59cdffd04a3e`    | Set `coverImage.fit` to `contain`.                                                                                                                                                                                                  |
| Bakery post `0904d3f2-070d-4513-9a6b-dc2d291e2c59`     | Remove the two literal `**` excerpt markers if still present, preserving wording.                                                                                                                                                   |
| Legal `af46cbb8-5fc8-4c34-bfa5-dc2109805a84`           | Change `Impressum` to `impressum` only after compatible code is deployed.                                                                                                                                                           |
| Allergens                                              | Preserve codes/references; reviewed labels are D Milchprodukte, N Nüsse, F Fisch, S Soja, E Eier, C Sellerie. G is unchanged.                                                                                                       |

Menu prices, story bodies, Brand, Contact and SEO need no wholesale copy. If including Kontakt, inspect production for an existing page/draft first. Development uses page `rmrWCUj4Zl318b4kDFBbDa`, section `contact`, and the legal reference above. Use the actual production page reference in navigation and Product; keep email delivery disabled.

Seven assets were missing from production at that review. Download originals from development and upload through production Studio; verify returned IDs. Other selected secondary images and Hero 3/6 existed in both datasets, but recheck their references at release.

| Use               | Original file            | Development asset ID                                           |
| ----------------- | ------------------------ | -------------------------------------------------------------- |
| Hero 1            | DSC07132.jpeg            | `image-3fd93f9b17eca46776918957ec7df951a0be69cb-4672x7008-jpg` |
| Hero 2            | DSC07127.jpeg            | `image-c346984a063049798e004c695c8b169e46966aee-4672x7008-jpg` |
| Hero 4            | DSC07629.jpeg            | `image-00573f4aaa7e9f00e690ac9e4c3bb6b91897eadb-4672x7008-jpg` |
| Hero 5            | DSC06837.jpeg            | `image-c8b5be132da4a3168d96f12c91047ca017093a7c-4083x6125-jpg` |
| Hero 7            | DSC07462.jpeg            | `image-0379fede088d4a8fbad1cddfd148bc3be5543f5a-4672x7008-jpg` |
| About first image | DSC07582.jpeg            | `image-f680d90e50661f1c0eb6f8e7b90f6441e311d49a-3846x5771-jpg` |
| Welcome artwork   | tapparo-intro-lockup.svg | `image-e85bc4fce72066953d0065979b8616b5b7144ee4-1070x1392-svg` |
