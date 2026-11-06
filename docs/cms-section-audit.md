# CMS section editing guide and audit

6 November 2026. Audited all **10 page-builder sections** and **17 registered document types** against the local Studio schema, GROQ projections, section renderer and frontend components. The local Studio definitions are authoritative. The initial audit updated documentation only. The subsequent requested Hero enhancement adds the optional second-link controls described below.

## How editing works

- Edit reusable sections under **Pages → your page → Sections**. Drag to change their order. Regular pages display their page Title above the sections; Home uses its hero heading instead.
- The header, footer and first-visit welcome are shared features, configured outside the page's section list. Menu, Stories, articles and legal pages use dedicated templates rather than this section builder.
- Fields control content and the specific options described below. Spacing, breakpoints, type sizes, colors, borders and most animations belong to the website design.
- Publish changes to make them available to the website. The frontend reads published content; saving a draft alone does not update it. Deployed pages may need the existing cache/revalidation cycle before changes appear.
- Blank fields have different meanings: some hide content, while others restore a default. The Studio help text now states this explicitly.

## Page-builder sections

| Section | What editors can change | Shared or fixed behavior |
| --- | --- | --- |
| Hero | Introduction, second-link visibility/wording/CMS destination, ticker phrases/order, carousel images/order/crops/alternative text, image interval (1.2–15 seconds). | Use first on Home. Desktop/mobile composition is fixed. Wordmark, hours, address and welcome come from Site Settings. “jetzt bestellen” always appears first and leads to `/order`; the optional second link follows it. Ticker speed and crossfade style are fixed; reduced motion pauses autoplay and wraps ticker text. |
| SubHero | Rich introduction text, up to two images, one internal link, optional opening-hours table. Section name is an editor/accessibility label. | No visible overline. The first image shares the optional link destination. Bold text uses the orange accent. Hours are shared. Image arrangement, typography and link styling are fixed; the legacy button style field stays hidden and is not used. |
| Story Highlight | One story reference, optional local title/excerpt overrides, section label and link wording. | Uses the referenced story's image and framing. Overrides affect this section only. Image, title and action link to the story. It hides if the reference cannot resolve. The small section label is uppercase by design. |
| Image Grid | Optional heading and up to three images with order/crops/alternative text. | Fixed offset composition with responsive stacking. Original proportions are retained; small images remain details. No slideshow or lightbox. |
| Quote | Plain-text quote, attribution and up to two images. | Supports text-only or image-only content; an author alone does not display a section. The second image overlaps the first. Typography, quote marks and motion are fixed. |
| Large Text | Complete plain-text statement. | First line break determines the two-part split, otherwise a sentence or balanced word break is used. Accent animation and type scale are fixed. Empty text hides the section. |
| Gallery | Any number of ordered images and one optional caption for the whole gallery. | Repeating groups of three with a fixed leading/overlapping/detail composition. Crop and natural proportions are preserved. Scroll reveals, not autoplay; no lightbox. |
| Stories | Heading and optional pinned published story. | Empty heading uses “Stories”. Four cards initially; two more per click. Remaining posts are newest first. Post content comes from Stories → Posts. “alle stories”, “mehr stories”, card actions and layout are fixed. Pinning affects this collection only, not `/stories`. |
| Text + Images | Optional heading, rich body, two images, images-first/text-first order, optional enquiry link with reason preselection. | Requires body or an image. The enquiry action requires body text, a label and a published destination with a slug. Image overlap, link style and typography are fixed. Unknown/disabled enquiry identifiers do not preselect a reason. |
| Contact Form | Introduction, enquiry reasons/order/enablement, four question headings, email/message guidance, reason-specific message overrides, send label, live confirmation copy and privacy-page reference. | Fixed reason → name → email → message → review sequence. No custom fields, attachments, arbitrary branching or per-reason inboxes. Details below. |

### Hero second link

Open **Pages → Home → Hero → Second link**:

1. Enable **Show second link** to reveal the label and destination fields. Disable it to hide the link while retaining those values.
2. Enter **Link label** exactly as visitors should see it, such as “alle stories”, “Speisekarte” or “kontakt”. No wording is automatically substituted. A non-blank label is required while enabled.
3. Choose **Destination page** from existing CMS pages: Menu, Stories overview, ordinary pages such as Kontakt, articles or legal pages. The destination must be published; ordinary pages need a URL slug. There is no external URL field or inline page creation.

The fixed **“jetzt bestellen”** link remains first on both desktop and mobile and leads to `/order`. The optional link follows it. New Hero sections start with the second link disabled. Missing settings or an unresolved destination hide the second link; they do not restore a default Menu link.

The existing development Home hero was migrated to an enabled “speisekarte ansehen” link referencing Menu, preserving its current wording and destination. The old `menuLinkLabel` data is retained as a hidden legacy field and is no longer rendered. Before production rollout, carry over the approved second-link configuration explicitly; production content has not been migrated.

The Short introduction is also shown on mobile. Clearing that field hides the introduction only. Clearing the ticker phrases hides the ticker. Carousel timing is separate from welcome animation timing.

### Contact Form / Kontakt

Open **Pages → Kontakt → Contact Form**. The parent page's Title controls “Kontakt”; the section Introduction controls the copy above the questions. On mobile that introduction disappears after step 1.

| Control | Behavior and fallback |
| --- | --- |
| Enquiry reasons | Add 1–8, rename, reorder or disable. At least one must remain enabled. Reason order does not automatically select a reason. |
| Reason label | Appears as the choice, in review and in the delivered enquiry. It is separate from the link identifier. |
| Link identifier | Stable lowercase identifier such as `catering`. Used by `/kontakt?anliegen=catering` and Text + Images enquiry links. Keep it stable after sharing links. |
| Reason message question/help | Overrides only step 4 for the selected reason. Empty values use the general message question/help. No new fields are created. |
| Steps 1–4 question headings | Change the displayed prompts. Required answers and step order remain fixed. Blank values use the supplied German defaults. |
| Email/message help | Guidance below the question. Blank values restore German defaults, rather than hiding the guidance. |
| Send button label | Final review action; blank uses “Anfrage senden”. Next, Back, Edit, review headings, error messages and sending-state text are fixed. |
| Confirmation heading/text | Used after provider acceptance in live mode. Blank uses German defaults. This is page copy, not an autoresponder. Development preview has its own fixed confirmation and never sends email. |
| Privacy information | Required published Legal page with a slug. A missing destination prevents use of the form and leaves the direct email fallback. Edit legal wording in that document. |

The public fallback email comes from **Site Settings → Contact → Email**, with the existing `hello@tapparo.de` fallback. This does **not** change server delivery. The existing server recipient remains `hello@tapparo.com`; confirming it and activating delivery are tracked separately in the [Kontakt activation checklist](contact-page-plan.md#remaining-activation-checklist). No enquiry was submitted during this audit.

## Shared settings and dedicated templates

| CMS area / document type | Editable content and limits |
| --- | --- |
| Pages (`page`) | Title, slug, section list and SEO. Home's title is not an extra visible heading. Navigation labels are edited separately. |
| Menu Page (`menuPage`) | Heading, introduction, category references/order and SEO. The `/menu` route, sticky dropdown, structural layout and automatic allergen legend are fixed. Empty heading uses “Speisekarte”. |
| Menu Categories (`menuCategory`) | Name/anchor, description, ordered item references, local extras and ordered images. Natural-proportion images have manual previous/next controls, not square autoplay frames. Extra prices are display strings; the site prepends `+` without formatting the rest. |
| Menu Items (`menuItem`) | Name, description, single numeric euro price or labelled variants, allergen references and availability. Numeric prices get German euro formatting. Unavailable items hide in every referring category. This does not update Degaso products. |
| Allergens (`allergen`) | Code and full label. Codes link to the automatic legend; labels also supply accessible link names. No hover tooltip. All published allergens appear in code order. |
| Stories Page (`storiesPage`) | Heading, introduction and SEO for `/stories`. Lists published posts newest first, four initially and four more per click. No manual selection or page sections here. |
| Posts (`post`) | Title, excerpt, body, cover/framing, displayed date, author, related-story controls and SEO. Date controls sorting, not scheduled publication. Cards show full plain-text excerpts. Related stories use the valid selection, or two latest other stories when no valid selection exists. |
| Authors (`author`) | Shared byline name. Portrait and biography remain stored/editor-visible but are explicitly documented as not displayed on the website. |
| Legal (`legalPage`) | Heading/slug, full rich text, displayed update date and SEO. Jump links come from headings automatically. Update date is manually maintained. A duplicate opening title is displayed once. |
| Brand (`settingsBrand`) | Text name/tagline, main SVG wordmark, 404 supporting artwork and Coming Soon logo artwork. Text does not rewrite images. Tagline is used in hero accessibility/search data, not as the visible hero introduction or a separate Coming Soon tagline. |
| Page Intro (`settingsPageIntro`) | Enablement and complete artwork for the once-per-tab welcome. Home adds a photograph handoff; other landing pages show the same brand welcome. Timing, easing, interruption and reduced-motion behavior are fixed. |
| Contact (`settingsContact`) | Public email/phone/address/map URL. Header/footer phone switches are independent. Map URL controls linked addresses and “Route planen”. Form delivery settings are separate. |
| Opening Hours (`settingsHours`) | Weekly schedule, Munich holiday policy, date exceptions and temporary closures, all in Berlin time. Closures override special dates, which override normal/holiday hours. Internal notes are not public. Legacy text rows remain for history and become read-only when a weekly schedule exists. Editor weekday headings are English; public labels remain German. |
| Social Links (`socialLink`) | Reusable names and HTTPS destinations. Creating a document does not place it anywhere; select it independently in header, footer or Coming Soon. |
| Header Navigation (`navigationHeader`) | Ordered page/social references and phone visibility. The site inserts “Jetzt bestellen” after Home or first when Home is absent. Header positions, overlay typography, status/address and that fixed ordering action are not controlled by this list. |
| Footer (`navigationFooter`) | Ordered page/social references and email/phone visibility. Hours, address, contact values and logo come from Site Settings. Group headings, layout and back-to-top action are fixed. |
| SEO (`settingsSeo`) | Shared title template/defaults and Coming Soon body/address/social selection. Coming Soon replaces regular site pages; it does not disable Studio or `/order`. Page-specific metadata does not change visible headings. |

### Existing limits now made explicit

- A blank description currently inherits the shared SEO description on Home only. Other route templates explicitly supply their description value; set it on the page/post/legal document. Post descriptions first fall back to their excerpt. This audit documents the existing behavior rather than changing metadata rendering.
- Post cover images currently expose framing/crop controls, not a custom alternative-text field; article/cards fall back to the post title. Post-body images also have no custom caption/alternative-text inputs in this schema. Legal/section images expose their documented alternative-text fields. No new fields were introduced by the audit.
- The Contact Form is a configured enquiry flow, not a general form builder. Live delivery remains a separate implementation/release task.
- Hidden legacy fields remain preserved. Nothing was deleted or migrated merely because it is no longer presented as an active design control.

## Verification and scope

- Compared every registered section with its query projection and renderer, including empty values, shared settings and fixed labels.
- The initial audit covered 216 nested/reused field definitions with help where visible and all ten section descriptions. The subsequent second-link object and its three controls also include English help text.
- The initial documentation-only audit preserved schema structure. The requested follow-up adds `secondaryLink`, hides the legacy field, and updates the query and hero rendering. Label/destination validation is conditional on enablement.
- TypeScript and Sanity schema extraction pass. The installed CLI emitted its existing path-with-spaces launcher warning but successfully produced a parseable schema export.
- Local evidence: `.sanity-backups/cms-section-audit-2026-11-06/`. Fresh visual inspection of Studio remains pending because browser automation is unavailable.

The Hero follow-up passes all 42 regression tests, TypeScript, schema extraction, six validation cases, ten query/destination cases, and a rendered-HTML check of action order. Only the development Home document changed, adding `secondaryLink`; its previous content and all 210 other document/asset revisions, including owner drafts, are preserved. No Home draft remains from the migration. Evidence is in `.sanity-backups/hero-secondary-link-2026-11-06/`.

The documentation audit is committed as `3b420b0`; the optional Hero link and this updated guide are included in the accompanying feature commit at the user's request. No live delivery configuration, hosted Studio or production deployment/content was changed. Studio visual inspection remains pending because browser access is unavailable.
