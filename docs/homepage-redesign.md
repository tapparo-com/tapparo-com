# Homepage sections — implementation record

Milestone 6 was **locked in and committed on 4 November 2026**: `e9395f8` (editorial sections), `8c3c53a` (hero/header/intro controls), and `03930e7` (footer). The [homepage revision sub-project](homepage-revision-plan.md) records the decisions and validation below. Development content changes remain unreleased; production is unchanged.

## Current state

Review at [localhost:3000](http://localhost:3000/). The approved hero is followed by About, Gallery, Large Text, Stories, Text + Images, and the founders' quote. These seven sections remain controlled by the CMS page builder.

The standalone address section was removed at the user's request in substep 6.1. About, Gallery and the brand statement have been revised, including the statement's clipped descender correction. Stories feedback is implemented; the closing quote (6.7) and revised two-image product section (6.6) are ready for review. Scrollytelling is now optional future work, replaced in the current scope by the user's two-image/text request.

| Section | Current state / next change |
| --- | --- |
| Hero | Approved milestone-5 implementation; retain |
| Standalone address | Removed in 6.1 |
| About / SubHero | Two images, full introduction and coordinated text/link/hours motion; user continued to 6.3 |
| Gallery | Layered image composition and desktop scroll motion; user continued to 6.4 |
| Large Text | Offset typography and a scroll-linked orange fill; user continued to 6.5 |
| Stories | Consistent image/copy showcase panels; 6.5 ready for review |
| Product | Revised 6.6 ready for review: two overlapping photographs, full original text and a shared image entrance |
| Founders' quote | 6.7 ready for review: words first, smaller offset portrait and staggered entrance; original content retained |

## Substep 6.1 — address removal

The fresh development snapshot contained no homepage draft. A revision-guarded patch removed only:

```text
Document: f803c306-580e-4053-9b34-84d9cda1f91a
Removed array item: sections[_key=="83a69bd55c60"]
```

The new draft was compared with the snapshot before publication. The remaining seven sections retain their keys, content and order. All 156 other non-asset records retain their revisions, including the three existing drafts. Site Settings → Contact is unchanged; the hero, menu and footer still use its shared address and map information.

The unused `LocationSection` component, CSS and `useContactAddress` schema/query/rendering branch introduced during the first pass were removed. Ordinary quote sections remain. At completion of 6.1, the homepage data differed from the start of milestone 6 only by the explicitly requested removal of the redundant address block; the interim boolean was removed along with it.

Private local evidence: `.sanity-backups/revision6-1-before.json`, `revision6-1-after.json`, `revision6-1-browser.json`, and `revision6-1-*.png`. Original first-pass backups remain in `step6-before.json` / `step6-after.json`. No remote schema deployment was performed. The MCP's older remote schema still warns that the already-existing page `sections` field is unknown; local Studio definitions remain authoritative.

At the approved production rollout, take a fresh backup and apply the reviewed address-section removal only after identifying and comparing the current production item. Do not replace the production homepage with development or publish unrelated drafts.

## Substep 6.2 — two-image About

Implemented 3 November 2026. The original menu artwork and an existing bar-service photograph form an offset pair above the full About paragraph. Desktop uses a broad text block with an indented opening line; mobile stacks the two images before readable full-width text. The optional menu CTA and hours form a supporting row below. The first image still links to the configured menu destination; the second is a photograph without a redundant link.

The first image preserves its selected crop and natural proportions. The second uses a landscape frame and the image-specific hotspot. The two image mask reveals are brief. The complete text then eases upward over 900 ms, followed by the menu link and opening hours, staggered by 180 ms. The supporting row also waits to enter the viewport so its animation is not consumed while reading a long paragraph on mobile. Reduced motion and no JavaScript keep content visible. Missing primary, missing secondary, missing both, and absent button/hours are handled without empty image placeholders.

The initial development content change in 6.2 was the addition of `sections[_key=="88ad61dd7dc5"].secondaryImage`. It references the existing `bar.jpg` asset, with descriptive German alt text and a hotspot. That initial change preserved every original field. The subsequent review changed only the About button label from “View the menu” to “speisekarte”; other sections, assets and existing drafts are unchanged. All 156 other non-asset documents retain their revisions. Before/after snapshots and the isolated review evidence are stored under `.sanity-backups/revision6-2-*`.

The 3 November feedback was checked against the supplied 1.595-second screen recording at 100 ms intervals. Its label stays still while a hand-drawn underline subtly changes shape. About now uses that treatment for the lowercase **speisekarte** link: a 1.6-second SVG path loop while visible, with orange hover/focus styling and no movement of the label. The visible About overline is removed. The text, link and hours share one entrance sequence in `AboutIntroduction.tsx`, while Portable Text remains semantic server-rendered HTML. Keyboard focus reveals the content immediately; reduced motion disables the entrance and underline motion. No new dependency was added.

The label edit was backed up, revision-guarded, compared as a draft and published only to development. All 156 other non-asset documents retain their revisions and no existing draft was published. Evidence for this follow-up is in `.sanity-backups/about-motion/`.

For production rollout, after approval and a fresh comparison, apply only the reviewed secondary-image field and About button label in addition to the address removal. Preserve owner edits and existing draft work; do not copy the development homepage wholesale. Select the corresponding production asset reference from the production inventory rather than assuming dataset references are interchangeable.

## Substep 6.3 — gallery composition

Implemented 3 November 2026. The gallery now repeats complete groups of up to three photographs: a leading image, an overlapping companion and a smaller detail. The selected coffee-machine, focaccia-service and water-service images keep their order, alt text, crop data and natural proportions. Small source images are capped at their cropped native width; the existing 256 × 192 px water-service asset remains a detail. The optional caption follows the complete gallery.

`GalleryScene.tsx` handles a short mask entrance for each image and different scroll-linked translations on desktop. Native scrolling remains intact, with no pinning. Responsive/reduced-motion media queries update live: mobile has simple entrances in a vertical reading order, and reduced motion has no entrances or translation. Server output remains visible without JavaScript. One/two-image groups, additional groups, compact all-small groups, missing assets and caption-only content are supported. No content mutation or dependency change was needed.

The page-builder query, field names and CMS data are unchanged. Studio help now explains the gallery order and automatic layout. Production needs only the reviewed code change for this substep; there is no gallery content migration.

## Substep 6.4 — brand statement

Implemented 3 November 2026. The orange banner is replaced by two oversized, offset phrases on the warm page background, retaining the original font family and exact **no rules. just taste.** copy. The opening phrase has a short masked entrance. The closing phrase stays readable as a left-to-right orange fill follows its movement from 90% to 45% of viewport height. It reverses on upward scrolling, with no pinned interval or continuous animation.

`SectionLargeText.tsx` divides the existing string at an explicit newline, sentence boundary or balanced word boundary; it does not replace or duplicate the text. Long entries scale down and wrap, a single word remains a single phrase, and blank content renders nothing. `StatementAccent.tsx` animates a CSS custom property using the existing Motion library. Reduced motion/no JavaScript show the completed black/orange design; forced colors use system text. The CMS data, schema and query are unchanged, so no content migration is needed for this substep.

Follow-up: fixed the clipped “j” in the orange statement. The gradient now has font-relative padding for the left overhang and descender, with width/margin compensation to retain the text alignment and surrounding spacing. Browser checks at 320, 390, 768, 1440, 2100 and 3840 px confirm the full descender, no overflow and preserved scroll-fill/reduced-motion behavior. Compared rendered gradient text against unclipped plain text; screenshots and pixel evidence are in `.sanity-backups/revision6-4/descender/`. This was a scoped CSS correction; no CMS change or commit.

## Substep 6.5 — Stories

Implemented 3 November 2026 and revised after desktop feedback. Stories now use two aligned columns from 1024 px, with a single column below that breakpoint. Each card has a 16:9 landscape cover above its title, full excerpt, author/date and reading link. Desktop titles cap at 44 px, and the gaps and supporting text are smaller than the earlier full-width panels. The section retains the 2100 px cap. The image mask and copy entrance use the existing Reveal component; reduced motion and no JavaScript show the static cards.

`SectionStories.tsx` retains pinned-first ordering, the date-sorted remainder, four initial stories and two per load. Loading more focuses the first new panel and announces the updated count. Each panel has one link named by its title; keyboard focus makes any unrevealed content immediately visible. With JavaScript disabled, plain links expose every remaining story. “alle stories” leads to `/stories`.

All ten story titles, excerpts, authors, dates, cover references/crops and canonical URLs are preserved. No CMS content, query, dependency or dedicated overview/article template changed. Studio help now describes the pinned story as the first item in the homepage selection. There is no content migration for this substep.

Review follow-up: “Read all” and “Read” share About's animated underline styling and the extracted `AnimatedUnderline.tsx` component. The label stays stationary, hover turns brand orange, and the line rests with reduced motion. The story panel retains a single link named by its title. TypeScript and browser checks cover responsive layout, motion/hover, focus, navigation and no JavaScript; desktop/mobile screenshots are in `.sanity-backups/story-buttons/`. No CMS changes.

The follow-up also applies the shared animated underline to the load-more button. The three labels are now **alle stories**, **story lesen** and **mehr stories**. Loading announcements and the no-JavaScript list label are German as well. TypeScript and mobile/desktop browser checks pass for wrapping, underline motion, stationary orange hover, reduced motion, keyboard focus and loading two additional stories.

Desktop density follow-up: the two-column grid replaces the earlier portrait-image/copy rows, which were too tall on large displays. Cards and row starts align without alternating offsets. TypeScript and browser checks cover 320–3440 px, both sides of the 1024 px breakpoint, the width cap, landscape crops, no overflow and loading the next pair with preserved focus. Desktop/mobile screenshots were reviewed: `.sanity-backups/stories-columns/`. No CMS changes.

## Substep 6.6 — product image pair

Implemented 3 November 2026, replacing the deferred preparation sequence in the current scope. After feedback that only one image was apparent, the original Focaccia Rosso photograph and smaller dough-preparation portrait now form one overlapping composition on desktop and mobile, with the full product paragraph below. The portrait overlaps the right edge of the first photograph and sits lower in the pair. The image group and copy now fill the shared 2100 px section container, using the same gutters as About; their former 1400/1280 px internal caps have been removed. Product image requests and responsive sizes account for the larger composition. The existing `imageFirst` setting reverses the text/image-group reading order when disabled. The heading remains optional; typography and background match the other sections.

The existing `sectionText` is now named **Text + Images** in Studio. It retains `label`, `body`, `image` and `imageFirst`; only optional `secondaryImage` is added. The page query and renderer pass through its asset metadata, alt, crop and hotspot. Both images use natural proportions and selected crops, sharing one 900 ms mask reveal so neither waits for its own viewport trigger. Text enters over 850 ms. No extra dependency or animation controls were added. Reduced motion/no JavaScript retain all content; focused rich-text links reveal immediately. Missing images collapse cleanly, and text-only/image-only content remains supported.

The development homepage changed only at `sections[_key=="127c47c7f4bd"].secondaryImage`, referencing existing asset `image-38736e66f3840aea27096c753fd0bf8e864c833d-1067x1600-jpg` with descriptive German alt text. The mutation used a revision guard and was compared as a draft before development publication. All original product fields, other sections and 156 other documents/drafts remain unchanged. Evidence: `.sanity-backups/product-pair/`.

Follow-up: after feedback that only one image was apparent, confirmed both existing references in development and changed the photographs into one overlapping pair on desktop and mobile. A shared reveal replaces independent image triggers; the complete text follows the group. No CMS content changed. TypeScript, schema extraction, isolated build and browser checks at 320–3440 px pass for both images loading, overlap, full copy, width limits, image/text-first and missing-image layouts, normal motion, reduced motion and no JavaScript. Screenshots reviewed; evidence: `.sanity-backups/product-overlap/`. Uncommitted.

At the approved production rollout, compare a fresh snapshot and add only the reviewed second-image field if still absent. Verify/select its corresponding production asset; preserve owner changes and existing drafts. Do not copy the whole development homepage.

## Substep 6.7 — closing quote

Implemented 3 November 2026. The full quotation leads a broad text column with an orange quotation mark; its attribution follows in the original casing. The existing portrait occupies a smaller column aligned lower on the right, retaining its proportions and crop. Below 1024 px, the text and attribution come first, followed by the right-aligned portrait. The portrait caps at 480 px on desktop and 400 px on smaller screens; the section retains the 2100 px content cap.

`QuoteStatement.tsx` keeps semantic figure/blockquote/figcaption markup and coordinates an 850 ms text entrance with the attribution beginning 550 ms later. The portrait or optional overlapping pair uses one 900 ms mask reveal. Reduced motion and no JavaScript show everything statically. Text-only, image-only, long-copy and missing-field cases remain usable. The shared image type accepts nullable CMS alt text; the quote image falls back to the author when alt is absent.

No CMS data, schema, queries or dependencies changed in 6.7. Its before/after development snapshots match, including the document revision, section order, full quote, author and image. The later product revision above preserves the quote unchanged.

## Editing and implementation

### Pre-step-7 polish (6.8)

The hero brand and ordering artwork are approximately 35% smaller, with a shorter desktop brand row. The desktop grid is now 65/35 rather than 57/43, giving the carousel more width and height. The photo limit within the capped grid is 1400 px, with the existing left-edge bleed on ultrawide screens. Mobile ordering remains right-aligned and retains a 44 px touch target. The menu uses the same geometry so ordering/status positions still match.

Requested, implemented and verified 3 November 2026; ready for review. The page-builder wrapper is now full width, while each content section is centered within 2100 px. The ticker spans the available viewport width. On wider screens the hero photograph extends from the centered composition to the left viewport edge; the logo, ordering artwork and status remain on the capped grid. Footer borders/backgrounds also span the viewport, with centered content inside. The menu toggle stays at the viewport’s right edge.

`ScrollHeader.tsx` measures the hero logo in its original layout and moves a separate copy toward a small top-left home link, with the menu button staying on the right. It rises and shrinks toward the left header position and reverses on upward scrolling. The header has no background, divider or bottom border; the floating logo is black. A CSS difference-blend prototype was discarded because photos produced off-brand colors and underlying text fragmented the mark. Exact image/text-aware color switching is deferred. The original occupies its normal layout space and is hidden only while the copy is shown; keyboard focus follows the visible home link. Reduced motion switches directly at the docking threshold. The component handles streamed page content, hero replacements, resizing, scroll restoration and route changes. No JavaScript retains the original logo.

Menu links are right-aligned in the right desktop column and across the mobile menu. Their scroll area starts below the status block; the ordering/status layout and fixed toggle positions are preserved. Story-card reading actions, “alle stories” and “mehr stories” align right. About’s supporting row now reads **hours → speisekarte**, with the link at the right edge; its entrance follows the hours after the main text.

The compact footer uses a small 148 px logo (132 px on mobile) in its bottom row, opening hours, contact details and right-aligned navigation/social groups. Its restrained uppercase links and spacing draw on Villas Tamarindo; the oversized brand and ordering artwork have been removed. It uses German interface labels and 44 px minimum contact/navigation targets. Address/map, email/phone visibility, page links, social destinations and opening hours remain controlled by their existing settings and navigation documents. CMS link labels are preserved. “nach oben” uses the shared animated underline. No CMS mutations or new fields are required.

Continue using **Pages → Home → Sections** to select, edit and reorder sections. Shared contact details stay under **Site Settings → Contact**. The location toggle from the first pass is no longer present.

Current reusable section styles and media handling are in `components/homepage/Homepage.module.css` and `SectionMedia.tsx`. Rich text, selected images, gallery order, pinned stories, optional hours and image-first controls are retained. About and Stories share the animated underline treatment; Product uses a reusable image pair and full rich text.

For About, open **Pages → Home → SubHero**. **First image** is the existing `image` field; **Second image** is optional. Both support crop/hotspot and alt text. Keep **Heading**, **Button** text/destination, and **Show Opening Hours** as before. **Section name** identifies the section in the editor and for screen readers; it is no longer a visible overline. The About button uses one consistent underlined style, so the old filled/outline control is hidden while its stored value is preserved. Remove either image to use the single-image layout; removing both leaves a text introduction.

For Gallery, open **Pages → Home → Gallery → Gallery Images**. Drag the photographs into reading order; the composition follows groups of three. Edit the existing image crop/alt text as usual. Small images remain details, and additional selections are all displayed. **Caption** is optional and appears below the gallery.

For the statement, edit **Pages → Home → Large Text → Display Text**. An explicit line break sets the phrase division; otherwise the layout chooses a sentence or word boundary and wraps to fit. Longer wording is supported. There are no new animation controls.

For Stories, edit **Pages → Home → Stories → Heading / Pinned Story**. The pinned story appears first; the rest follow publication date. Edit titles, excerpts, covers/crops, authors and dates under **Stories → Posts**. The layout and loading behavior are automatic, with no extra presentation controls.

For Product, open **Pages → Home → Text + Images** (labelled **Das Produkt**). Edit **Section Label**, **Body**, **First image** and optional **Second image**. Both images support crop/hotspot and alt text. **Images first** shows photographs before text; turn it off to lead with the text. Removing either image uses a single-image layout; removing both leaves the complete text. This section can also be reused on other CMS pages.

For the closing quote, edit **Pages → Home → Quote → Author / Quote / Image / Second image**. The second image is optional and overlaps the first in one shared reveal. Leaving it empty retains the single portrait; a second image alone also renders correctly. The full text and attribution wrap automatically. The image keeps its proportions and supports the existing crop and alt-text controls; the layout and entrance sequence require no extra settings.

Preparation footage still needs filming. The [future scrollytelling brief](homepage-revision-plan.md#future-enhancement--focaccia-preparation-scrollytelling) is retained as optional backlog and does not block the current homepage design.

## Verification history

The first pass passed 22 regression tests, TypeScript, local schema extraction, a development slug audit and an isolated production build. Browser checks covered 320–3840 px, content preservation, all story links, images, section variations, reduced motion and no-JavaScript rendering. Those results describe the first pass; they do not constitute visual approval.

Substep 6.1 passes the content/revision audit, TypeScript, slug audit and an isolated production build. Browser checks at 1440 × 1000 and 390 × 844 confirm seven sections in the expected order, no gap left by the removed section, no horizontal overflow or runtime errors, and retained shared address in hero and menu. Screenshots were visually checked. See the [revision tracker](homepage-revision-plan.md#working-sequence).

Substep 6.2 passes TypeScript, local schema extraction, the slug audit and an isolated production build with development data. Browser checks span 320–3840 px and include the 2100 px cap, exact About copy, both selected images decoding, two preserved menu links, hours, both single-image cases, text-only/image-only/empty states, missing assets, long copy and labels, rich-text marks/lists/links, normal reveals, live reduced motion and no JavaScript. No browser errors or horizontal overflow remain. The long-label fixture caught a narrow-screen CTA overflow, fixed with scoped width limits and wrapping. Desktop/mobile screenshots were reviewed. The temporary fixture exists only in the isolated test checkout, not the repository routes.

The About follow-up also passes an isolated production build, TypeScript, schema extraction, and the responsive/content fixture checks. Browser sampling confirms text → link → hours order (approximately 0 / 0.9 / 1.1 seconds), a moving underline with a stationary label, short-screen viewport gating, keyboard focus, restored scroll positions, live reduced motion and no-JavaScript content. Desktop/mobile screenshots were reviewed.

Substep 6.3 passes TypeScript, schema extraction, the development slug audit and an isolated production build. Responsive checks cover 320–3840 px, image order/decoding, the 2100 px cap, overlap on desktop, separated mobile images and the small-image/crop width cap. An isolated fixture covers one/two/additional images, all-small and reordered images, missing assets/metadata, captions and empty content. Motion checks cover reveal, differential scroll movement/reversal, live reduced motion, breakpoint resizing, menu scroll restoration and no JavaScript. No browser errors or overflow; desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-3/`.

Substep 6.4 passes TypeScript, the development slug audit and an isolated production build. Browser checks cover 320–3840 px, exact text, long/short/newline/unbroken/German copy, no overflow or clipping, desktop/mobile fill progress and reversal, live reduced motion, forced colors, no JavaScript and menu scroll restoration. Desktop/mobile screenshots were reviewed between Gallery and Stories. Evidence: `.sanity-backups/revision6-4/`.

Substep 6.5 passes TypeScript, local schema extraction, the development slug audit and an isolated production build. Browser checks at 320–3840 px verify alignment, the width cap, mobile reading order and no overflow. All ten story texts, metadata, cover references and URLs are preserved and their routes return successfully. Fixtures cover pinned/missing-pin ordering, zero/one/three/five stories, missing images/metadata and long text. Loading, focus/announcements, link navigation, normal/live reduced motion and no JavaScript pass without browser errors. Desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-5/`.

Substep 6.7 passes TypeScript, the development slug audit and an isolated production build. Browser checks at 320–3440 px verify the content, author, portrait reference/proportions, breakpoint order, width cap, no overflow and footer boundary. Isolated fixtures cover missing image/author, image-only/text-only, short/long/unbroken/newline text, crop and empty cases. Sampled motion confirms text before attribution; live reduced motion and no JavaScript pass. No browser errors; desktop/mobile screenshots were reviewed. Evidence: `.sanity-backups/revision6-7/`.

The revised 6.6 passes TypeScript, schema extraction, the development slug audit and an isolated production build. Browser checks cover 320–3440 px, complete text, both selected images decoding, proportions/crops, the 2100 px cap, responsive reading order and section boundaries. Fixtures verify each single-image case, text-only/image-only/missing/empty content, images-first/text-first, long text and rich-text marks/lists/links. Normal motion, keyboard focus, live reduced motion and no JavaScript pass without errors or overflow. Desktop/mobile screenshots reviewed. Evidence: `.sanity-backups/product-pair/`.

Commit only after explicit lock-in. All current homepage substeps, including 6.8 polish, are implemented for review; milestone 7 has not started. Scrollytelling remains optional future work.

Substep 6.8 passes all 22 regressions, TypeScript, the development slug audit and an isolated production build. Browser checks cover 320–5092 px, centered content, full-width ticker/footer, hero left edge, no overflow, right-aligned menu/story actions, About reading/layout order and preserved menu geometry. Sampled logo paths at four sizes reverse consistently, fit the header at the top and settle correctly after restored scroll; fresh loads and home/stories route changes reconnect correctly. Footer destinations/contact visibility, keyboard/menu focus, Escape, live reduced motion and no-JavaScript content pass. Screenshots reviewed; no browser errors. Evidence: `.sanity-backups/pre-step7/`. No CMS mutations, commits or production changes.


The 6.8 header/hero/footer follow-up passes TypeScript, all 22 regressions, the build-time development slug audit and an isolated production build. Ten viewport checks (320–5092 px) confirm the wider hero, full-width ticker, viewport fit, 44 px ordering targets, matching menu/hero geometry, transparent header, top-left docking, reverse travel, restoration, focus, route changes, reduced motion and no-JavaScript content. Final footer checks at five sizes confirm the small bottom-row logo, preserved links and no overflow. Desktop/mobile first-visit intros settle correctly; the order hover changes color without moving. Final screenshots at 390, 1440 and 2560 px reviewed; no browser errors. Evidence: `.sanity-backups/chrome-refinement/`. Uncommitted; CMS records and production unchanged.


### Dedicated Page Intro settings — 4 November 2026

The owner now has **Site Settings → Page Intro** for the welcome toggle and complete iconmark + wordmark SVG. The visible tagline is removed; the hero's persistent screen-reader heading continues to use the shared restaurant name and tagline from Brand. The animation is decorative, without a timed announcement or focus takeover. Empty/failed artwork uses the bundled lockup; the preview shares the CMS settings. The uploaded SVG preserves all paths and colors, with only empty margins trimmed. This supersedes the earlier note that the intro had no dedicated settings. The new document and image asset exist only in development; existing documents and drafts retain their revisions.

## 4 November refinements — 6.9

Stories and Product section headings share a responsive 32–64 px scale. Story-card title sizes remain unchanged. Each story link fills its grid cell, with the footer pushed to the bottom so neighboring cards align despite different excerpt lengths. From 1280 px, author/date and “story lesen” share a row with the action on the right; smaller screens place the action below the metadata. Full excerpts, destinations, single-link semantics, loading/focus behavior and animated underlines are retained.

The quote adds optional `secondaryImage` to its local schema, query and renderer, including crop/hotspot and alt text. The pair overlaps in a 12-column composition and reveals together. One image, secondary-only, text-only, image-only and empty cases remain supported; the owner’s existing quote and image selection are unchanged.

The footer uses three equal columns from 1024 px. Hours, contact and navigation share heading alignment and consistent right edges. Below that breakpoint, they form a single stack with the same gutter and link alignment. Compact typography, a small bottom-row logo, 44 px contact/navigation targets and the existing back-to-top control keep the composition simple. Existing CMS labels, destinations, address, hours and visibility switches are preserved.

Implemented 4 November 2026. Stories/Product headings now scale from 32 to 64 px; the Product image composition and copy fill the same content width as About. Story links stretch to equal card heights, with metadata and the reading action sharing a row from 1280 px. The optional quote `secondaryImage` is wired through Studio, GROQ, renderer and overlapping image composition. Hero `imageDuration` is editable from 1.2–15 seconds and defaults to 1.2 seconds for existing sections; the 100 ms fade and playback safeguards remain. The footer uses three aligned columns from 1024 px and one consistently right-aligned stack below, with the compact logo and existing links/contact controls.

Validation: TypeScript, schema extraction, all 22 regression tests, development slug audit and isolated production build pass. Browser layout checks cover eight portrait/landscape viewports from 320 to 5092 px, including heading scale, full Product width, image overlap, story/footer alignment and no overflow. Twenty quote cases cover paired, secondary-only, text-only, image-only and empty configurations. Custom footer fixtures verify long content and contact visibility. All ten stories load in pairs with focus preserved and actions aligned at 1280/1920 px. Carousel measurements average approximately 1.21 seconds by default and 2.41 seconds for the 2.4-second setting; invalid values use the default. Reduced motion stops playback. Normal-motion quote images load/reveal together; no-JavaScript content and desktop/mobile screenshots pass without browser errors. Evidence: `.sanity-backups/homepage-polish/`.

No CMS documents were mutated: all 145 existing content/draft revisions are identical before and after. Existing hero selections are preserved; the second quote image remains unselected for the owner to choose. Temporary fixture routes existed only in the isolated checkout. Documentation is updated. Ready for visual review; uncommitted, production unchanged and milestone 7 not started.
