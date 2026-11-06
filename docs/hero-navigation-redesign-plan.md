# Hero and navigation — new composition plan

6 November 2026 · **Plan and follow-up refinements implemented; committed at the user’s explicit request. Fresh visual/motion verification and final design lock-in remain pending.**

The current iteration improved alignment but remained too close to the earlier composition. This proposal changes the structure: one full-height photograph, one compact information area, an independent header and a centered navigation overlay. The next checkpoint is visual design approval, before extensive testing.

## Saved starting point

The user requested committing the current work before preparing this plan:

- `64b8021` — shared hero/menu framing, paused menu photograph and unfilled ticker.
- `b523589` — shorter first-visit and return entrances.
- `d8104c4` — implementation, backup and verification records.

These commits preserve the previous iteration; they do not imply final visual approval. The earlier source/content backup at `backup/hero-menu-before-taste-2026-11-06` also remains available. Existing validation is recorded in [the previous review](hero-menu-taste-review.md#implementation--6-november-2026). No broad tests were rerun for this planning/commit step.

## Confirmed direction

- Keep the dedicated intro, its CMS-controlled iconmark/wordmark artwork, and the image entrance/carousel animation.
- Desktop carousel occupies a proportion of the viewport width and its full height.
- **User confirmed:** keep the photograph on the left, flush to the viewport edge.
- **Latest user confirmation:** restore a larger hero wordmark above the introduction in the cream area. The compact header logo fades in after scrolling past the hero, and whenever the menu is open. This supersedes the first pass's header-only branding.
- Header logo remains top-left and menu toggle top-right. Neither travels from the hero; opening the overlay preserves their header coordinates.
- Overlay content is centered.
- Replace the large ordering SVG with paired underlined actions: “speisekarte ansehen” and “jetzt bestellen”. The user explicitly removed their supporting descriptions. Destinations remain `/menu` and `/order` respectively.
- **User refinement:** prefer a continuous ticker, integrated into the hero. A rotating phrase remains an alternative if the visual review calls for it. Retain owner-controlled phrases and real HTML text.
- Keep the existing colors, fonts, orange viewport outline, section-based CMS architecture and all content below the hero.

## Proposed design

### 1. Desktop: full-height photograph and a clear information area

Start with **60% photograph / 40% cream**, spanning the viewport. The image touches the top, bottom and left edges, with no logo row or ticker band reducing its height. Retain the existing carousel images, crops, hotspots, image timing and 100ms crossfade. The intro hands its photograph into this new final frame; the image is not pinned during ordinary scrolling.

Vertically center a left-aligned information group within the cream area. Its text has a readable maximum width of 440px; the ticker spans the entire cream column independently. Its sequence is:

1. The CMS wordmark, providing the main brand presence after the intro.
2. The existing CMS introduction, “Tagesbar & Focacceria in München.”
3. A continuous ticker extending to both edges of the cream column.
4. **speisekarte ansehen** and **jetzt bestellen**, side by side with the site's existing animated underline treatment, without supporting descriptions.
5. The live opening indicator and address, grouped directly beneath the actions.

The wordmark leads; the introduction uses a supporting 26–32px desktop size. Both actions have comparable visual weight and at least 44px targets. Speisekarte leads to `/menu`; ordering remains `/order` and its existing Degaso redirect. The actual opening-hours calculation and address/map source remain unchanged.

The hero background split is proportional to the viewport, including ultrawide displays; it is not constrained by the old photo-width cap. Text remains bounded within its column. Other page sections retain their centered 2100px content maximum. Start with 60/40 and adjust only if real image crops or text balance justify it during the visual pass.

### 2. Header: independent and stationary

Use a transparent fixed header. Position its compact logo at the top-left and the handdrawn menu toggle at the top-right, with 32px desktop and 20px mobile insets. These are viewport-edge controls, including on ultrawide displays. On Home the logo is hidden while the hero remains visible, then fades in after the hero leaves the viewport. Opening the overlay reveals it immediately at the same header position. Other pages show it from the start.

Keep the hero and header artwork separate; there is no hero-to-header logo travel or scroll-direction hiding. Opening and closing the overlay changes neither header control's size nor position; the same handdrawn strokes still animate into the close icon. Hidden header branding is excluded from keyboard interaction.

Visible header controls over photographs use white; on cream and in the menu they use dark ink. Reuse the existing awareness of image regions when scrolling, rather than adding pixel sampling. No header background panel, divider or bottom border.

### 3. Ticker: full available width

The user prefers a continuous ticker beneath the introduction, with orange type on cream at 24–30px and no fill. It spans the full cream column on desktop and full viewport on mobile; text gutters do not constrain it. Keep the existing CMS phrase array, order and automatic bullet spacing. Its 24px/s motion supports the photograph.

Keep all phrases as real HTML with one accessible reading sequence; visual animation duplicates are hidden from assistive technology and do not announce every change. Reduced motion shows a static wrapping sequence. This preserves content without making an SEO ranking promise. There is no ticker inside the menu overlay.

### 4. Mobile: more image space and left-aligned information

The carousel starts at the top of the viewport. Remove the reserved cream header strip; the menu toggle sits over the photograph. Below it, the cream area contains the hero wordmark, introduction, ticker, paired actions and status. Text and actions share a left edge, with 20px minimum gutters and a readable maximum width. The ticker spans the viewport.

Aim to keep both actions and the opening status in the first viewport on ordinary portrait phones. Removing the header strip and action descriptions gives more space to the image despite restoring the wordmark. On unusually short screens, enlarged text or longer CMS content, allow natural scrolling rather than clipping or shrinking controls.

### 5. Overlay: centered navigation, unchanged header

Use a full-screen cream surface beneath the stationary header. Remove the desktop photograph and ticker from this state. Center the navigation group within the available area below the header; all its elements use a common center line.

- CMS page links, ordering and selected social links form one large, centered vertical list with identical typography. Keep the current-page color and omit numbering/arrows.
- Insert **Jetzt bestellen** immediately after the link to Home. It uses the same treatment as the other links, without underline or description, and leads to `/order`. If Home is absent, it appears first. The local Studio explanation under Navigation → Header Navigation → Pages documents this fixed insertion; a larger CMS refactor remains out of scope.
- Selected social links from Site Settings follow the pages at the same size and weight. Optional phone, live status and address follow as a smaller visiting-information group.
- Long lists and short viewports scroll within the space below the header; controls remain visible and content is never clipped without a way to reach it.

Only the header controls retain their positions between the hero and overlay. Order/status are deliberately recomposed into the centered menu group, superseding the earlier requirement to preserve their hero coordinates. Animate the overlay surface and its link group with restraint; the logo does not fly to another location. Preserve focus containment, Escape, underlying scroll restoration and route transitions.

## Work sequence and approval gates

1. **Plan approved.** The user confirmed the overall plan, emphasizing that menu browsing and external ordering must be clearly differentiated and that a continuous ticker is preferred.
2. **Build a focused visual pass.** Implement the new desktop/mobile composition and centered overlay against development, reusing the existing intro, image motion, animated links and CMS values. Keep the rest of Home unchanged. Update the shared design preview where necessary.
3. **Review the design together.** Present hero and menu at representative phone, desktop and ultrawide sizes, plus a short motion preview. Do only basic compile/runtime, overflow and obvious interaction checks at this stage. Tune image balance, message scale, phrase motion and spacing based on feedback. Pause for design lock-in before the extensive verification phase.
4. **Harden the approved result.** Resolve responsive edge cases, image contrast/failure states, variable CMS labels/phrases, keyboard/reduced-motion behavior and any necessary component cleanup. Preserve the simple owner workflow; no new schema fields are currently needed.
5. **Run targeted verification and document it.** After visual lock-in, run the appropriate build/type checks and browser coverage for menu anchors, scrolling/resizing, focus/Escape, routes, real CMS content and motion. Update implementation/release notes. Commit subsequent implementation only when the user explicitly requests it.

## Design acceptance criteria

- Desktop photograph fills the viewport height, stays flush-left and provides the dominant visual.
- The hero has its own wordmark; compact header branding appears after the hero or while the menu is open, with no travel animation.
- Header logo and toggle retain their coordinates and sizes when the menu opens, including after scrolling.
- Visitors can see and distinguish menu browsing from ordering at a glance.
- Intro/carousel motion is retained; the unfilled ticker spans the entire available cream width.
- Mobile uses consistent alignment and readable controls; the main actions and opening status are prioritized within the first viewport.
- The overlay reads as one centered navigation group, visibly distinct from the hero composition.
- All existing CMS content and destinations survive. Implementation uses development only; production release remains user-owned.

## Progress

- [x] Commit the previous iteration in coherent groups.
- [x] Confirm image side and, after the first review, separate hero branding/conditional header logo.
- [x] Save this plan for review.
- [x] User approves the plan, with ordering/menu distinction and ticker preference recorded.
- [x] Build the focused visual pass and capture representative views.
- [x] Review the first visual pass and confirm the follow-up direction.
- [ ] Review the refined visual result with the user.
- [ ] User locks in the design.
- [ ] Complete targeted verification and update the implementation record.
- [x] User explicitly requests implementation commits; saved in the [commit checkpoint](release-review.md#design-refinement-commit-checkpoint--6-november-2026).

## First visual pass — 6 November 2026 (superseded by the refinement below)

Implemented locally against development, uncommitted:

- Full-height 60/40 desktop split; full-width mobile photograph beneath the compact header.
- One persistent header logo and toggle. Removed the hero logo travel, scroll-direction hiding, duplicate hero wordmark and menu photograph.
- Centered cream overlay with primary page links, a distinct external ordering action, quieter social links and visiting information. Header controls use the same elements in both states.
- Paired animated links in the hero: the existing default menu label becomes “speisekarte ansehen” while a custom CMS label remains usable; “online bestellen” retains `/order`. Visible, programmatically associated notes distinguish “Hier auf der Website” from “Extern über Degaso”.
- Continuous 24px/s ticker within the text area, with existing CMS phrases and bullet spacing. Reduced motion uses a static wrapping sequence. No rotating-phrase alternative was needed for this first pass.
- Existing intro/artwork and carousel timing retained; responsive image delivery and the intro's target rectangle now follow the full-height frame. The shared isolated design preview uses the same header, actions and menu content.

Basic review only: TypeScript and diff checks pass. Chromium captures at 390×844, 1440×900 and 2560×1440 show no horizontal overflow, no recorded runtime errors, matching header-control rectangles in both menu states, and working open/close/Escape. The first capture occurred during entrance motion and was replaced with settled captures. Full build, regression suite, browser/device matrix, CMS variation/failure coverage and a new scanner audit are deliberately deferred until visual approval.

Screenshots, initial geometry and desktop/mobile motion clips are in `.sanity-backups/hero-navigation-visual-2026-11-06/`. These are local development captures; the Next.js development indicator is not part of the production design. The existing development server remains available at `http://localhost:3000`. No CMS content/schema mutations, dependencies, emails, commits, push or deployment in this visual pass.


## Follow-up visual refinement — 6 November 2026

Implemented the user's feedback and both explicit clarifications, still uncommitted:

- Restored the CMS hero wordmark above the introduction. The hero information is left-aligned; the overlay remains centered. The compact header logo fades in after the hero has scrolled out, and while the menu is open. It does not travel from the hero artwork.
- Changed ordering to “jetzt bestellen” and removed both hero action descriptions. The existing animated underlines and distinct `/menu` / `/order` destinations remain.
- Expanded the unfilled ticker to the full cream column on desktop and the full available viewport width on mobile, independently of text gutters.
- Removed the mobile header strip and tightened the information group. At 390×844 the photograph increases from approximately 436px to 513px high, with both actions and the status still above the fold.
- Combined page, ordering and selected social links into one centered menu list, using identical type size/weight. Ordering follows the destination `/`, independent of its CMS label; if Home is absent it appears first. The no-JavaScript navigation uses the same ordering.
- Added owner-facing explanations to the local Header Navigation schema's Pages and Social Links descriptions. The CMS still controls selected pages, social references, labels, order, contact information and brand assets. No dataset edits or schema deployment occurred.
- Updated the shared design preview to use the same branding and header behavior.

Focused review: TypeScript and diff checks pass. Chromium captures at 390×844, 1440×900 and 2560×1440 show the full-width ticker, taller mobile photograph, equal menu typography, unchanged header coordinates when opening, header branding appearing after the hero, and no recorded runtime errors or horizontal overflow. The first phone screenshot caught the existing 100ms crossfade and was replaced with a settled frame. Evidence is under `.sanity-backups/hero-navigation-refinement-2026-11-06/`.

**Open follow-up:** the user reports a brief carousel flash and repeated entrance when the intro completes or a transition returns to Home. This pass does not change the entrance lifecycle or claim that defect is fixed. Investigate it after the hero design is locked in, before release. Full build/regression/browser-matrix testing likewise remains deferred until design approval. No commits, push, deployment, email or CMS document mutations in this refinement.

## Ticker placement and desktop spacing — 6 November 2026

Resumed after the previous session exhausted its context window before addressing the user's final comments. The user clarified that the ticker concern is **placement and spacing**, not its text size or moving-text treatment.

- Desktop wordmark, introduction, actions and visiting information now sit 32px from the photograph, retaining their 440px maximum width. The gap no longer grows on ultrawide screens. Mobile retains a 20px text inset.
- The ticker now follows the complete information group in its own full-width row at the bottom of the cream area, instead of interrupting the introduction and actions. Desktop uses at least 40px separation; mobile uses 20px and compact bottom padding to preserve image space. Short desktop viewports use 24px separation.
- CMS phrases, orange type, existing font sizes, 24px/s motion and reduced-motion behavior remain intact. The isolated design preview uses the same structure.

Validation: TypeScript (`tsc --noEmit --incremental false`) and diff checks pass. Home returns HTTP 200, and its rendered HTML confirms that the ticker is a sibling of the main copy group. Browser automation failed repeatedly and timed out, so this pass has **not** received a fresh desktop/mobile screenshot or motion review. Earlier captures do not validate this spacing change. Visual review, the deferred entrance flash, broad verification and commits remain pending. No CMS data or production changes.

## Approved entrance follow-up — 6 November 2026

The user subsequently approved addressing the entrance flash along with metadata/footer typography and viewport-wide section borders. The implementation and current verification limits are recorded in the [release review](release-review.md#typography-home-entrance-and-section-border-fixes--6-november-2026). This supersedes the earlier deferral: the code fixes and lifecycle regression checks are complete, while actual browser motion/visual verification remains pending. The user later explicitly requested implementation commits, recorded in the [commit checkpoint](release-review.md#design-refinement-commit-checkpoint--6-november-2026). Production release remains user-owned and unapproved.
