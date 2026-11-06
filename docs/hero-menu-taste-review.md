# Hero and menu overlay: Taste review

Initial review: 5 November 2026. Implementation: 6 November 2026, now committed as a preserved iteration at the user’s request (`64b8021`, `b523589`). A more substantial design direction is being planned for separate approval. The original findings below are retained; see the [implementation record](#implementation--6-november-2026) for the current result.

Used the requested `design-taste-frontend` skill from the cached [Taste Skill source](https://github.com/Leonxlnx/taste-skill/blob/12af471f627f866411b4bd785b19646d3672784c/skills/taste-skill/SKILL.md), including its screenshot critique and browser inspector. Existing brand, content, Figma intent and explicit user requirements take precedence over generic skill preferences.

## Verdict

The assets and food photography work. The composition needs another pass: too many elements have independent positions, and the overlay loses the photograph that balances the hero. Correct viewport sizing has not produced a sufficiently coherent layout.

The earlier descriptive copy improves orientation, but its detached position in the middle of the desktop right column creates another isolated element. It should join a purposeful group.

## ROUND 1

Seen in one second: a strong food photograph; when the menu opens, a large right-aligned list surrounded by empty cream space.

Idea (one sentence): Tapparo's food, hand-drawn identity and practical visiting/ordering information form one restaurant front window.

Live thing: the CMS-selected food carousel, opening status and working navigation/order links.

Layout words by section: hero=asymmetric photograph / overlay=right-aligned index.

Scores: design 6 · usability 7 · creativity 7 · content 8 → overall 6.0 after the inspector cap (6.7 before cap). Subjective section critique, not an external award rating.

Caps applied: the full-page inspector still reports failures, so the skill caps the overall score at 6.0. The three-line desktop descriptor and weak grouping also limit the composition. The intentional flush-left photo and orange viewport outline are brand requirements, not defects to remove. Video and four simultaneous photographs are not requirements for this section review.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. **Desktop has several competing anchors.** In the [1440px hero](../.sanity-backups/hero-overlay-review-2026-11-05/hero-1440.png), the status begins at y=19 while the order artwork begins around y=770. The descriptor occupies the middle of the right column; the wordmark is below the photograph. In the [open menu](../.sanity-backups/hero-overlay-review-2026-11-05/overlay-1440.png), the wordmark switches from bottom-left to top-left, while the photograph disappears entirely. At [2560px](../.sanity-backups/hero-overlay-review-2026-11-05/overlay-2560.png), the menu toggle also sits roughly 222px to the right of the navigation/action edge. **Fix:** use one shared content frame and a compact ordering/visiting group; keep a paused photograph in the desktop menu to balance the navigation.

2. **The ticker reads as a utility strip.** Its 16px black type and 32px orange band add a dense, small-scale texture below the much larger photograph and artwork. This is particularly apparent in the [mobile hero](../.sanity-backups/hero-overlay-review-2026-11-05/hero-390.png). **Fix:** replace the fill with generous orange typography directly on the cream background; slow its physical movement as the type grows.

3. **Mobile has multiple competing gutters and logo sizes.** At 390px, the hero logo begins at x=10, the menu logo at x=24, status at x=12, and address at x=32. The photo's right inset is 20px, the order button's 12px, and navigation links' 24px. The logo changes from approximately 163px to 132px wide on opening. The header is 118px tall, leaving excessive room around a comparatively small mark. Compare [closed](../.sanity-backups/hero-overlay-review-2026-11-05/hero-390.png) and [open](../.sanity-backups/hero-overlay-review-2026-11-05/overlay-390.png). **Fix:** establish one 20px content gutter, a compact header, and matching hero/menu anchor positions and optical edges.

Measurements are CSS pixels. Chromium reserves a 15px scrollbar gutter here; the white strip outside the outlined content canvas is not being counted as a new application overflow bug.

## Recommended direction

### Desktop: photograph plus one coherent information column

- Retain the wide, flush-left photograph and the approximately 2100px centered content frame. Align the menu toggle to that frame's right edge on wide screens. The photograph, viewport outline and ticker may extend beyond the content frame.
- Keep the wordmark attached to the lower-left brand area. Place “jetzt bestellen”, status and address together at the lower right, sharing one right edge. Use roughly 16px between the artwork and visiting information; align the wordmark optically with the ordering artwork.
- Move the short description and “speisekarte” link into the same right-column composition, immediately above the ordering group with a deliberate 24–32px gap. Give the descriptor enough width for two lines where practical. Preserve its CMS content.
- Keep the reduced artwork scale already requested. Recompose the surrounding space instead of enlarging the marks to recover the original reference's balance.
- When opening the menu on Home, retain the current photograph as a paused visual and replace the descriptive content with navigation. Keep the right-aligned links, including socials, and group them above the order/status block. Size the links to fit this column rather than letting them spread across the photograph's area.
- The desktop menu wordmark can become smaller around the same lower-left anchor, instead of changing corners. This deliberately revisits the existing top-left menu-logo placement. The separate scroll-to-sticky-header movement can remain.
- On secondary pages, or when Home is scrolled beyond the hero, use an existing CMS-selected hero image for the menu's left visual and a viewport-relative composition. Avoid dependence on an off-screen hero element's rectangle.

This is informed by the actual [Villas Tamarindo menu](https://villas-tamarindo.com/): its desktop overlay has a substantial photograph beside the links. Its hero also balances the empty right area with very large bottom typography. Tapparo has retained that spacing while reducing its artwork; it now needs a different balance. See the captured [reference hero](../.sanity-backups/hero-overlay-review-2026-11-05/reference-hero-1440.png) and [reference menu](../.sanity-backups/hero-overlay-review-2026-11-05/reference-overlay-1440.png).

### Mobile: keep the surrounding frame, exchange the middle

- Use a compact header, initially targeting about 80–88px, with the wordmark at the same size and position in both states. Align the toggle to the same right guide as the other actions; keep its 44px target.
- Keep the photo flush-left with a 20px right inset. This is an intentional exception to the content gutter.
- Align the visible edges of the menu links, ordering artwork and visiting information to the same right guide. Group the status with the order button, allowing the address to wrap naturally on narrow screens. The dot belongs immediately beside its status text, rather than determining a separate left column.
- Let the navigation replace the photo's region. Anchor the list in relation to the action group with a deliberate gap, rather than independently centering it in a tall box.
- Reserve real space for the order/status group and ticker first; let the photograph use the remaining height. Keep the complete primary action and status above the fold.
- Preserve an internally scrollable navigation area for short landscape screens and long CMS navigation lists. Do not shrink links below comfortable targets or clip the last social link without a way to reach it.

### Ticker: orange type, cream ground

Recommended starting point: orange text on the existing cream background, about 40–48px on desktop and 24–28px on mobile. Allow roughly 56–64px and 40–48px respectively for the row, then validate with real content and short screens.

Keep the CMS phrase array, automatic bullets and 8px space on each side of a bullet. Keep the ticker full-width at the bottom. Aim initially for a calm 20–28 CSS pixels per second; retaining the current fixed 38-second loop after enlarging the type would make the physical speed increase with the longer track.

The current orange/cream pair has a calculated contrast ratio of about 3.42:1, so this recommendation is for large display text. Keep small functional text in the existing dark ink.

The 1.2-second carousel already provides strong movement. Avoid adding another fast animation or changing that user-approved image timing as part of this review. With reduced motion, show a readable static phrase treatment. If the larger marquee still competes with the food in a prototype, the quieter fallback is a static typographic line using the same CMS phrases.

## Suggested implementation order

1. Establish the shared frame, desktop information grouping and mobile gutters in still layouts.
2. Make the desktop menu retain a photograph; make mobile exchange only its middle region. Recheck menu/logo/action anchors, including openings after partial scrolling and from other routes.
3. Replace the filled ticker, size its reserved row and tune its speed. Verify the complete hero still fits short viewports.
4. Tune the existing intro and menu animations around those settled positions. Keep the CMS intro artwork and accessible restaurant identity. Do not use extra motion to disguise an unresolved layout.
5. Review normal and reduced motion, keyboard focus, image failures, long labels, browser chrome changes, resizing with the menu open, and scroll restoration on close. Compare mobile, tablet, ordinary desktop and ultrawide screenshots before committing.

Existing routes, CMS control, opening-hours logic, brand assets, the orange viewport outline, `/order`, no carousel controls, and color-only order hover remain requirements.

## Evidence and limits

- Reviewed an isolated optimized build using the development dataset. No source implementation, CMS content, commits, deployment or production changes were made for this review.
- Captured both states at 320×568, 390×844, 768×1024, 844×390, 1440×900, 1920×1080 and 2560×1440. The stable comparison captures use reduced motion so entrance animations do not obscure layout measurements. They show no horizontal document overflow and keep order/status within the viewport. This is visual-review evidence, not a complete interaction regression suite.
- Captured the reference hero and menu on desktop and mobile. No new stock imagery is needed for the proposed direction.
- The skill's first multi-width inspector run timed out during screenshot capture. Its desktop retry completed, reporting five failures and four warnings, with no console errors. [Inspector report](../.sanity-backups/hero-overlay-review-2026-11-05/inspector-retry/report.json).
- Relevant inspector findings include the three-line descriptor and delayed first-visit identity. The inspector's fold image caught the entrance mid-animation; it must not be mistaken for the settled design. The intro currently hands the photo over at 2.35 seconds, with some detail entrances completing around 3 seconds according to the animation settings. Shortening that wait is a secondary recommendation once the composition is resolved; keep the requested dedicated intro.
- The “no visible h1” finding does not mean the page lacks a semantic heading: it has a persistent screen-reader heading with the restaurant name and tagline. The visible identity is SVG artwork. Preserve that accessibility behavior.
- Other inspector findings concern whole-page paragraph sizing, a gradient text treatment and dividers outside this review's two surfaces. They are recorded, not treated as instructions to alter unrelated approved sections. The missing-video warning is expected because preparation footage has been deferred.
- Scoped source lint reports three failures and three warnings. The flagged divider belongs to a preview review panel; the shadows provide floating-header contrast; the viewport outline is intentional. These findings do not explain the hero/menu spacing problem. [Lint report](../.sanity-backups/hero-overlay-review-2026-11-05/source-lint.json).

The original review artifacts and raw measurements are local, ignored files under `.sanity-backups/hero-overlay-review-2026-11-05/`.

## Implementation — 6 November 2026

The user authorized committing the previous work, backing up the hero/menu, then implementing this review. Prior work is committed in `b891ad1`, `f2046b9`, `1bac920`, `ae14093`, `714d982` and `36c8955`. The implementation below was subsequently committed at the user’s request as `64b8021` (layout/menu/ticker) and `b523589` (intro timing).

### Backup

- Annotated tag: `backup/hero-menu-before-taste-2026-11-06`, pointing to `36c895597552f25db4178a96702e0ab6614f20e3`.
- Local folder: `.sanity-backups/hero-menu-before-taste-2026-11-06/`; [manifest](../.sanity-backups/hero-menu-before-taste-2026-11-06/manifest.json) includes file hashes.
- Contains a complete tracked-source archive, the ten relevant raw development documents and baseline hero/menu screenshots at 390, 1440 and 2560px. Asset references are preserved; asset binaries are not included. No assets or CMS documents were modified in this pass.
- The tag is the source recovery point. Do not reset the working branch or restore CMS records wholesale: compare/recover the relevant files or fields deliberately if needed.

### Result

Desktop now has one shared 65/35 frame. The descriptor and menu link sit directly above the ordering/status/address group on the right. The wordmark stays at the lower-left anchor. The toggle follows the same centered content frame on large screens. The image remains flush-left, including beyond 2100px.

Opening the menu keeps the current photograph paused and exchanges the descriptor for right-aligned navigation. On secondary pages it reuses the first image from Home's existing CMS carousel; no separate image collection needs maintaining. The menu's smaller desktop wordmark shares the hero's lower-left anchor. The artwork and links still enter individually. A missing or failed photograph shows the brand fallback and leaves all actions available.

Mobile uses an 84px header and 20px content gutters. Hero and menu wordmarks now have identical size and placement. The menu replaces the photo region, with links anchored above the order/status block; those actions retain identical viewport-relative rectangles. Scrolling the page before opening does not shift the menu's anchors or hide the logo. Long lists scroll within a bounded region; the close button remains clear even in short landscape.

The full-width ticker is orange display text directly on cream, 40–48px on desktop and 26px on mobile, moving at 24 CSS pixels per second. CMS phrase order and automatic 8px bullet spacing remain. Reduced motion stops playback and exposes one static phrase sequence with manual horizontal scrolling and keyboard access. The menu ticker is paused. The carousel retains its CMS timing, 1.2-second default and 100ms crossfade.

The dedicated CMS-branded intro is retained: the photo handoff completes at 1.35 seconds and the entrance lifecycle at about 1.8 seconds, with a 0.95-second return entrance. These are animation timings, not network-loading guarantees. The iconmark/wordmark artwork, persistent restaurant-name/tagline heading and interruption/failure behavior remain.

| Measurement | Before | After |
| --- | --- | --- |
| Desktop status/order relationship, 1440px | Status near y=19; order near y=770 | Order y≈688; status follows with a 16px gap |
| Desktop menu photograph | Removed | Same image and frame as hero, paused |
| Desktop wordmark on menu opening | Changes corners | Same lower-left anchor; smaller menu size |
| Mobile wordmark x / width, 390px | Hero x=10 / ~163px; menu x=24 / ~132px | Both x=20 / ~168px |
| Mobile header | 118px | 84px |
| Mobile order/status right edge | Different insets | Both 20px from edge, identical in both states |
| Ticker | 16px black type on an orange band | 40–48px / 26px orange type, transparent background |
| First-visit photo handoff | 2.35 seconds | 1.35 seconds |

### ROUND 2

Seen in one second: a large focaccia photograph, with the restaurant identity and practical information forming a grounded composition; opening the menu preserves that balance.

Idea (one sentence): Tapparo's food, hand-drawn identity and practical visiting/ordering information form one restaurant front window.

Live thing: the CMS-selected food carousel, opening status and working navigation/order links.

Layout words by section: hero=photograph with grouped information / overlay=photograph with anchored navigation.

Scores: design 7.5 · usability 8 · creativity 7 · content 8 → overall 6.0 after the raw inspector cap (7.6 before cap). This is a subjective section critique, not an external award rating.

Caps applied: the full-page inspector still reports failures, so its strict overall cap remains 6.0. Brand-orange, the viewport outline, SVG identity, dedicated intro and flush-left image are explicit requirements. Existing content below these two surfaces is outside this pass.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. **The original competing desktop anchors:** compare the [new 1440px hero](../.sanity-backups/hero-menu-taste-2026-11-06/chromium-hero-1440.png) and [menu](../.sanity-backups/hero-menu-taste-2026-11-06/chromium-overlay-1440.png). Fixed with a shared frame, adjacent ordering/visiting information and retained photography. The descriptor now occupies two lines at this width.
2. **The original dense ticker band:** the [new mobile hero](../.sanity-backups/hero-menu-taste-2026-11-06/chromium-hero-390.png) uses larger unfilled type and measured slower movement. Whether the enlarged moving type feels quiet enough beside the deliberately fast carousel remains a visual preference for the owner to review; a static line is still the documented fallback.
3. **The original mobile alignment changes:** the [new mobile menu](../.sanity-backups/hero-menu-taste-2026-11-06/chromium-overlay-390.png) uses the same logo/action/status anchors. Short landscape necessarily uses internal navigation scrolling; the [844px menu](../.sanity-backups/hero-menu-taste-2026-11-06/webkit-overlay-844.png) keeps that scroll region below the toggle. Physical-device and spoken screen-reader review remain outstanding release checks.

### Verification and inspector interpretation

- Forty existing regression tests, TypeScript, diff checks and an isolated optimized development build pass. The user's existing development server was preserved.
- Thirty-two primary browser checks pass in Chromium and WebKit: both states at 320×568, 390×844, 768×1024, 844×390, 1024×768, 1440×900, 1920×1080, 2560×1440 and 5092×1300; partial/deep scrolling, resizing while open, scroll restoration, keyboard focus/Escape, menu access from Stories/Speisekarte/Impressum/Kontakt, normal motion, pause-in-menu, reduced-motion switching and stationary orange hover.
- Twelve edge checks pass across both browsers: long labels/eight extra links at three widths, keyboard access to the static ticker after menu closure, no-JavaScript navigation/content, menu image failure and internal route changes. WebKit needed explicit horizontal arrow handling after the menu releases the body scroll lock. Short-landscape links now scroll beneath a fixed top clearance rather than beneath the close control.
- The existing `/design-preview` also compiles and passes mobile/desktop action-position and overflow smoke checks after adapting its shared layout and updating its displayed timing values.
- The ten raw development documents in the backup match the final read-only query exactly. No schema/dependency/content changes, emails, push, deployment or production operations occurred.
- The full-page desktop Taste inspector completes with **seven FAIL and five WARN**, zero horizontal overflow and no broken images. The relevant original three-line hero descriptor is fixed. Its new `eyebrow` and `hero-words` findings mistake the address and repeated ticker for a heading hierarchy; they are not instructions to delete the address or CMS phrases. `late-title`/`no-title` concern the persistent visually hidden h1 and visible SVG identity; the dedicated intro is retained intentionally. `palette-terracotta`, `outlined-box` and `off-centre` conflict with explicit brand/layout requirements. Remaining long-heading, gradient, divider and size-count findings concern the rest of Home; missing footage remains deferred.
- Scoped source lint retains the same three failures/three warnings as the baseline: the preview-panel divider, floating-header contrast shadows and explicit viewport/preview outlines. These are recorded in `source-lint.json`; no blanket suppressions or unrelated design changes were introduced.

Evidence: `.sanity-backups/hero-menu-taste-2026-11-06/`, including `verification.json`, `edge-checks.json`, `preservation.json`, `build-final.log`, screenshots/geometry and `inspector/report.json`. Generic scanner flags are recorded rather than hidden; they do not override the approved brand or expand this task into another whole-site redesign.

## Subsequent design decision — 6 November 2026

The user found this revision improved but too close to the prior composition. It is preserved in the commits above, not treated as final design approval. The next plan will retain the intro/carousel animation, use a full-height desktop image at the left, a separate top-left header logo and top-right toggle, centered overlay content and paired underlined ordering/menu actions. The user confirmed there should be no separate large hero wordmark after the intro. Planning only until explicit approval; design review precedes extensive testing.
