# Tapparo

Restaurant website for Tapparo, a focacceria and daybar in Munich. Built with Next.js, Sanity CMS, and Tailwind CSS. Deployed to Vercel.

- [Implementation plan and progress](PROJECT_PLAN.md)
- [URL policy, validation, and migration rollout](docs/url-normalization.md)
- [Approved design and motion direction](docs/design-direction.md)
- [Opening hours, live status, and hero editing](docs/opening-hours.md)
- [Homepage revision sub-project](docs/homepage-revision-plan.md)
- [Homepage implementation record](docs/homepage-redesign.md)

The [local homepage](http://localhost:3000/) now renders the approved hero from the development CMS. **Pages → Home → Hero** controls carousel images, image duration and ticker phrases; **Site Settings → Opening Hours** controls the shared live indicator. The carousel follows the selected images and defaults to a 1.2-second image duration with a 100 ms crossfade. One selected image stays static. The remaining sections retain their content.

Step 4 is committed (`0426fae`, `b265868`, `dc0002d`). Step 5 is committed (`a7bc4bc`, `620a611`), with its record in `49d5a9c`. Step 6 is locked in and committed: `e9395f8` (homepage sections), `8c3c53a` (hero/header/intro controls), and `03930e7` (footer). Step 7 is authorized next. Product now uses two editable images and the full original text; scrollytelling is optional future work. See [Homepage sections](docs/homepage-redesign.md) and [Hero and navigation integration](docs/hero-integration.md). The separate [design preview](http://localhost:3000/design-preview) retains the approved demonstration sequence and motion replay controls. Production is unchanged.

## Architecture

The site is split into two parts:

- **Public website** at `/` — server-rendered pages built from CMS content
- **Content studio** at `/studio` — Sanity Studio where editors manage all content

Ordering links use `/order`, which returns a temporary `307` redirect to the Degaso destination defined in `lib/ordering.ts`. The route works independently of CMS content and Coming Soon mode. Use `ORDER_PATH` for ordering CTAs; `TransitionLink` and `ButtonLink` bypass prefetch and internal page transitions for this route. Menu-viewing links continue to use `/menu`.

### Tech stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Sanity 3** (headless CMS, GROQ queries)
- **Tailwind CSS 4** (utility-first styling)
- **Motion** (animations and page transitions)
- **Vercel** (hosting, CDN, image optimization)

### Project structure

```
app/
  (site)/              # Public site route group
    layout.tsx         # Shared layout (header, footer, page transitions)
    page.tsx           # Homepage
    [slug]/page.tsx    # Dynamic pages (CMS pages, blog posts, legal pages)
    menu/page.tsx      # Menu page
    stories/page.tsx   # Stories listing page
  order/route.ts       # Temporary redirect to Degaso ordering
  studio/              # Sanity Studio (admin interface)
  layout.tsx           # Root layout (fonts, metadata)
  not-found.tsx        # 404 page
  sitemap.ts           # Auto-generated sitemap
  robots.ts            # Search engine crawl rules
  manifest.ts          # PWA web app manifest

components/
  sections/            # Page sections (Hero, SubHero, Quote, Gallery, etc.)
  ui/                  # Reusable UI components
  hero/                # Shared hero artwork, intro, viewport layout, and site navigation
  homepage/            # Shared editorial section styles and image rendering
  Footer.tsx           # Site footer
  ComingSoon.tsx       # Coming soon page
  SectionRenderer.tsx  # Maps CMS section types to React components
  PostBody.tsx         # Blog post body renderer (Portable Text)

sanity/
  schemaTypes/         # CMS content models
  lib/
    queries.ts         # All GROQ queries
    fetch.ts           # Data fetching with ISR
    fetchSvg.ts        # Server-side SVG logo fetching
    image.ts           # Sanity image URL builder
    client.ts          # Sanity client configuration

lib/
  animation.ts         # Shared animation timing constants
  ordering.ts          # Ordering path, destination, and link detection
  urls.ts              # Shared URL normalization and slug rules
```

## Content management (Sanity Studio)

Access the studio at `yoursite.com/studio`. The sidebar is organized into:

### Site Settings
- **Brand** — Restaurant name, tagline, logo, supporting logos
- **Page Intro** — First-visit welcome toggle and iconmark + wordmark artwork. Screen-reader name/tagline come from Brand; the visual intro has no separate tagline.
- **Contact** — Email, phone, address, Google Maps link
- **Opening Hours** — Day/hours pairs shown in the footer and SubHero section
- **Social Links** — Instagram, WhatsApp, etc. Referenced by header, footer, and coming soon page
- **SEO** — Default meta title, title template, meta description, coming soon mode

### Navigation
- **Header** — Page links for the menu overlay, social links, phone toggle
- **Footer** — Page links, social links, phone/email toggles

### Pages
CMS pages built with a section-based page builder. Available sections:
- Hero, SubHero, Story Highlight, Stories Grid, Quote, Text + Images, Gallery, Image Grid, Large Text

**Text + Images** retains the existing `sectionText` content. Edit the heading, full rich text, first image, optional second image and **Images first** setting in the section. Images support crop/hotspot and alt text; one-image and text-only layouts work automatically. The homepage uses this section for **Das Produkt**.

### Menu
- **Menu Page** — Title, description, ordered category references
- **Categories** — Title, description, item references, extras, images
- **Items** — Title, description, pricing (fixed or variants), allergens, availability toggle
- **Allergens** — Code + label pairs shown as badges on menu items

### Stories
- **Stories Page** — Title, description (shown above the stories list)
- **Posts** — Blog posts with title, body (rich text), cover image, author, related stories
- **Authors** — Name and image

### Legal
- Legal pages (e.g. Imprint) with title, body, and a manually set "last updated" date

## Common tasks

### Editing the homepage
1. Go to Studio > Pages > Home
2. Click on any section to edit it
3. Drag sections to reorder
4. Publish

The redundant standalone address section has been removed. Continue editing the shared address and map under **Site Settings → Contact** for the hero, menu and footer. About now has **First image** and optional **Second image** fields above its full text; the original image, menu link and hours controls are retained. The About link uses a hand-drawn animated underline; its text and destination remain editable. **Section name** is used in the editor and by screen readers, without a visible overline. Follow the [homepage revision sub-project](docs/homepage-revision-plan.md) for review status and upcoming section changes.

Pre-step-7 polish adds centered content on wide screens, a full-width ticker, a scrolling hero logo that docks in the top-left header, right-aligned menu/story actions and hours before the right-aligned About link. The redesigned footer still uses **Site Settings** and **Navigation → Footer** for its brand, contact/hours, page and social links; no additional CMS controls are needed. The footer uses a small logo and compact information/link groups, without oversized ordering artwork. The transparent sticky header has a black logo and no divider. Hero artwork is approximately 35% smaller and the desktop carousel uses a wider 65/35 grid. The intro is controlled under **Site Settings → Page Intro**: enable/disable the welcome or replace its iconmark + wordmark artwork. Brand supplies the restaurant name/tagline for screen readers, and Home → Hero supplies the first photograph; timing remains defined in code. See the [intro editing guide](docs/hero-integration.md#what-the-owner-can-edit-in-the-intro).

Gallery images form compositions of up to three photographs: a leading image, an overlapping companion and a small detail. Drag **Gallery Images** to change their order; extra selections form additional groups. Mobile displays every image in the same reading order. Crop and alt-text controls remain unchanged, and small source files are kept small. The optional **Caption** appears below the gallery.

The brand statement still uses **Large Text → Display Text**. An optional line break sets the two phrases; otherwise the layout chooses a sentence or word boundary. The complete wording is retained, and longer text scales down and wraps. Motion is automatic and respects reduced-motion preferences.

Homepage Stories use two aligned columns on desktop and one on smaller screens, with landscape covers above the text. Edit the section's **Heading** and optional **Pinned Story** as before; edit each story under **Stories → Posts**. The pinned story comes first, followed by publication date. Four stories appear initially, with two more per load; the full title, excerpt, author/date and cover remain visible.

The closing **Quote** section keeps its **Author**, **Quote** and **Image** fields and adds an optional **Second image** that slightly overlaps the first. Its full text leads the layout, with the portrait beside it on desktop and below it on mobile. Image crops and alt text remain editable; entrances are automatic and respect reduced motion.

### Adding a new menu item
1. Go to Studio > Menu > Items
2. Create a new item with title, description, pricing type, and price
3. Go to Menu > Categories
4. Open the category where the item belongs
5. Add the item reference to the category's items list
6. Publish both the item and the category

### Publishing a new story
1. Go to Studio > Stories > Posts
2. Create a new post with title, excerpt, body, cover image, and author
3. Publish
4. The post appears on the Stories page and is available at its slug URL
5. To feature it on the homepage, edit the Stories section in Pages > Home and set it as the pinned story

### Updating navigation links
1. Go to Studio > Navigation > Header (or Footer)
2. Add or reorder page links — you can link to any page, post, legal page, or the menu/stories pages
3. Select social links from the ones defined in Site Settings > Social Links
4. Publish

### Turning on Coming Soon mode
1. Go to Studio > Site Settings > SEO
2. Toggle "Coming Soon Mode" to ON
3. Set the body text, optionally enable "Show Address", and select social links
4. Publish — the entire public site is replaced with the coming soon page
5. The studio at `/studio` remains accessible
6. To turn it off, toggle the switch back to OFF and publish

### Adding a legal page (e.g. Privacy Policy)
1. Go to Studio > Legal
2. Create a new legal page with title, slug, body, and "Last Updated" date
3. Publish
4. The page is available at its slug URL (e.g. `/privacy-policy`)
5. To add it to navigation, go to Navigation > Footer and add a page link pointing to it

## Deployment

The site is deployed to **Vercel** and rebuilds automatically on every push to `main`.

### Environment variables

Set these in the Vercel dashboard (Settings > Environment Variables):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (`development` or `production`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for OG images, sitemap, robots.txt) |

### Content updates

The site uses **Incremental Static Regeneration (ISR)** with a 60-second revalidation window. When an editor publishes a change in Sanity:

1. The next visitor request after 60 seconds triggers a background page rebuild
2. The following request serves the updated content

No manual redeploy is needed for content changes.

### Switching datasets

To switch from `development` to `production`:
1. Update `NEXT_PUBLIC_SANITY_DATASET` in the Vercel dashboard
2. Redeploy (or trigger a new deployment)

### Sanity CORS

The Vercel domain must be added to Sanity's CORS origins for the embedded studio to work. Add it at `manage.sanity.io` > Project > API > CORS Origins.

## Local development

```bash
# Install dependencies
npm install

# Create .env.local with your Sanity credentials
NEXT_PUBLIC_SANITY_PROJECT_ID=project-id
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development server
npm run dev
```

The site runs at `http://localhost:3000` and the studio at `http://localhost:3000/studio`.

Approved refinements (4 November): Stories and Product section headings now scale from 32 to 64 px. Product images and text use the full shared content width. Story actions share a metadata row from 1280 px, with aligned footers across desktop card pairs. The simplified footer has three aligned columns on desktop and a single right-aligned stack below 1024 px. **Pages → Home → Hero → Image duration (seconds)** accepts 1.2–15 seconds; empty or invalid values use 1.2 seconds, and the 100 ms crossfade stays fixed. **Pages → Home → Quote → Second image** is optional and has crop/hotspot and alt text. No CMS migration or content changes are needed. See [the approved sequence](docs/homepage-revision-plan.md#69--approved-homepage-refinements-4-november-2026).
