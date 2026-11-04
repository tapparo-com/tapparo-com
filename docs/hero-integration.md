# Hero and navigation integration

Milestone 5, implemented against development on 2 November 2026. Approved and committed on 2 November as `a7bc4bc` (motion) and `620a611` (hero/navigation). No CMS documents, production data, deployment, or remote Git branch were changed in this milestone.

## Review

Open [the local homepage](http://localhost:3000/). The approved hero now renders through the existing CMS page builder. The separate [design preview](http://localhost:3000/design-preview) remains available for comparing the approved demonstration sequence and replaying motion.

The development hero uses the owner’s selected photographs. Add or reorder images under **Pages → Home → Hero → Carousel images**; a single selected image stays static. The site never adds the sketch or gallery photographs to that selection automatically. No content was seeded for this milestone.

About, gallery, stories, founders' quote, and other content sections remain separate and render in the exact CMS order; the renderer no longer moves the hero to the beginning automatically. Milestone 6's review explicitly removes the redundant standalone address block while preserving shared contact data in the hero/menu. See the [homepage revision sub-project](homepage-revision-plan.md). Stories, menu, and imprint templates remain for milestone 7.

## Implementation

- `components/hero/SiteShell.tsx` provides shared brand/contact/navigation data, one live opening status, the viewport frame, the handdrawn menu toggle, and the menu. It wraps server-rendered page content without converting those pages into client-only rendering.
- `components/sections/SectionHero.tsx` renders the selected images, ticker, brand, status/address, and `/order` artwork as an ordinary section. There are no review controls on the real pages.
- `HeroParts.tsx`, `HeroIntro.tsx`, `useHeroEntrance.ts`, and `Hero.module.css` are shared with the approved preview. The site's logo comes from Site Settings; ordering artwork remains the original supplied SVG, with a color-only orange hover.
- The independent menu uses the same viewport grid as the hero. Opening after scrolling preserves the initial viewport arrangement of logo, status, ordering, and toggle; closing preserves scroll. The complete opaque panel is masked together, with separate masked entrances/exits for its logo and ordering SVG. Underlying page content is inert and hidden from assistive technology while covered.
- Pages without a leading hero receive a compact brand header with the same shared menu. The viewport outline and 2100 px cap apply throughout the site. Existing sections can retain narrower content widths.
- `lib/hero-images.ts` applies the Sanity crop and derives an object position that keeps the cropped hotspot in view as the hero rectangle changes. The viewport controls image height; the photograph remains flush left and capped at 1400 px within the desktop grid, with left-edge bleed beyond the 2100 px content cap.
- Playback uses 100 ms linear fades and defaults to a 1200 ms start-to-start schedule after images are ready. **Pages → Home → Hero → Image duration (seconds)** accepts 1.2–15 seconds (one decimal place). Missing, nonfinite or out-of-range values use 1.2 seconds. The preview uses the same setting. This changes carousel playback only; the intro choreography remains code-defined. The next responsive image is preloaded. Slow or failed next images leave the last good image visible. One image is static; an empty or failed first image has a branded fallback. No carousel or ticker controls are added.
- Autoplay stops for reduced motion, a hidden tab, an offscreen hero, the intro, an open menu, or a page transition. Ticker phrases come from the owner, with automatic bullets and 8 px separation; empty lists hide it.
- The 2.85-second first welcome runs once per tab session (`tapparo:site:intro:v1`), followed by the 1.15-second repeat entrance. The preview has its own session key. Reordered/scrolled heroes skip the full viewport introduction. Early interaction, scrolling, resizing, unavailable images, hidden tabs, and reduced-motion changes settle the intro safely. Content remains visible without JavaScript or if hydration is delayed.
- The opening indicator uses the browser clock interpreted in Europe/Berlin. SSR starts with the neutral state, then the shared client hook updates the hero and menu. Schedule editing and precedence are documented in [Opening hours](opening-hours.md).

## Navigation and motion

Internal page changes use a 300 ms accent cover, wait for routing to settle, then reveal over 300 ms. Hero entrances wait for that cover to finish. Menu links use the same `TransitionLink` as the rest of the site.

Same-page anchors and query changes use Next's ordinary link behavior. Object hrefs preserve their query and fragment; `replace` and `scroll` options are forwarded. Modified clicks, downloads, and new tabs keep native behavior. Ordering uses full navigation through `/order`, with no transition cover or prefetch.

A failed or cancelled navigation releases the cover. Escape, browser history navigation, hiding the tab, and a live switch to reduced motion also clear it; an eight-second waiting limit prevents an indefinitely blocked page. A request already dispatched to Next may still finish after the cover is dismissed. The provider does not promise to cancel that network request.

The implementation follows the installed Next.js 15 API for [Link](https://nextjs.org/docs/15/app/api-reference/components/link) and [useRouter](https://nextjs.org/docs/15/app/api-reference/functions/use-router). Section reveals share the approved easing, remain readable without JavaScript, and observe live reduced-motion changes. A narrow-screen footer spacing adjustment prevents the existing hours/pages columns from overflowing at 320 px.

## Verification

- All 22 unit/regression tests, TypeScript, the development slug audit, and an isolated development-data production build pass. The homepage remains statically prerendered. Tests cover existing routing and hours plus image crop delivery and responsive focal-point positioning.
- 27 menu checks cover nine viewports at the top, 70 px down, and beyond the hero. They verify viewport fit, width caps, flush-left imagery, matching menu/hero ordering and status positions, fixed toggle position, focus containment, Escape, scroll restoration, and no horizontal overflow.
- Actual homepage → menu → stories → home navigation exercises cover/wait/reveal phases and browser back/forward. Object hrefs, anchors, replace, modifier clicks, explicit new tabs, 404 recovery, and an intentionally stalled request are checked separately.
- A temporary local fixture exercises three images in owner order, empty/single selections, failed first/next images, and section reordering. Measured warm-image intervals were approximately 2523, 2516, and 2515 ms, with 100 ms fades. Offscreen/menu/reduced-motion suspension passes. The fixture was removed from the app afterward; no CMS data was changed.
- Mobile and desktop first/repeat entrances, early Escape, live reduced motion, and no-JavaScript navigation/content checks pass without browser runtime errors. Normal-motion menu geometry remains stationary at mobile, desktop, and ultrawide sizes after scrolling; `/order` still returns the exact Degaso 307 and bypasses the transition cover.

Local evidence is ignored by Git: `.sanity-backups/step5-site-verification.json`, `step5-carousel-verification.json`, `step5-navigation-verification.json`, `step5-entrance-verification.json`, `step5-final-verification.json`, and associated screenshots/check scripts. The temporary fixture source and its data are retained there for reproducibility. Build output is in `step5-build.log`.

This milestone is locked in. Real-device/cross-browser release checks remain part of milestone 8.

## Subsequent homepage polish — 3 November 2026

The user requested a sticky logo and wide-screen corrections before milestone 7. These changes belong to uncommitted substep 6.8, not the original milestone-5 approval. See the [current implementation record](homepage-redesign.md#pre-step-7-polish-68).

The page-builder wrapper and ticker now span the viewport, with centered 2100 px content containers. The hero photograph retains zero left inset: beyond the content cap it extends into the left margin rather than shifting away from the viewport edge. Responsive image sizing and intro handoff geometry account for that extension. The later hero refinement widens the desktop grid to 65/35, raises the photograph limit inside it to 1400 px, and reduces the logo/order artwork by about 35%. The wide-screen extension intentionally goes beyond that limit.

The homepage logo travels toward a top-left sticky header as the visitor scrolls out of the hero. `ScrollHeader.tsx` keeps the original in document flow and uses a separate copy for the animation/home link. The path rises and shrinks toward the left, reverses on upward scrolling and switches instantly with reduced motion. It reconnects when streamed content or a refreshed hero arrives. The full-width menu toggle remains in the same position through open/close; menu links are now right-aligned, with a scroll area below the unchanged status block. The header is transparent with no divider or bottom border and a black logo. Automatic color inversion was tested and discarded because it produced off-brand photo colors and fragmented text overlaps. The footer uses a small logo and compact information/navigation groups from its existing CMS sources.


## What the owner can edit in the intro

Open **Studio → Site Settings → Page Intro**. This dedicated singleton was added on 4 November 2026 and is populated in **development**.

- **Show first-visit welcome:** turns the full welcome on/off. The brief hero entrance remains. The welcome runs once per tab session at the top of Home and respects reduced motion.
- **Intro artwork — iconmark and wordmark:** replace the complete transparent lockup, preferably with an SVG. The full image is contained without cropping. Clearing the field or an unavailable asset uses the supplied Tapparo lockup bundled with the site.
- **Site Settings → Brand → Restaurant Name / Tagline:** these remain the shared text source for the screen-reader heading. No separate tagline is displayed in the visual intro.
- **Pages → Home → Hero → Carousel images:** the first selected photograph supplies the intro image and its crop/hotspot. Reordering the carousel changes the opening photograph.

The uploaded iconmark + wordmark comes from `sticker-54x54-round-rgb-white-v1.png.svg`. Its vector paths, color and arrangement are unchanged; only empty viewBox margins were trimmed. A matching fallback lives at `public/brand/intro-lockup.svg`.

The visual animation is hidden from assistive technology because its content is represented by the permanent hero `h1`: restaurant name followed by tagline. That heading is server-rendered and remains available after the intro, with reduced motion, with the welcome disabled and without JavaScript. No temporary announcement or focus takeover interrupts reading. The preview uses the same CMS artwork and text sources.

The owner does not need animation controls to maintain the content. The sequence, duration, easing and first-visit rule remain in `HeroIntro.tsx`, `useHeroEntrance.ts` and `Hero.module.css`. To review the full welcome again, use a fresh browser tab/session; an ordinary reload uses the short repeat entrance.

The new `settingsPageIntro` query uses the singleton ID and the existing 60-second revalidation policy (uncached in local development). The Studio schema and menu entry are maintained in this repository. No hosted Studio or production dataset has been changed.


Verification (4 November 2026): TypeScript, schema extraction, all 22 regression tests, the development slug audit and an isolated production build pass. Browser checks at 320, 390, 844 landscape, 1440 and 2560 px verify the complete lockup, viewport fit, absence of a visual tagline and the name/tagline heading in the accessibility tree during and after the welcome. Temporary fixtures cover disabled welcome, absent settings, a failed artwork request and a replacement artwork. Repeat visits, keyboard interruption, live reduced motion and no-JavaScript content pass without browser errors. Desktop/mobile screenshots reviewed. Evidence: `.sanity-backups/page-intro/`. The test fixture existed only in the temporary checkout and was removed with it. No manual VoiceOver/NVDA test was performed.
