# Step 6 — homepage revision sub-project

Created: 2 November 2026
Last updated: 4 November 2026
Status: Locked in and committed on 4 November 2026. Editorial sections: `e9395f8`; hero/header/intro controls: `8c3c53a`; footer: `03930e7`. The user authorized milestone 7 next. The records below preserve the review history. Production remains unchanged.

## Working sequence

Work through the sections below with a focused visual review after each. Substep 6.7 was added for the closing quote. After initially skipping 6.6, the user replaced its current scope with a reusable two-image product section on 3 November. Scrollytelling remains a future enhancement and is no longer a dependency for homepage completion.

The approved hero, menu, colors, fonts, 2100 px content cap and section-based CMS composition remain the foundation. Preserve the full existing About/product copy, stories, founders' quote and image assets. Removal of the redundant address block is now explicitly authorized. Shared contact settings remain because the hero, menu and footer still use them.

| Substep | Scope | Status | Review result |
| --- | --- | --- | --- |
| 6.1 | Remove the standalone address section | Implemented and verified | Removal requested by user; uncommitted |
| 6.2 | Rebuild About as two images and text | Feedback implemented; user continued to 6.3 | Uncommitted |
| 6.3 | Recompose and animate the gallery | Implemented and verified; user continued to 6.4 | Uncommitted |
| 6.4 | Replace the flat brand banner | Implemented and verified; user continued to 6.5 | Uncommitted |
| 6.5 | Rebuild Stories as consistent showcase panels | Feedback implemented; user continued to 6.7 | Uncommitted |
| 6.6 | Product: two images and text | Implemented and verified; ready for review | Uncommitted; replaces the deferred scrollytelling scope |
| 6.7 | Recompose the closing founders’ quote | Implemented and verified; ready for review | Uncommitted |
| 6.8 | Wide-screen layout, sticky logo, link alignment and footer | Implemented and verified; ready for review | Uncommitted |

## Reference findings and design direction

The [Villas Tamarindo homepage](https://villas-tamarindo.com/) was rechecked on 2 November at 1440 × 1000. Its introduction pairs offset photographs with a broad paragraph below. The villa showcases repeat a consistent image/title/description/link structure. Later image compositions and oversized statements establish distinct changes in pace. These observations guide the proposals below; Tapparo retains its own identity and content.

The earlier pass spread similar text/image layouts throughout the page and gave Stories arbitrary offsets. The revision will give each section a distinct role, with consistent alignment and a clearer progression. Motion will reinforce that composition.

Local reference captures: `.sanity-backups/revision6-reference-*.png` and `revision6-reference-sections.json`. These are research artifacts, not website assets.

## 6.1 — Remove the standalone address section

- Back up the current development homepage and revision inventory, including existing drafts.
- Remove only `sections[_key=="83a69bd55c60"]` from homepage `f803c306-580e-4053-9b34-84d9cda1f91a` using a revision guard.
- Verify the new draft differs only by that removal before publishing it to development.
- Remove the uncommitted location component, dedicated CSS and `useContactAddress` schema/query/rendering branch introduced by the first pass. Ordinary quote sections, including the founders' quote, remain.
- Keep Site Settings → Contact and the existing address/map behavior in the hero, menu and footer.

Acceptance: About follows the hero directly, with no empty address spacing. The remaining seven sections retain their keys, content and order. Shared contact settings and every other document are unchanged. Check desktop/mobile rendering and TypeScript; record the revision audit.

Completed 2 November 2026 in development. The guarded draft comparison confirmed exactly one removed array item; the published homepage now has seven sections. All 156 other non-asset documents, all existing drafts and shared contact settings are unchanged. The unused location implementation and CMS toggle are removed. TypeScript, the slug audit and an isolated production build pass. Browser checks at 1440 × 1000 and 390 × 844 confirm the exact section order, zero layout gap between hero and About, no horizontal overflow or runtime errors, and retained address information in both hero and menu. Screenshots were reviewed. Evidence: `.sanity-backups/revision6-1-*`. No commit or production change was made. The user continued to 6.2 on 3 November 2026.

## 6.2 — About: two images, then editorial text

Replace the poster-and-copy columns with a paired-image opening followed by the complete About paragraph, reflecting the reference introduction. Use complementary image proportions and a controlled vertical offset; align the text on the same page grid. Keep the menu CTA and optional hours as a quiet supporting row.

- Add one optional secondary image to the existing SubHero section, keeping the original image field and all Portable Text intact. The owner selects, crops and replaces both images in the same section.
- Start the review using the existing menu artwork and a suitable existing restaurant photograph. Confirm the pairing during this substep; no asset is deleted or silently replaced. If the poster is moved, give it an explicit visible home elsewhere before removing its current placement.
- Reveal the two image masks in a short stagger, then introduce the text. Any image drift should be slight and confined to its frame.
- On mobile, retain both images in a deliberate stacked composition, followed by readable full-width text. Avoid shrinking the paragraph into narrow image columns.

Acceptance: exactly two owner-controlled images in the reviewed layout; full copy, menu link and optional hours preserved; a useful one-image fallback; clear desktop/mobile composition with reduced motion.

Implemented 3 November 2026. The image pair now precedes the complete paragraph: original menu artwork on the left with its natural proportions, and an existing service-at-the-bar photograph in a 4:3 frame on the right. The first image sits lower on desktop; mobile stacks both images with opposing alignment before the full-width text. The desktop paragraph uses a small first-line indent, followed by a supporting menu/hours row. Each image has a short mask reveal. The follow-up below replaces the original independent text/detail reveals with a coordinated sequence. Reduced-motion and no-JavaScript rendering retain the complete composition.

The owner edits **Pages → Home → SubHero → First image / Second image**, with crop/hotspot and alt text. `image` retains its original key and value; `secondaryImage` is the only added field. Only `sections[_key=="88ad61dd7dc5"].secondaryImage` was added to the development homepage, referencing existing asset `image-62a1833ae8efc4985de194f7dac1bffd43d41020-1067x1600-jpg` with descriptive alt text and a hotspot around the service interaction. Original copy, first image, label, button, hours toggle, section order and all other documents/drafts are unchanged.

The selected pair is ready for visual review and can be changed in the CMS. Both single-image cases, text-only and image-only content are supported. Long CTA labels wrap within the available width. No dependency was added. Validation passes: TypeScript, local schema extraction, development slug audit and an isolated production build. Browser checks cover 320, 390, 768, 1024, 1440, 2100 and 3840 px, both selected images loading, complete text, both menu links, hours, image/text ordering, the 2100 px cap and no overflow. A fixture outside the repository checked first-only, second-only, no images, missing assets, short/long rich text, long CTA labels, absent button/hours and empty sections. Normal reveals, live reduced-motion changes and no-JavaScript rendering pass without browser errors. Desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-2-*`. Awaiting lock-in; 6.3 has not started.

### 3 November follow-up — About link and entrance

- Reviewed the supplied `Screen Recording 2026-11-03 at 09.34.49.mov` at 100 ms intervals. The 1.595-second clip shows a stationary label with a subtly moving hand-drawn underline.
- Changed the development About button label to **speisekarte**, keeping its `/menu` destination and CMS label/page controls. It now has a continuously varying SVG underline while visible, with brand-orange hover and visible keyboard focus. Reduced motion keeps the line static.
- Removed the visible About overline. The retained `label` field now names the section in Studio and for screen readers. The legacy button variant value is retained but its control is hidden because this section has one designed link treatment.
- Added a 900 ms upward/fade entrance for the complete rich text, then the button and opening hours with a 180 ms stagger. The supporting row additionally waits for viewport entry on short mobile screens. Keyboard focus reveals content immediately; no JavaScript and reduced motion show the complete static section.
- Verified desktop timing, underline movement, stationary hover geometry, short-screen gating, reload with a restored scroll position, keyboard use, live reduced motion and no JavaScript. The 320–3840 px content/layout fixtures, TypeScript, schema extraction and isolated production build pass. Screenshots were reviewed.

Only the About CTA label changed in this follow-up's CMS transaction; all other content, document revisions and existing drafts are preserved. Evidence: `.sanity-backups/about-motion/`. Changes remain uncommitted and production is unchanged. The user then continued to 6.3 on 3 November.

## 6.3 — Gallery: a composed image sequence

Replace the current loose stagger with one deliberate photographic scene: a dominant image, a supporting image and a small detail, using consistent alignments and overlap where space allows. Take the reference's layered experiences imagery as the starting point.

- Develop a desktop composition with a clear focal image and purposeful depth. Use masked entrances and gentle differential movement as images pass through the viewport.
- Keep ordinary page scrolling, with a short, lightweight photographic sequence.
- Preserve all three current photographs and their CMS order, with predictable handling of additional or fewer images.
- Keep the 256 × 192 px source as a small detail. Do not enlarge it into a feature image; a higher-resolution replacement can be chosen later without blocking the composition.
- On mobile, use a clear vertical progression with complete images and simple reveals; no inaccessible offscreen content or required drag gesture.

Acceptance: the gallery reads as a single composition, every selected image is accessible, source quality is respected, and motion does not interfere with reading or navigation.

Implemented 3 November 2026. The first photograph now leads the composition, the second overlaps its right edge, and the third forms a small detail at the lower edge. The three current images remain in their original CMS/DOM order: coffee machine, focaccia service, water service. Natural proportions and owner crops are retained. The 256 × 192 px source is capped at its native width (or less after cropping), rather than enlarged to match the other photographs.

Each image enters through a 900 ms mask with a short stagger. On desktop, the three layers move at different bounded speeds with ordinary page scrolling and reverse when scrolling back. There is no pinned interval or scroll interception. Mobile uses an ordered vertical composition with simple entrances and no scroll-linked translation. Reduced motion and no JavaScript show a static composition. Single images are centered, two images form a pair, more images form additional groups, and groups containing only small assets use a compact layout. Empty items are skipped, while optional caption text remains available.

No CMS data was changed. The owner still edits **Pages → Home → Gallery → Gallery Images** and drags to reorder; updated field help explains the composition. No animation controls or new dependency were added. `GalleryScene.tsx` uses the existing Motion library; implementation reference: [Motion useScroll](https://motion.dev/docs/react-use-scroll).

Validation passes: TypeScript, local schema extraction, development slug audit and an isolated production build. Browser checks cover 320, 390, 768, 1024, 1440, 2100 and 3840 px; correct image/alt order and decoding; desktop overlap; mobile separation; the 2100 px cap; no horizontal overflow; and native-width limits for the small image and a cropped variant. An isolated fixture covers one, two, four, five and seven images, all-small images, reordered images, missing assets/metadata, caption-only and empty content. Normal-motion checks confirm masked entry, differential translation and reversal, live reduced motion, desktop/mobile resize changes, no-JavaScript content and menu scroll restoration. Desktop/mobile screenshots were reviewed; no browser errors. Evidence: `.sanity-backups/revision6-3/`.

Ready for visual review; uncommitted. The temporary test route was created only in the isolated checkout. Production is unchanged. The user continued to 6.4 on 3 November.

## 6.4 — “no rules. just taste.”: a typographic transition

Replace the flat orange strip with a more deliberate statement section. Proposed direction: oversized two-part typography on the warm page background, with the first phrase entering through a mask and the second resolving into brand orange as the visitor scrolls. Let scale and space establish the transition; avoid another continuously moving ticker.

- Keep the exact CMS text and original font family. Determine display line breaks from available space without hardcoding different marketing copy.
- Prototype one restrained scroll-linked treatment. Keep text readable at every resting state and finish the animation within a short scroll distance.
- Preserve a coherent static statement for reduced motion, no JavaScript and arbitrary owner-edited text.
- Review it together with the end of the gallery and beginning of Stories so the transitions feel intentional.

Acceptance: a distinct visual moment with legible full text, no overflow, no competing continuous motion, and no excessively long pinned section.

Implemented 3 November 2026. The exact CMS text **no rules. just taste.** now forms two oversized, offset phrases on the warm page background. The first is left-aligned and enters with a 900 ms mask reveal; the second sits to the right and fills from charcoal to brand orange as its top moves from 90% to 45% of the viewport height. The fill reverses with scrolling and never conceals the words. There is no looping movement, pinning or intercepted scroll. Mobile uses larger responsive type within the same content grid.

The existing text field remains the sole owner control. An explicit line break takes precedence, followed by a sentence boundary or a balanced word boundary. Every character is retained, without hardcoded marketing copy or duplicated accessible text. Longer entries use a smaller scale and wrap; a single word remains a single phrase; empty/whitespace-only entries leave no section. Reduced motion and no JavaScript show the completed black/orange composition. High-contrast mode uses the system text color.

No CMS data, schema, queries or dependencies changed. `StatementAccent.tsx` uses the existing Motion library to drive a CSS text gradient. Implementation reference: [Motion useTransform](https://motion.dev/docs/react-use-transform).

Validation passes: TypeScript, development slug audit and an isolated production build. Browser checks cover 320, 390, 768, 1024, 1440, 2100 and 3840 px, the 2100 px width cap, exact text, no horizontal overflow/clipping, desktop/mobile color progress and reversal, live reduced motion, high contrast, no JavaScript and menu scroll restoration. A temporary fixture outside the repository checks explicit/newline/CRLF splits, text without punctuation, a single word, long copy, long unbroken text, German punctuation, whitespace preservation and empty content. Screenshots were reviewed in context between Gallery and Stories. Evidence: `.sanity-backups/revision6-4/`.

Follow-up: fixed the clipped “j” in the orange statement. The gradient now has font-relative padding for the left overhang and descender, with width/margin compensation to retain the text alignment and surrounding spacing. Browser checks at 320, 390, 768, 1440, 2100 and 3840 px confirm the full descender, no overflow and preserved scroll-fill/reduced-motion behavior. Compared rendered gradient text against unclipped plain text; screenshots and pixel evidence are in `.sanity-backups/revision6-4/descender/`. This was a scoped CSS correction; no CMS change or commit.

Uncommitted; production is unchanged. The user continued to 6.5 on 3 November after the descender correction.

## 6.5 — Stories: consistent showcase panels

Use a consistent two-column desktop grid inspired by the reference's repeated showcase structure. Each card has a landscape cover above a clearly placed title, full excerpt, metadata and story link. Keep row starts aligned and avoid alternating offsets. Adapt title scale to real article titles; do not force long German titles into the villa-name treatment. This incorporates the user's density feedback on the first full-width panels.

- Prototype the first two stories as complete panels before applying the pattern to the whole section.
- Keep pinned-first ordering and publication-date order for the rest. Preserve all story titles, excerpts, authors, dates, cover images and canonical URLs.
- Use a consistent, deliberate panel transition or image reveal. Avoid random alternating offsets.
- Keep the initial selection manageable and retain access to all ten stories through “Read all” and the existing load-more behavior unless a replacement is explicitly reviewed.
- On mobile, image → title → excerpt → metadata/link must remain a simple reading order, with no clipped text.

Acceptance: a predictable reading rhythm matching the reference's repeated showcase structure, full content, preserved navigation and CMS controls. Dedicated stories overview/article templates remain milestone 7.

Implemented 3 November 2026. The first two real stories were prototyped and visually checked on desktop and mobile before applying the pattern to the full selection. The initial panels used a 4:5 cover image beside the copy; the desktop density follow-up below supersedes that layout. Mobile stacks the same content in image → title → excerpt → metadata/link order. Long titles wrap without truncation. Images have a 900 ms mask entrance and the copy follows with a short delay; reduced motion and no JavaScript retain the complete static content.

All ten stories retain their original titles, excerpts, metadata, selected cover references/crops and canonical URLs. Pinned-first ordering and date-descending order for the rest remain unchanged. Four stories appear initially, with two added per load. Loading more focuses the first new story and announces the updated count; each panel has one keyboard link named by its title. Without JavaScript, the remaining stories appear as plain links. “alle stories” leads to `/stories`. No dedicated overview/article template was changed.

The owner continues to edit **Pages → Home → Stories → Heading / Pinned Story**, with story content under **Stories → Posts**. Only the pinned-story field help was clarified; no fields, queries, CMS documents or dependencies changed in this substep.

Validation passes: TypeScript, local schema extraction, the development slug audit and an isolated production build. Browser checks cover 320–3840 px, the 2100 px cap, consistent alignment, mobile reading order, all ten stories' exact content/cover references and working URLs, pinned/missing-pin cases, four-plus-two loading, focus/announcements, normal motion, live reduced motion and no JavaScript. An isolated fixture checks zero/one/three/five stories, missing images/metadata and long text. No horizontal overflow or browser errors; desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-5/`.

Follow-up: “Read all” and each panel's “Read” now use the same animated hand-drawn underline, stationary label and orange hover treatment as About's “speisekarte” link. `AnimatedUnderline.tsx` shares the original paths and 1.6-second cycle across both sections. Each story remains one accessible link, without nested links. TypeScript and desktop/mobile browser checks pass for layout, underline movement, stationary hover, live reduced motion, keyboard focus, destinations and no-JavaScript rendering. Screenshots: `.sanity-backups/story-buttons/`. No content or CMS changes.

Additional button feedback: the load-more button now shares the same treatment. Labels are **alle stories**, **story lesen** and **mehr stories**, with German loading announcements. TypeScript and mobile/desktop checks confirm the animation, hover, reduced motion, keyboard focus and unchanged two-story loading behavior.

Desktop density feedback: changed to two aligned story cards per row from 1024 px and one column below. Each card uses a shallower 16:9 cover above its full copy, smaller desktop titles capped at 44 px and tighter spacing. The 2100 px section cap, CMS content/order, German labels and animated underlines remain. TypeScript and browser checks pass at 320–3440 px, including breakpoint behavior, row alignment, no overflow and loading/focusing the next pair. Screenshots: `.sanity-backups/stories-columns/`. No CMS changes.

Ready for visual review; uncommitted. Production is unchanged. The user first skipped 6.6 to review the closing quote, then requested its revised scope below.

## 6.6 — Product: two images and text

**Revised scope on 3 November 2026:** replace the deferred preparation animation with a generic, reusable two-image and text section. Use the reference’s dominant landscape image, smaller offset companion and broad paragraph, with the existing site typography, warm background and restrained reveals.

1. Preserve the complete product copy, label, original image and `imageFirst` setting in `sectionText`.
2. Add one optional second image to the same section, including crop/hotspot and alt text. Start with an existing dough-preparation photograph from development.
3. Build an overlapping image pair on desktop and mobile: larger first image, smaller second image offset down the right, full text below. Retain the owner's images-first/text-first choice.
4. Reuse the existing masked image and text entrances. Keep normal scrolling, reduced-motion/no-JavaScript content, and useful one-image, text-only and image-only layouts.
5. Verify the section between Stories and the founders’ quote, update the owner guide, and record the precise development content change.

Implemented and verified 3 November 2026. **Text + Images** extends the existing `sectionText` rather than adding another section type. The original Focaccia Rosso close-up leads the composition; the existing `dough.jpg` portrait forms the smaller companion. Both retain their natural proportions and owner crops. After review feedback, the photographs overlap on both desktop and mobile, with the complete product paragraph below the pair. The image group caps at 1400 px within the 2100 px section cap. Turning off **Images first** puts the text before the photographs in both the layout and reading order.

The pair shares one 900 ms masked entrance; the second photograph no longer waits for its own viewport trigger. Text uses an 850 ms reveal. Reduced motion and no JavaScript show all content statically. Keyboard focus immediately reveals rich-text links. No dependency, pinning, preparation-media field or animation setting was added.

The only CMS delta is `sections[_key=="127c47c7f4bd"].secondaryImage` on the development homepage, referencing `image-38736e66f3840aea27096c753fd0bf8e864c833d-1067x1600-jpg` with German alt text. The guarded draft was compared before publishing to development. The original product fields, all other sections/order, all 156 other documents and existing drafts retain their content/revisions. There is no remaining homepage draft from this operation.

Validation passes: TypeScript, local schema extraction, the development slug audit and an isolated production build. Browser checks at 320, 390, 768, 1023, 1024, 1440, 2100 and 3440 px confirm image decoding/proportions, full copy, desktop/mobile order, the width cap, section boundaries and no overflow. Isolated fixtures cover each single-image case, text-only, images-only, missing assets, empty/label-only content, text-first mode, long/unbroken text, rich-text headings/marks/lists/links and owner crops. Normal entrances, keyboard focus, live reduced motion and no JavaScript pass without browser errors. Desktop/mobile screenshots reviewed. Evidence: `.sanity-backups/product-pair/`.

Follow-up: after feedback that only one image was apparent, confirmed both existing references in development and changed the photographs into one overlapping pair on desktop and mobile. A shared reveal replaces independent image triggers; the complete text follows the group. No CMS content changed. TypeScript, schema extraction, isolated build and browser checks at 320–3440 px pass for both images loading, overlap, full copy, width limits, image/text-first and missing-image layouts, normal motion, reduced motion and no JavaScript. Screenshots reviewed; evidence: `.sanity-backups/product-overlap/`. Uncommitted.

Ready for visual review; uncommitted. The preparation sequence below remains optional future work, not an unfinished part of the revised 6.6 scope.

## Future enhancement — focaccia preparation scrollytelling

Deferred at the user’s request; footage still awaits filming. The brief below is retained for a future return. No placeholder animation counts as the finished sequence.

Replace the current Text + Image presentation with a scroll-driven preparation sequence. Progress through making one piece of focaccia as the visitor scrolls; reverse smoothly when scrolling back. Retain the complete existing product copy as readable HTML, with supporting text alongside or below the visual sequence.

### Media dependency and filming brief

The owner confirmed that preparation footage still needs to be filmed. No video assets were found in the development dataset or repository on 2 November. The supplied reference/menu recordings are research material, not production footage.

Suggested brief:

- Show one coherent preparation story, such as opening/cutting the focaccia, adding ingredients, finishing, and presenting the completed piece. Confirm the actual process before filming; do not invent production claims.
- Use a locked camera, stable lighting, consistent exposure/focus and a clean work surface. Keep hands and the focaccia inside a central area that can also support a portrait crop.
- Capture a landscape 4K master at a consistent 25 or 30 fps if available. Keep the uncropped master; additional portrait framing is useful if the preparation cannot survive a central crop.
- Aim for a concise 10–20 second edited sequence, with a brief clean hold on the first and final composition. Avoid rapid camera moves, baked-in captions and jump cuts that look abrupt when scrubbed backwards. Sound is optional; the site sequence will be silent.
- Supply a sharp poster frame and the finished video. The developer prepares website exports; the owner should not manage hundreds of frames in Sanity.

### Implementation sequence

1. Build a small isolated scroll prototype using clearly labelled temporary material or the existing product still to review geometry and copy placement. A still-image prototype does not count as the final preparation animation.
2. Evaluate the real footage when available. Compare seeking an optimized video against a generated image sequence drawn to canvas, particularly in Safari/iOS. Choose based on seeking smoothness, transfer size and decoded-memory cost.
3. Use GSAP ScrollTrigger if its scoped scrubbing/pinning solves the prototype cleanly. Its official API supports both; responsive and reduced-motion variants can be managed with `gsap.matchMedia()`. Keep the current hero/page-transition system intact. Sources: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
4. Keep the section reusable in the page builder. Add an opt-in preparation-media mode to the existing product section, preserving its rich text and still-image fallback. The owner controls the source media, poster and copy; frame exports, timing and scroll math stay implementation details.
5. Load heavy media close to the viewport. Bound decoded frames and resolution, preserve the last successfully rendered frame while loading, and avoid downloading a full-resolution sequence on initial page load.
6. Use a finite pinned interval only where it improves the sequence. Leave the browser's native scroll behavior intact. Handle resizing, orientation changes, direct navigation, menu opening/closing and page transitions; tear down all triggers on unmount.
7. Reduced motion, no JavaScript, unavailable media and loading failures show the poster plus complete text in normal document flow. Mobile gets a lighter asset and shorter sequence, with a static/manual-play fallback if scrubbing is unreliable.

Acceptance: the actual preparation footage follows scroll progress in both directions, text remains readable, the section exits naturally, mobile performance is measured, all fallbacks work, and the owner can maintain it without editing animation code. Final visual acceptance depends on the filmed footage; do not mark this substep complete using a placeholder.

## 6.7 — Closing quote: words first, portrait alongside

Added 3 November 2026 after the user clarified that “6.7” means the quote at the end of the homepage. Milestone 7 (other page templates) remains on hold.

1. Snapshot the existing quote, attribution, image and section order from development.
2. Give the complete quote the leading position in a broad text column. Place the existing portrait in a smaller column on the right, aligned lower in the composition. Retain the warm background, brand typography and 2100 px content cap.
3. Add a restrained text entrance followed by the attribution, alongside a masked portrait reveal. Keep ordinary scrolling; reduced motion and no JavaScript show all content immediately.
4. On mobile, stack the complete quote and attribution above a smaller, right-aligned portrait. Preserve image proportions/crops and support text-only, image-only and long-copy cases.
5. Review the transition from the product section into the quote and footer. Check desktop/mobile layout, content preservation, motion and fallbacks.

Acceptance: a distinct closing composition with the exact original text, author and image, no clipping, and the same simple **Pages → Home → Quote** editing controls. No new content fields or animation settings are needed. Do not begin milestone 7.

Implemented 3 November 2026. The complete quote now leads in the broad left column, with an orange quotation mark and the attribution in its original casing below. The existing photograph sits in a smaller, lower right column, capped at 480 px and retaining its natural proportions and owner crop. Below 1024 px, the quote and attribution precede a smaller, right-aligned photograph. The section remains within the 2100 px page cap.

`QuoteStatement.tsx` introduces the text over 850 ms, followed by the attribution after a 550 ms delay; the portrait uses the existing 900 ms masked reveal. Ordinary scrolling is retained. Reduced motion and no JavaScript show the complete composition. A semantic figure/blockquote/figcaption associates the words and author; the decorative quotation mark is hidden from assistive technology. The image uses the author's name when its CMS alt text is absent. The shared image type now accepts Sanity's nullable alt field.

The existing **Author**, **Quote** and **Image** controls remain unchanged. No schema, queries, CMS content or dependencies changed. Before/after snapshots confirm the development homepage revision, section order, quote, author and image are identical.

Validation passes: TypeScript, the development slug audit and an isolated production build. Browser checks cover 320, 390, 768, 1023, 1024, 1440, 2100 and 3440 px, image proportions/width limits, responsive order, full text, no overflow and a clean boundary with the footer. Isolated fixtures cover text-only, image-only, missing author/asset, short/long/unbroken/newline copy, owner crops and empty content. Motion sampling confirms the stagger and portrait reveal; live reduced motion and no JavaScript pass without browser errors. Desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-7/`.

Ready for visual review; uncommitted. Milestone 7 has not started, and production is unchanged. The subsequent product request is recorded under the revised 6.6 scope above.

## 6.8 — Pre-step-7 polish

Requested 3 November 2026. Complete these changes before starting milestone 7; work stays in development and uncommitted.

1. **Layout foundation:** remove the cap from the page-builder wrapper. Center section content within 2100 px; keep full-width backgrounds/ticker and the hero photograph’s left-edge treatment. Check real 2560–5092 px viewports, not only the browser’s device scale.
2. **Sticky brand:** move a visual copy of the hero logo toward the top-left header as the visitor scrolls past the hero. Preserve a usable home link, reverse on upward scrolling, handle restored scroll/resize/routes/menu opening, and switch immediately with reduced motion.
3. **Reachable links:** right-align menu links and the reading actions inside story cards. Keep menu items CMS-controlled and preserve order/status positions. Swap About’s hours and menu link in visual and reading order, putting the menu link on the right.
4. **Footer:** replace the old small-column layout with a composition matching the redesigned page. Retain CMS branding, navigation/social links, address/map, contact visibility controls and opening hours. Use German interface labels, clear touch targets and right-aligned actions.
5. **Review:** verify 320–5092 px, mobile portrait/landscape, full-width ticker, centered content, logo travel/reversal, menu geometry/focus, footer destinations, and reduced-motion/no-JavaScript content. Record checks and update the implementation guide. Do not begin milestone 7 or commit without lock-in.

Implemented and verified 3 November 2026. Centered the content containers and made the ticker/full-width backgrounds independent of the 2100 px cap. The hero photograph still reaches the left viewport edge. The logo rises and shrinks before settling into a top-left sticky home link; scrolling back reverses the movement. Reduced motion switches directly. The initialization handles streamed content, and the connection follows hero replacements and route changes. Menu links and story actions align right; About now shows hours before the right-aligned menu link. The footer uses larger brand/order artwork, clear hours/contact groups, right-aligned CMS navigation/social links and a German back-to-top control.

No CMS fields, documents or dependencies changed. Existing footer destinations, address/map, opening hours, contact visibility controls, section order and content remain intact. All 22 regressions, TypeScript, the development slug audit and an isolated production build pass. Browser checks cover 10 portrait/landscape viewports from 320 to 5092 px: centered content, full-width ticker, left-edge photograph, no overflow, menu/hero order-status positions, stationary toggle, right-aligned links and swapped About content. Four normal-motion viewport sequences confirm logo travel/reversal and compact sizing at the header. Fresh loads, restored scroll, live reduced motion, menu focus/Escape/scroll restoration, footer links and home/stories/menu/imprint navigation pass. No-JavaScript content remains visible. Desktop/mobile screenshots reviewed; no browser errors. Evidence: `.sanity-backups/pre-step7/`.

Ready for review; uncommitted. Production is unchanged and milestone 7 has not started.

Follow-up: the user corrected the sticky-logo destination to **top-left**. The dock now sits 24 px from the left viewport edge; the menu stays on the right. Focused browser checks at 320, 390, 1440 and 5092 px pass for docking, reverse travel, menu/scroll restoration and reduced motion, with no errors. Evidence: `.sanity-backups/header-left/`. No CMS changes or commits.

## 6.9 — Approved homepage refinements (4 November 2026)

Approved for implementation; keep work in development and uncommitted until visual lock-in. Milestone 7 remains on hold.

1. Reduce the Stories and Product section headings to a consistent responsive 32–64 px scale; preserve story-card typography.
2. Let the Product photographs and copy use the same 2100 px container and gutters as About. Remove the extra internal width caps, preserve overlapping images and adjust responsive image delivery.
3. Align story-card footers across each desktop pair. Place author/date on the left and the animated “story lesen” action on the right in the same row on large screens, with predictable wrapping on narrow screens.
4. Add an optional second image to Home → Quote, with crop/hotspot and alt text. Overlap the images slightly and reveal them as a group; preserve one-image, text-only and image-only cases. Leave the image selection to the owner.
5. Add Home → Hero → Image duration (seconds), using 1.2 seconds by default, including existing sections without the field. Retain the 100 ms crossfade and reduced-motion/loading safeguards.
6. Simplify the footer using the restrained navigation and spacing of Villas Tamarindo as reference. Use a small logo, aligned hours/contact/navigation groups and a consistent mobile stack with right-aligned links. Preserve CMS content and visibility controls.
7. Check responsive layouts, optional-content cases, carousel timing, motion preferences and content preservation. Update the owner/implementation guides and present the uncommitted result for review.

Implemented 4 November 2026. Stories/Product headings now scale from 32 to 64 px; the Product image composition and copy fill the same content width as About. Story links stretch to equal card heights, with metadata and the reading action sharing a row from 1280 px. The optional quote `secondaryImage` is wired through Studio, GROQ, renderer and overlapping image composition. Hero `imageDuration` is editable from 1.2–15 seconds and defaults to 1.2 seconds for existing sections; the 100 ms fade and playback safeguards remain. The footer uses three aligned columns from 1024 px and one consistently right-aligned stack below, with the compact logo and existing links/contact controls.

Validation: TypeScript, schema extraction, all 22 regression tests, development slug audit and isolated production build pass. Browser layout checks cover eight portrait/landscape viewports from 320 to 5092 px, including heading scale, full Product width, image overlap, story/footer alignment and no overflow. Twenty quote cases cover paired, secondary-only, text-only, image-only and empty configurations. Custom footer fixtures verify long content and contact visibility. All ten stories load in pairs with focus preserved and actions aligned at 1280/1920 px. Carousel measurements average approximately 1.21 seconds by default and 2.41 seconds for the 2.4-second setting; invalid values use the default. Reduced motion stops playback. Normal-motion quote images load/reveal together; no-JavaScript content and desktop/mobile screenshots pass without browser errors. Evidence: `.sanity-backups/homepage-polish/`.

No CMS documents were mutated: all 145 existing content/draft revisions are identical before and after. Existing hero selections are preserved; the second quote image remains unselected for the owner to choose. Temporary fixture routes existed only in the isolated checkout. Documentation is updated. Ready for visual review; uncommitted, production unchanged and milestone 7 not started.

## Completion and release

For each substep, record the implemented behavior, CMS delta, desktop/mobile screenshots, relevant checks and review decision in this file. Preserve the other uncommitted step-6 work while revising it. Commit only after explicit lock-in; do not deploy or mutate production.

The seven section revisions and additional 6.8 polish are implemented for review. Check the complete homepage rhythm, image loading, keyboard navigation, reduced motion, content preservation and section reordering before final homepage approval. Keep the preparation sequence as optional future work; milestone 7 remains a separate scope.


### 6.8 follow-up — header, hero scale and compact footer

Requested 3 November 2026; remains part of homepage review before step 7.

1. Remove the sticky header background and bottom border. Assess a lightweight adaptive logo treatment against real photos and text.
2. Reduce hero logo/order artwork approximately 35%, widen the desktop carousel to a 65/35 grid, and preserve the shared hero/menu positions, viewport fit and full-width ticker.
3. Inspect the [Villas Tamarindo footer](https://villas-tamarindo.com/) and restore a compact small-logo/information layout, with restrained right-aligned page/social groups and existing CMS destinations.
4. Document the intro's existing CMS inputs versus code-defined choreography. Update outdated Brand editor help text.
5. Verify responsive layout, motion, menu geometry and content before marking ready for review. No commit or production changes.

Implementation: transparent black-logo header; CSS inversion discarded after testing because it produced blue/complementary photo colors and fragmented text overlaps. No image sampling or additional animation dependency was added. The carousel is wider, hero artwork smaller, and ordering links retain a 44 px touch target. Footer now uses a small logo in the bottom row, with contact, hours and separate page/social groups above; oversized ordering artwork is removed. Intro content is editable through existing Brand/Hero fields; timing and animated element selection remain code-defined. No CMS records changed.


The 6.8 header/hero/footer follow-up passes TypeScript, all 22 regressions, the build-time development slug audit and an isolated production build. Ten viewport checks (320–5092 px) confirm the wider hero, full-width ticker, viewport fit, 44 px ordering targets, matching menu/hero geometry, transparent header, top-left docking, reverse travel, restoration, focus, route changes, reduced motion and no-JavaScript content. Final footer checks at five sizes confirm the small bottom-row logo, preserved links and no overflow. Desktop/mobile first-visit intros settle correctly; the order hover changes color without moving. Final screenshots at 390, 1440 and 2560 px reviewed; no browser errors. Evidence: `.sanity-backups/chrome-refinement/`. Uncommitted; CMS records and production unchanged.


### 6.8 follow-up — dedicated Page Intro settings (4 November 2026)

Add a dedicated **Site Settings → Page Intro** singleton with an enable switch and complete iconmark + wordmark artwork. Use the supplied SVG without changing its paths or lockup. Remove the visible tagline; retain the Brand name and tagline in the permanent screen-reader heading. Keep the owner controls wired through the site and review preview, including missing-asset and reduced-motion behavior.

Implemented in development: uploaded the supplied lockup (empty outer margins trimmed), added `settingsPageIntro`, and preserved all 144 existing content document/draft revisions. The new settings use local Studio definitions; the connector's older deployed schema was not replaced. See the [intro owner guide](hero-integration.md#what-the-owner-can-edit-in-the-intro). Uncommitted; step 7 remains on hold.


Verification (4 November 2026): TypeScript, schema extraction, all 22 regression tests, the development slug audit and an isolated production build pass. Browser checks at 320, 390, 844 landscape, 1440 and 2560 px verify the complete lockup, viewport fit, absence of a visual tagline and the name/tagline heading in the accessibility tree during and after the welcome. Temporary fixtures cover disabled welcome, absent settings, a failed artwork request and a replacement artwork. Repeat visits, keyboard interruption, live reduced motion and no-JavaScript content pass without browser errors. Desktop/mobile screenshots reviewed. Evidence: `.sanity-backups/page-intro/`. The test fixture existed only in the temporary checkout and was removed with it. No manual VoiceOver/NVDA test was performed.

## Homepage lock-in — 4 November 2026

The user approved committing the complete homepage before starting milestone 7. The three implementation commits above contain all section revisions and refinements through 6.9. Existing verification remains applicable: all 22 regressions, TypeScript, schema extraction, development slug audit, isolated build and responsive/content/motion checks passed. Production rollout remains a separate approval.
