# Tapparo website — implementation plan

Created: 31 October 2026  
Last updated: 31 October 2026  
Status: Assessment complete; implementation has not started. The sequence and design proposals below are awaiting review.

## Working agreement

- Work through the milestones in sequence, starting with the urgent URL fix.
- Keep each milestone independently reviewable. Separate the urgent fixes from the redesign release.
- **Do not commit work until the user explicitly locks it in.** Writing this plan does not constitute approval of an implementation.
- Apply production content changes and releases according to the agreed milestone review.
- Update this file as work progresses: record completed tasks, review decisions, validation evidence, and any resulting commit or release reference.
- Preserve the owner's simple Sanity workflow: Site Settings, Navigation, and reusable sections that build pages, alongside the dedicated menu, stories, and legal editing workflows.

## Progress tracker

| Milestone | Status | Locked in | Commit / release |
| --- | --- | --- | --- |
| 1. URL normalization | Not started — urgent | No | — |
| 2. Ordering route | Not started | No | — |
| 3. Design and motion direction | Not started | No | — |
| 4. Sanity enhancements | Not started | No | — |
| 5. Hero, carousel, and shared motion | Not started | No | — |
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

Priority: urgent. Deliver independently of the redesign.

- [ ] Export production content and capture the route/content inventory, including drafts and asset references.
- [ ] Define the URL policy: lowercase public paths, consistent trailing slashes, clean URL joining, reserved routes, and a consistent convention for newly generated slugs.
- [ ] Implement conditional `308` redirects in `middleware.ts`, suitable for Next.js 15.
- [ ] Preserve query parameters; exclude Studio, API, framework, and asset paths; redirect only when the destination differs.
- [ ] Add shared slug generation and validation for pages, posts, and legal pages, covering manual edits and generated values.
- [ ] Enforce case-insensitive uniqueness across their shared namespace, excluding the same document's draft/published pair, and protect reserved routes.
- [ ] Validate menu-category slugs in their separate anchor namespace.
- [ ] Add validation to migration/import workflows; Studio validation alone does not govern every API write.
- [ ] Introduce compatible lookup behavior before migrating the uppercase production slug, so the lowercase destination remains available throughout rollout.
- [ ] Dry-run and review the `Impressum` → `impressum` migration in development, then apply the agreed production migration without publishing unrelated drafts.
- [ ] Update internal URL construction, navigation links, sitemap generation, and canonical metadata consistently.
- [ ] Preserve existing story slugs; use explicit redirect aliases for future substantive slug renames.
- [ ] Verify mixed-case URLs, trailing slashes, repeated slashes, query strings, unknown routes, reserved routes, collisions, and redirect-loop prevention.

Acceptance: old uppercase links resolve correctly; canonical lowercase URLs return content; the sitemap contains clean canonical URLs; invalid or colliding slugs are caught before publication.

Implementation references: [Next.js 15 middleware](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware), [Vercel routing middleware — available on all plans](https://vercel.com/docs/routing-middleware), [Sanity slug configuration](https://www.sanity.io/docs/studio/slug-type). This solution does not depend on dashboard-managed redirects.

## 2. Establish `/order`

- [ ] Add a server-side `307` redirect from `/order` to `https://order.degaso.de/1b33fef5-2777-434b-8960-03889fcfb1d7`.
- [ ] Route every “jetzt bestellen” CTA through `/order`.
- [ ] Keep menu-viewing links pointed at `/menu`.
- [ ] Treat ordering as an outbound journey in the transition system, without an overlay delaying or trapping navigation.
- [ ] Verify direct visits, CTA clicks, new tabs, and the destination's availability without placing an order.

Acceptance: all ordering entry points reach the specified Degaso destination. The temporary redirect allows the provider destination to change later without permanently cached redirects.

## 3. Lock design and motion direction

- [ ] Preserve the desktop sketch's composition: image left; status/address upper right; logo and ordering artwork below; ticker along the bottom.
- [ ] Preserve the mobile sketch's composition: ticker; logo/navigation; image; ordering artwork; status/address.
- [ ] Specify tablet, narrow-screen, and shorter-screen behavior rather than simply scaling the desktop frame.
- [ ] Agree on image crops, spacing, navigation behavior, and the treatment of the brand SVG assets.
- [ ] Prototype carousel cadence and transition style.
- [ ] Define the first-entry sequence, internal page transitions, section reveals, and reduced-motion alternatives.
- [ ] Review the hero and one representative content section before expanding the design across the site.

Review point: responsive hero composition and representative content treatment are locked in.

## 4. Extend Sanity without complicating editing

- [ ] Reuse `sectionHero.heroImages`; update labels and guidance for the new leading-image carousel.
- [ ] Add an ordered list of owner-editable ticker phrases to the hero section.
- [ ] Keep brand assets, contact information, map URL, hours, and SEO in their existing settings documents.
- [ ] Add an easy structured weekly opening schedule, date exceptions, and temporary closures.
- [ ] Agree how holiday closures are represented, preserving the current intent that holidays are closed.
- [ ] Calculate live status in `Europe/Berlin`, including daylight-saving changes, overnight periods, and updates while a page remains open.
- [ ] Keep schema changes additive, migrate existing values carefully, and leave existing drafts unpublished.
- [ ] Verify that the owner can manage carousel images, ticker text, hours, and closures without editing layout or animation parameters.

Acceptance: the new features are editable through the existing simple CMS organization, with global information maintained in one place.

## 5. Build the hero, carousel, and shared motion

- [ ] Implement both Figma compositions as responsive layouts.
- [ ] Use the supplied logo and “jetzt bestellen” SVG artwork, with an accessible link label and the correct `/order` destination.
- [ ] Render the selected Sanity images in their owner-defined order inside the leading-image area.
- [ ] Prototype quick transitions: approximately 250–450 ms changes and 1.5–2.5 second holds. These are starting values, not approved timings.
- [ ] Keep the logo, address, live status, and ordering CTA stable during image changes.
- [ ] Add manual navigation, touch support, and pause behavior.
- [ ] Handle a single image as a static hero and provide a safe empty-image fallback.
- [ ] Preload the next image, respect Sanity crops/hotspots, and prevent layout shifts.
- [ ] Pause autoplay when offscreen or when the tab is hidden; support reduced motion.
- [ ] Implement the owner-controlled moving ticker with pause/reduced-motion behavior.
- [ ] Build a short first-entry sequence, provisionally once per browser session.
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
- [ ] Test desktop and mobile browsers, keyboard navigation, reduced motion, and carousel controls.
- [ ] Test opening-hour boundaries, closures, holiday handling, daylight-saving changes, and overnight schedules.
- [ ] Test slow-loading images and navigation failures.
- [ ] Check loading speed, layout stability, image sizing, and animation responsiveness.
- [ ] Verify the owner's workflow: edit ticker text, reorder carousel images, change hours, update a menu item, and publish a story in the appropriate test environment.
- [ ] Confirm that CMS updates reach the website with the expected cache/revalidation behavior.
- [ ] Complete the final visual and functional review.
- [ ] Prepare rollback instructions for code and any content migrations.
- [ ] Commit only the work explicitly locked in by the user, and record the commit reference here.
- [ ] Perform the agreed release, run production smoke checks, and record the release reference here.

Acceptance: content preservation, functional behavior, visual quality, performance, and CMS usability pass review, with a clear rollback path.

## Decisions still to lock in

- Final carousel transition style and cadence.
- First-entry animation duration and replay policy; current proposal is once per browser session.
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
