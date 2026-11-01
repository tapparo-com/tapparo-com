# Tapparo

Restaurant website for Tapparo, a focacceria and daybar in Munich. Built with Next.js, Sanity CMS, and Tailwind CSS. Deployed to Vercel.

- [Implementation plan and progress](PROJECT_PLAN.md)
- [URL policy, validation, and migration rollout](docs/url-normalization.md)

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
  Header.tsx           # Sticky header with menu toggle
  Footer.tsx           # Site footer
  MenuOverlay.tsx      # Full-screen navigation overlay
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
- **Contact** — Email, phone, address, Google Maps link
- **Opening Hours** — Day/hours pairs shown in the footer and SubHero section
- **Social Links** — Instagram, WhatsApp, etc. Referenced by header, footer, and coming soon page
- **SEO** — Default meta title, title template, meta description, coming soon mode

### Navigation
- **Header** — Page links for the menu overlay, social links, phone toggle
- **Footer** — Page links, social links, phone/email toggles

### Pages
CMS pages built with a section-based page builder. Available sections:
- Hero, SubHero, Story Highlight, Stories Grid, Quote, Text + Image, Gallery, Image Grid, Large Text

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
