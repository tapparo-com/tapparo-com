# Milestone 7 — stories, Speisekarte and legal pages

Authorized 4 November 2026 after homepage approval and commits `e9395f8`, `8c3c53a`, `03930e7` and `8bd0af6`. Implemented and verified against development. No CMS documents were mutated. Locked in and committed on 4 November 2026: `be135f0` (stories/legal) and `91aeba5` (menu and allergen alignment).

## Sequence

1. **Baseline:** snapshot all story, menu, category, item, allergen and legal documents, plus all document/draft revisions. Inspect existing routing, SEO and visibility rules. Baseline: 10 posts, 12 published menu categories in owner order, one category draft, 93 menu items, seven allergens, one stories settings document and one legal document containing both imprint and privacy text.
2. **Stories overview:** reuse the approved two-column story panels, full excerpts, aligned metadata/actions and animated German links. Add a consistent page introduction, retain newest-first order and progressive loading with keyboard focus/announcements and no-JavaScript access to remaining stories.
3. **Articles:** introduce a responsive title/metadata/cover composition, readable body column, complete rich-text styles and consistent related-story cards. Preserve bodies, links, imagery/crops, author/date, explicit related references, fallback selection, disable switch, URLs and SEO. Keep long reading content visible instead of animating the whole article.
4. **Speisekarte:** align with the shared 2100 px content container and gutters. Provide compact sticky category navigation with native anchors, clear headings, readable item/price rows and an accessible allergen legend. Retain owner category/item order, availability filtering, single/variant prices, extras and optional category photography. Use German interface labels; preserve owner-authored labels.
5. **Impressum:** use a calm readable text layout and visible last-updated date. Preserve all legal/privacy wording and links, and footer access.
6. **Verification:** compare rendered content against the snapshot; check representative and all story routes, related-story cases, menu prices/availability, anchors, rich-text/image fallbacks, mobile/desktop/ultrawide layouts, keyboard, reduced motion and no JavaScript. Run regression/type/build checks, confirm all CMS revisions unchanged and record review evidence.

## Owner workflow

The existing Stories overview settings, Posts/Authors, Menu categories/items/allergens and Legal Pages remain the sources of content. No schema migration, new editing workflow or production rollout is included.

## Implemented behavior

- Shared page introductions and all content containers use the approved 2100 px cap and page gutters. The overview uses the same landscape story-card structure as the homepage, with two columns from 1024 px and aligned metadata/actions. Following review, overview/related cards use compact 24 px headings and 16 px excerpts; the homepage retains its approved scale. The shared `StoryCollection` retains four initial cards; the overview adds four per click, the homepage two. Loading focuses the first new story, announces the new count in German and exposes remaining links without JavaScript.
- Article titles, metadata and prose form the left column, with a square responsive cover beside the text from 1280 px. Each column is capped at 624 px, within a centered 1312 px composition. Below that breakpoint, the title/metadata, image and body stack in reading order. Articles without a cover use one centered 624 px column. The separate large header composition and top return link have been removed; the return link remains below the body. Page headings and covers use restrained entrances; the body remains immediately readable. Rich text supports all existing headings, paragraphs, lists, blockquotes, marks and links. CMS body `h1` styles render as `h2` below the page title. Inline images keep their natural cropped aspect and optional captions. Related stories use the same cards and existing explicit-reference/default/disabled logic. Return links use “alle stories” with the approved animated underline.
- The Speisekarte retains all 12 categories in owner order and 82 currently referenced available item entries. The other stored menu items and the unpublished category draft remain untouched. Sticky native category anchors work without JavaScript; enhancement tracks the current category and scrolls its label into the horizontal navigation without changing vertical scroll. Category names/descriptions remain owner-authored. Items form one continuous column at every viewport size, capped at 624 px. The menu introduction and category headings align with that column. Optional category photos may sit beside the single item list on desktop. Prices use German euro formatting without changing their values; variants, extras and availability rules are preserved. Touch-sized allergen links lead to the complete legend. Optional category photographs retain manual, German-labelled controls and static/no-JavaScript fallbacks, with live reduced-motion support.
- The legal template retains the complete imprint and privacy wording, links and update timestamp. The date is now visible at all sizes. An identical plain leading CMS `h1` is presented once as the page title; subsequent CMS `h1` headings become body `h2` headings. No legal wording was rewritten.
- GROQ projections now include image dimensions, crops, hotspots and placeholders for story covers, inline article/legal images and category photographs. No schemas, documents, URLs, SEO settings, ordering route or owner workflows changed.

## Verification and review

TypeScript, all 22 regression tests, the development slug audit and an isolated production build pass. Browser checks cover four page types at eight portrait/landscape viewports from 320 to 5092 px (32 layouts), centered content, two-column story cards, one page heading, no horizontal overflow and desktop/mobile screenshots.

All ten article routes return 200, retain canonical URLs, complete body text, cover references and dates, and show the expected explicit or fallback related stories. The overview preserves full excerpts and newest-first ordering, loads all ten stories with focus, and the homepage's two-at-a-time behavior still works. All rendered menu item IDs/order, price values, variant values and extras match the snapshot. A local GROQ fixture verifies hidden items stay excluded, missing availability stays included, zero prices and variants survive, and broken item references are handled. Native category anchors and active labels pass forward/backward navigation on mobile and desktop.

Fixtures cover long menu content, multiple category photos, zero/missing/variant prices, extras/allergens, empty stories, article images/missing cover, lists, quotes, captions and normalized internal links. Normal-motion page routing, keyboard focus, menu Escape/scroll restoration, live reduced motion and no-JavaScript access pass with no browser errors. The full legal text and footer link match the baseline. All 145 existing content/draft revisions are unchanged.

Evidence: `.sanity-backups/step7/` (snapshots, build/test logs, browser reports, screenshots and temporary fixture source). Review fixtures existed only in the isolated checkout. The user's existing development server was left running.

Review locked in and implementation committed. Production is unchanged; milestone 8 has not started.

## Reading-layout feedback — 4 November 2026

The user preferred the original menu's single item column and the original smaller story/legal typography, with article photos beside the prose. Compared the rendered [live menu](https://tapparo.com/menu), [article](https://tapparo.com/seasonal-bottles-aperitivo-muenchen) and [production imprint](https://tapparo.com/Impressum) at 1440 px before revising the layouts. Reference screenshots and computed typography are saved in `.sanity-backups/step7-reading-review/`.

Page titles now follow the original 30/38/42 px mobile/tablet/desktop scale. Article/legal copy uses 16 px text with 28 px line spacing, 24 px section headings and 20 px subheadings. Reading columns cap at 624 px. The articles use a single cover element beside both the heading and prose on desktop, stacking between the heading and prose on smaller screens. The menu is a single column with aligned prices and more compact row spacing; category anchors, availability, variants, extras, allergens and optional photos remain supported. Story overview and related-card typography is compact, while retaining two cards per desktop row and the animated German links.

No CMS fields, documents, queries, URLs or content changed in this feedback pass. These refinements are included in the approved milestone-7 commits.

Follow-up alignment correction: the allergen heading and legend now share the menu categories' centered 624 px content wrapper, retaining the responsive legend grid and all allergen anchor targets. Browser checks at 390, 1440, 2560 and 5092 px confirm matching left edges/widths, all seven allergens and no horizontal overflow.

Verification after the revisions: TypeScript and an isolated production build against development pass. Browser checks cover 36 page/viewport combinations from 320 to 5092 px, including the 1280 px article breakpoint, single-column menu rows, capped reading widths, compact typography and no horizontal overflow. All ten stories, full menu content/prices, legal wording, category anchors, loading/focus, related-story rules, fixtures and no-JavaScript behavior pass. Normal-motion navigation, menu scroll restoration, photo controls and live reduced motion also pass without browser errors. Desktop and mobile screenshots were visually reviewed. Evidence is in `.sanity-backups/step7-reading-review/`; the existing development server remains running.


## Stories audit follow-up — 4 November 2026

Implemented for review, uncommitted. The approved two-column desktop cards, compact titles, full excerpts, German animated links and 16px article prose remain. Shared card author/date metadata is now 13px; wide cards retain an inline, right-aligned “story lesen” action and aligned row footers. The bakery excerpt's two literal `**` markers were removed in development without changing its words or article body. Excerpt help text now explains that the field is plain text.

**Owner control:** Stories → Posts → Cover Image → **Image Framing** now offers **Fill frame — photos** (the default for existing images) and **Show full image — posters and artwork**. This applies to the overview, homepage cards, related stories, story highlights and article cover. Full-image framing preserves the image aspect within the existing frame and disables card hover zoom so lettering stays visible; any crop explicitly set in Studio is still respected. The development `/opening` cover uses Show full image. No assets were replaced.

On desktop viewports at least 1280px wide and 800px tall, the article cover stays alongside the prose, 100px below the viewport top, and stops at the end of the article. Mobile and shorter viewports retain ordinary scrolling. Articles with related stories now use the single “alle stories” link in that section; articles without related stories retain their return link below the body.

Only two development fields changed: `coverImage.fit` on `44d73d40-b25a-4cad-8520-59cdffd04a3e` and `excerpt` on `0904d3f2-070d-4513-9a6b-dc2d291e2c59`. Before/after snapshots preserve all ten posts; the other 144 content/draft revisions are unchanged. The connector's draft-only mutation behavior did not fit the direct, revision-guarded field correction, so the existing Sanity CLI pattern was used with a hard development/project guard and an atomic transaction. Production remains untouched; these two field corrections must be reviewed separately at release.

Verification: all 39 existing regression tests, TypeScript, schema extraction, slug checks and an isolated optimized build against development pass. Eight Chromium/WebKit layouts from 320–2560px verify card order/loading/focus, paired footer alignment, full artwork, mobile footer alignment and no overflow. Normal/reduced motion, no-JavaScript access and bounded desktop sticky behavior pass. All ten article routes retain full text, titles, cover references and canonical URLs; homepage cards retain their initial count and shared styling. Evidence: `.sanity-backups/stories-footer-review/`. Production, owner drafts and the existing development server remain untouched. No commit or deployment.


## Speisekarte audit follow-up — 5 November 2026

The clipped horizontal category strip is replaced by a native **Kategorie wählen** disclosure showing the current category. Opening it exposes every CMS-selected category by name in a responsive index. Native fragment links retain browser history and no-JavaScript access; JavaScript closes the index after selection, supports Escape/outside-click dismissal and keeps its current label synchronized while reading. The sticky chooser reserves space for the global navigation toggle. Its small text remains dark; an orange underline identifies the current category.

Development's page title and header/footer menu links now say **Speisekarte**. Six allergen labels were translated: Sellerie, Milchprodukte, Eier, Fisch, Nüsse and Soja; Gluten was already German. Codes, item references and underlying allergen information are unchanged. All menu categories, items, prices, variants, extras, availability, images and ordering are preserved, as are the centered 624px reading column and allergen block. These narrow content changes require separate production review; no production edits were made.

## Fixed header and category chooser — 6 November 2026

The new persistent site header overlapped the Speisekarte's category chooser, which still used `top: 0`. The chooser now sticks beneath the shared responsive header height (84px on mobile, 108px on desktop). On `/menu` only, the site header has a cream background to keep scrolling content from showing through its controls. The chooser no longer needs extra mobile right padding for the global menu toggle.

Category and allergen fragment offsets account for both bars. A ResizeObserver measures the category bar so wrapped labels retain sufficient clearance; the dropdown's maximum height accounts for the remaining viewport space. Native links, category order and CMS content remain unchanged.

TypeScript and diff checks pass. `/menu` returns HTTP 200 with the expected page marker, category navigation and compiled offset/background/dropdown styles. Fresh visual and interaction verification remains pending: the in-app browser is unavailable, and native Chrome automation rejected the navigation attempt. Changes are committed locally in the [current checkpoint](release-review.md#design-refinement-commit-checkpoint--6-november-2026).

The category dropdown now has a viewport-wide darker background and border, with its links confined to the centered 624px content column (two desktop columns, one on mobile). The subsequently approved typography/border pass removes forced capitals from story metadata and footer headings. Menu, allergen and related-story section boundaries now span the available viewport width around unchanged centered content containers; the menu's sticky offset remains intact. See the [current implementation and verification record](release-review.md#typography-home-entrance-and-section-border-fixes--6-november-2026).


## Audit work committed — 6 November 2026

The user authorized committing the prior audit refinements before the next hero/menu revision. Commits: `b891ad1` (legal/404/footer), `f2046b9` (Stories), `1bac920` (homepage sections), `ae14093` (hero/navigation/Speisekarte), and `714d982` (Kontakt). The historical “uncommitted” notes above describe their original review state. All 40 tests, TypeScript and diff checks passed immediately before this commit series. No push, deployment, email or production changes. The newly approved hero/menu composition work is separate and remains subject to review.
