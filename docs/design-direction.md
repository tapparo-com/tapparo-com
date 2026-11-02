# Tapparo — design and motion direction

Prepared 1 November 2026; updated 2 November 2026 after the supplied motion recording. **Approved for implementation on 2 November 2026.** Milestone 3 is committed as `d9d30c8` and `fb0c54c`. Integration into the public page-builder remains milestone 5; production is unchanged.

## Review the prototype

With the local development server running, open [the design preview](http://localhost:3000/design-preview). The route is available only when `NEXT_PUBLIC_SANITY_DATASET=development`, carries `noindex, nofollow`, and is excluded from the sitemap. It does not replace the homepage.

The preview contains only the responsive hero, navigation, and motion samples. About is a separate section and is outside this milestone. Open **Designprobe · Einstellungen und Statusbeispiel** below the hero to review open/closed states and reduced motion. **Erstbesuch ansehen** replays the dedicated welcome; **Kurzen Einstieg ansehen** replays the ordinary page entrance. A separate button replays the page-transition sample. These review settings are outside the proposed product interface. Edit ticker phrases in the development Studio under **Pages → Home → Hero → Ticker phrases**. Carousel timing is fixed at the user's requested 100 ms crossfade every 2.5 seconds.

The status is a **demonstration, not a live opening-hours calculation**, and the image sequence is still a preview. The ticker now reads `sectionHero.tickerPhrases`, an ordered string array in the development dataset. The existing six preview phrases were added to that field on the development homepage; no existing content or drafts were replaced. Production remains unchanged. Structured hours and the remaining CMS enhancements belong to milestones 4–5.

## References and interpretation

- [Desktop Figma sketch — 2576:9397](https://www.figma.com/design/3q59vsOlsZk1A5Lu7HES4c/tapparo?node-id=2576-9397)
- [Mobile Figma sketch — 2576:9370](https://www.figma.com/design/3q59vsOlsZk1A5Lu7HES4c/tapparo?node-id=2576-9370)
- [Villas Tamarindo](https://villas-tamarindo.com/)

The reference's desktop hero places photography on the left, navigation high on the right, and large branding below. Mobile moves branding above the photograph. Its menu uses a mask reveal and staggered links; its source coordinates scroll animation and page changes with GSAP/ScrollTrigger, Lenis, and Swup, and records the first entrance in session storage. These observations inform the choreography; the implementation stays with Next.js and the existing Motion library.

| Reference treatment | Tapparo treatment to review |
| --- | --- |
| Asymmetric hero and oversized branding | Preserve the Figma arrangement, including the quiet space to the right of the image. |
| Editorial introduction | Later: the full existing About copy, image, and link in its own section. It is not part of the hero or this preview. |
| Large villa panels | Later: a small number of story highlights, rather than a pinned panel for every story. |
| Layered experiences imagery | Later: galleries and mood sections, with ordinary mobile scrolling. |
| Large statements | Later: the existing “no rules. just taste.” section. |
| Services and quotations | Later: “Das Produkt” and the founders' quote. |

Use native scrolling. Long loading screens, scroll locking during page entry, and extended pinned sequences would delay restaurant visitors reaching the menu, address, and ordering link. No new animation library is needed for the proposed direction.

## Layout and artwork

Keep `#F5F4F2`, `#181818`, and `#E84F2F`. The preview uses the project's loaded Instrument Sans and Space Grotesk fonts; the logo and ordering lettering remain SVG artwork. One shared status component renders both the hero and menu: green `#5ACF00` when open, muted dark grey red `#6B4443` when closed, always accompanied by text.

The shared `--content-max-width: 2100px` token bounds the hero, menu content, and review area. The hero is anchored to the left, including on ultrawide screens, so the image has zero left inset as intentionally sketched. A persistent 1 px brand-orange frame follows all four viewport edges, independent of the content cap, and remains visible over the open menu. Subsequent sections will reuse the page-wide content limit; existing public sections are left for their own redesign milestones. The reference's desktop photograph measures roughly 57% of its layout width. Tapparo uses that proportion within the shared cap and a separate 1200 px image maximum. The photograph's height is the remaining viewport space after reserving branding, ordering, status, and ticker rows; there is no minimum hero height that pushes the CTA below the fold.

| Viewport | Proposed behavior |
| --- | --- |
| Desktop, 1024 px and wider | A capped composition anchored to the left edge; status/address upper right; logo and ordering artwork below; ticker at the bottom. Hero height follows `100dvh`, with `100svh` fallback. |
| Short desktop | Branding scales with viewport height; the image gives up height first. Ordering and status remain visible above the fold. |
| Tablet, 768–1023 px | Logo/navigation, flexible-height photograph, ordering artwork, status/address, then ticker at the bottom. Artwork has width/height caps; the image has no fixed aspect ratio. |
| Mobile, below 768 px | The ticker moves from the top to the bottom as requested on 2 November. Logo/menu and the remaining rows move up by the former 32 px ticker height. Reserve text and SVG height first, then let the photograph fill the remaining space. Address wraps if needed. |
| Short landscape mobile, 640–1023 px wide and at most 500 px high | Use a compact two-column arrangement so the logo, photo, ordering, status, and ticker all remain within the viewport. |

The carousel and ticker have no visible controls, counters, or swipe interaction. Both autoplay unless motion is reduced; hover does not stop playback. The logo, ordering link, address, and status remain stable during image changes. The ordering link uses the original lettering SVG as a mask, changing only its color to brand orange on hover/focus, with no translation or scaling.

Navigation uses one persistent 44 px toggle at exactly the same coordinates in both states. Its original three handdrawn strokes animate into a cross: the outer strokes translate and rotate while the middle stroke fades. The menu has its own viewport grid using the hero's responsive rows, columns, and width cap. Ordering and status/address retain the relative arrangement in which visitors first saw them; they do not inherit the page's current scroll offset. At the top of the page their size and coordinates match the hero exactly. The small CMS logo remains visible, even when opening the menu after scrolling beyond the hero. Both layouts render the same ordering and status components with the same CMS data; the covered hero stays painted in its original position, but is inert and hidden from assistive technology while the menu is present. A single opaque panel mask clips the entire menu, including its own artwork, so the two compositions never overlap outside the revealed surface. Closing the menu preserves the page's underlying scroll position. Social links join Home/Menu/Stories with identical typography, spacing, hover, and entrance animation; their external destinations still open in a new tab. All links and the optional phone remain controlled by Navigation and Site Settings. Focus is contained within the menu and its persistent toggle, Escape closes it, covered hero/review content is inert, and focus returns to the toggle. Long navigation lists scroll within their allotted area without displacing ordering or status.

Ticker phrases are entered separately; the frontend automatically inserts `•` between them, with exactly 8 px on each side, including the loop seam. No separators are stored in the CMS. The renderer measures the phrase sequence and repeats it enough times to cover the widest layout without a blank gap. Empty lists hide the ticker. The schema rejects empty items and manually entered bullet separators. The local Studio field uses Sanity's [ordered string-array model](https://www.sanity.io/docs/studio/array-type).

Static artwork was downloaded from the supplied Figma frames into `public/design-preview/`. Source SVG files are unchanged; rendering preserves aspect ratios. The original menu paths are also inlined to animate the same strokes as requested. Identical exports were consolidated. The original photograph is retained once, with the mobile crop applied through layout; `next/image` supplies resized delivery images.

| Local asset | Figma source | Intrinsic dimensions |
| --- | --- | --- |
| `logo-desktop.svg` | `2576:9449` | 530.837 × 194.75 |
| `logo-mobile.svg` | Logo instance in `2576:9370` | 180 × 66 |
| `order-desktop.svg` | `2576:9399` | 831.836 × 120.127 |
| `order-mobile.svg` | `2576:9372` | 370.959 × 53.686 |
| `menu-desktop.svg` | `2576:9445`; identical mobile export | 32 × 32 |
| `status-desktop.svg` | `2576:9440`; identical mobile export | 12 × 12 |
| `address-desktop.svg` | `2576:9443`; identical mobile export | 32 × 32, displayed at 12 × 12 as sketched |
| `hero-desktop.png` | `2576:9398`; identical photo in `2576:9371` | 2731 × 4096 |

The preview sequence starts with the sketch's photograph, then uses the existing development hero image and first gallery image to make the cadence reviewable. This does not add gallery images to the owner's hero selection. The final carousel will use only the ordered `sectionHero.heroImages` selection.

## Video study — 2 November 2026

Reviewed the supplied [villas.mov](/Users/john/Downloads/villas.mov), a 7.915-second desktop recording, using 32 frames sampled every 250 ms. Times below are approximate positions in the recording.

| Observed motion | Applicability to Tapparo |
| --- | --- |
| 0.25–1.5 s: a narrow vertical strip opens horizontally into a tall photograph on the right. | First-visit photograph reveals left to right through a mask. Its final layout and the image itself stay intact. |
| 0.5–1.25 s: a quiet introductory line comes into focus; it holds, then blurs/fades around 3.25–4.25 s. | Use the existing Tapparo logo and CMS tagline, “Tagesbar & Focacceria,” with a brief focus/fade. Compress the hold to keep restaurant navigation available quickly. |
| 4.25–5.25 s: the photograph moves left and becomes the final hero image, with its crop adjusting as its height changes. | Use a temporary copy of the current hero photograph, animate its rectangle into the actual carousel slot, then hand over to the same image beneath it. On mobile it settles upward into the stacked layout. |
| About 4.75–5.5 s: oversized branding and the large statement rise through masks, slightly staggered. | Reveal the intact logo and ordering SVG through bottom masks, with a small vertical settle. Do not split or redraw their lettering. |
| About 5–5.75 s: smaller navigation/details and the decorative flower arrive after the main image movement. | Stagger status, address, menu icon, and finally the ticker. The flower has no matching Tapparo element, so its rotation is not transferred. |

The recording's useful pattern is a separate first-visit welcome followed by an image handoff and individually timed hero reveals. The prototype compresses this into 2.85 seconds. Repeat loads use a 1.15-second hero entrance without the welcome. The existing carousel transition, menu interaction, colors, typography, and CMS structure remain intact.

First-visit timeline: horizontal image reveal 0–1.05 s; logo/tagline focus and fade 0.15–1.65 s; image handoff 1.35–2.35 s; final logo reveal begins at 1.70 s, ordering at 1.82 s, status at 2.05 s, menu at 2.08 s, address at 2.13 s, and ticker at 2.20 s. Everything is settled before autoplay begins at 2.85 s. The shorter entrance uses the same stagger from time zero, a 950 ms image mask, and a subtle image settle.

## Proposed motion

| Interaction | Proposal | Reduced-motion behavior |
| --- | --- | --- |
| First visit | Dedicated image/logo/tagline welcome and image-to-hero handoff, followed by staggered masked artwork and detail reveals; 2.85 s, once per tab session. | Immediate content; no welcome or spatial entrance. |
| Repeat page load | Image opens horizontally; logo and ordering artwork rise through masks; status, address, menu, and ticker follow; 1.15 s. | Immediate content. |
| Carousel | **100 ms linear crossfade every 2.5 seconds**, measured from transition start to transition start, including the crossfade. Wait for the next responsive image to load. No visible controls or hover pause. | Static image, no autoplay. |
| Ticker | Continuous linear movement with a 38-second loop of the repeated CMS phrase sequence, without a pause button. Separators and 8 px spacing are automatic. | Static text; no repeated animated announcement to assistive technology. |
| Navigation | The whole opaque menu reveals over 450 ms. Its logo and ordering artwork rise through local masks over 500 ms, starting at 100 ms and 240 ms. On close, artwork leaves in 180 ms; the panel retracts over 400 ms after a 120 ms lead-in. Original icon strokes transform over 350 ms; links follow in 50 ms increments. | Immediate icon/menu changes, with keyboard behavior preserved. |
| Internal page change | Proposal: 300 ms accent cover, short covered interval, 300 ms reveal. The preview includes a visual replay; actual site navigation continues using the existing transition provider. | Direct navigation. |
| Ordering | Normal full navigation through `/order`; no page-transition cover or prefetch. | Identical behavior. |

Autoplay suspends while the hero or tab is not visible, during its entrance, while the menu covers it, and when motion is reduced. The visible image stays in place if the next image fails to load. The future production component still needs the full single-image/empty-image and navigation-recovery checks in milestone 5.

An early click/tap, scroll gesture, Tab, or Escape finishes the entrance immediately. Resizing or hiding the tab also settles it to avoid a stale image destination. There is no intro scroll lock. A slow/unavailable first photograph falls back to the short entrance after an 800 ms readiness limit. Without JavaScript the hero is visible; a 1.5-second bootstrap fallback also prevents a failed hydration from leaving content hidden. System reduced-motion changes are observed live and stop both the entrance and autoplay. Session storage is optional; blocked storage does not break the page. The welcome is marked decorative for assistive technology.

## Content and CMS boundaries

- About remains a separate existing section. It is not rendered or redesigned in this preview.
- Navigation labels/destinations, social links, optional phone, small menu logo, address, and map link are read from development. The ordering artwork uses the established `/order` route.
- Ticker is an additive `tickerPhrases` string-array field on the existing Hero section. The development Home document's hero (`_key: s1`) was seeded with the current phrases using revision guards. Before/after comparison confirmed only this field and Sanity revision metadata changed. A newly created draft was published only to development; there was no pre-existing homepage draft. Backups: `.sanity-backups/development-ticker-before.json` and `.sanity-backups/development-ticker-after.json`. Production seeding remains part of the approved final rollout.
- The original homepage and all story, menu, and legal templates retain their existing rendering.
- This review route is a composition prototype. Production work will carry the approved treatment into reusable section components and shared navigation, preserving the existing page-builder structure.
- Site Settings remains the source of brand/contact/hours data. The prototype uses the exact Figma logo asset for comparison; integration with the owner's brand fields is part of milestone 5.
- Live opening status requires structured hours, exceptions, and `Europe/Berlin` calculations. No attempt is made to infer a reliable live schedule from the current free-text rows.

## Decisions for review

1. Viewport-fitting hero, desktop image width, and the 2100 px content cap.
2. Final crops, artwork size, and spacing across desktop/tablet/mobile.
3. First-entry duration and once-per-session policy.
4. Stationary handdrawn menu toggle, menu composition, and proposed internal transition.

The user has specified the flush-left image, orange viewport frame, stable layout positions for ordering/status, independent logo and ordering entrances/exits, social links styled like main navigation, CMS ticker phrases with automatic 8 px bullet spacing, 100 ms crossfade, 2.5-second image cadence, no carousel/ticker controls, shared status colors, and orange-only ordering hover. These are requirements, not alternatives still to choose between.

Approval of this direction is still pending. No commit or rollout is authorized by preparing this prototype.

## Verification

Responsive Chrome checks cover 1920 × 1080, 390 × 844, 375 × 667, 320 × 568, 834 × 1112, 1366 × 650, 844 × 390, 2560 × 1440, and 3840 × 1080. At each size the hero fits the viewport, ordering/status remain above the fold, the content/image width limits hold, and there is no horizontal overflow. Menu checks cover identical toggle coordinates, CMS labels, logo loading, shared status, focus containment, Escape, and restoration of focus/scrolling.

Checks also verify the image at x=0, all four frame edges, matching hero/menu ordering and status coordinates at the page top, social-link typography, keyboard focus, automatic bullet spacing of exactly 8 px, and enough ticker repetition at the 2100 px cap. The original same-DOM-element criterion was superseded by the user’s scroll clarification: menu positions follow the original viewport composition, independently of the page underneath.

Normal-motion checks measured four 100 ms fades and transition intervals of approximately 2508 ms. Playback continues while hovered; reduced motion stops both carousel and ticker. The original menu paths animate, rapid reversal does not leave the page inert or scroll-locked, and ordering hover changes only color. `/order` still returns the expected 307. No runtime/hydration errors were observed. All 11 regression tests, TypeScript, the development slug audit, and an isolated production build using development data pass.

The video-based entrance was inspected at timed points on desktop and mobile. Browser checks cover first-session welcome, repeat-load short entrance, explicit replay, early Escape/Tab, resize recovery, slow-image fallback, live reduced-motion changes, and no-JavaScript rendering. Both mobile and desktop ticker bottoms align with the viewport bottom; the mobile logo/menu occupy the former ticker space. Existing nine-viewport and frame-by-frame menu continuity checks also pass.

Local evidence is stored in `.sanity-backups/hero-continuity-*.png`, `.sanity-backups/hero-continuity-verification.json`, `.sanity-backups/hero-motion-verification.json`, `.sanity-backups/hero-entrance-verification.json`, and `.sanity-backups/hero-entrance-recovery.json`. Reference contact sheets are in `.sanity-backups/villas-video/`; implementation frames are `.sanity-backups/entrance-*.png`. The source video and extracted frames are not website assets. Cross-browser/device release testing remains in milestone 8.

The menu scroll correction was checked at the top, 70 px down, and beyond the hero across all nine viewports (27 cases). A temporary browser-only spacer supplied the deeper scroll range in this hero-only preview. Menu logo, links, order, status, and toggle keep the same viewport geometry at every scroll depth; closing preserves scroll and restores focus. Normal-motion frame sampling at mobile, desktop, and ultrawide sizes confirms stable layout slots throughout opening and closing; the artwork inside those slots has its own entrance and exit. Open-menu resizing also retains a usable layout. Evidence: `.sanity-backups/menu-scroll-verification.json`.

The two 2 November recordings (`12.37.49.mov`, 7.31 s, and `12.38.08.mov`, 6.398 s) exposed a transition flaw: only the menu backdrop was masked, leaving the ordering artwork floating over the returning hero and then jumping back to its scrolled position. The menu now clips its opaque background and all children as one surface. Separate logo/ordering copies animate through local masks, while the hero stays painted underneath throughout. Six normal-motion checks cover top/scrolled opening and closing on mobile, desktop, and ultrawide. Frame sampling verifies artwork entrance/exit, stable layout slots, no menu artwork outside the panel, and no hero visibility/position swap. Rapid reversal, orange-only hover, reduced motion, keyboard behavior, and the nine-viewport scroll checks also pass. Evidence: `.sanity-backups/menu-artwork-verification.json` and `.sanity-backups/menu-recordings/fixed-*.png`.
