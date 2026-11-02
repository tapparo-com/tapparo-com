# Hero and navigation integration

Milestone 5, implemented against development on 2 November 2026. Approved and committed on 2 November as `a7bc4bc` (motion) and `620a611` (hero/navigation). No CMS documents, production data, deployment, or remote Git branch were changed in this milestone.

## Review

Open [the local homepage](http://localhost:3000/). The approved hero now renders through the existing CMS page builder. The separate [design preview](http://localhost:3000/design-preview) remains available for comparing the approved demonstration sequence and replaying motion.

The development hero currently selects **one photograph**, so the homepage correctly shows a static image. Add or reorder images under **Pages → Home → Hero → Carousel images** to use the carousel. The site never adds the sketch or gallery photographs to that selection automatically. No content was seeded for this milestone.

About, address, gallery, stories, founders' quote, and all other sections remain separate and retain their content. Sections now render in the exact CMS order; the renderer no longer moves the hero to the beginning automatically. Their visual redesign remains milestone 6. Stories, menu, and imprint content/templates remain for milestone 7.

## Implementation

- `components/hero/SiteShell.tsx` provides shared brand/contact/navigation data, one live opening status, the viewport frame, the handdrawn menu toggle, and the menu. It wraps server-rendered page content without converting those pages into client-only rendering.
- `components/sections/SectionHero.tsx` renders the selected images, ticker, brand, status/address, and `/order` artwork as an ordinary section. There are no review controls on the real pages.
- `HeroParts.tsx`, `HeroIntro.tsx`, `useHeroEntrance.ts`, and `Hero.module.css` are shared with the approved preview. The site's logo comes from Site Settings; ordering artwork remains the original supplied SVG, with a color-only orange hover.
- The independent menu uses the same viewport grid as the hero. Opening after scrolling preserves the initial viewport arrangement of logo, status, ordering, and toggle; closing preserves scroll. The complete opaque panel is masked together, with separate masked entrances/exits for its logo and ordering SVG. Underlying page content is inert and hidden from assistive technology while covered.
- Pages without a leading hero receive a compact brand header with the same shared menu. The viewport outline and 2100 px cap apply throughout the site. Existing sections can retain narrower content widths.
- `lib/hero-images.ts` applies the Sanity crop and derives an object position that keeps the cropped hotspot in view as the hero rectangle changes. The viewport controls image height; the photograph remains flush left and capped at 1200 px on desktop.
- Playback uses 100 ms linear fades on a 2500 ms start-to-start schedule after images are ready. The next responsive image is preloaded. Slow or failed next images leave the last good image visible. One image is static; an empty or failed first image has a branded fallback. No carousel or ticker controls are added.
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
