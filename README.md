# Tapparo

Restaurant website built with Next.js, React, TypeScript, Tailwind CSS and Sanity. The website and embedded Studio are deployed together on Vercel.

## Development

```sh
nvm use
npm ci
```

Create `.env.local`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=64kcdhuf
NEXT_PUBLIC_SANITY_DATASET=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CONTACT_DELIVERY_MODE=demo
```

Run `npm run dev`, then open [the website](http://localhost:3000) or [Sanity Studio](http://localhost:3000/studio). Studio requires access to the Sanity project. The contact form is a demo and sends no email.

## Commands

- `npm run dev` — local development.
- `npm run build` — optimized build using the selected CMS dataset.
- `npm start` — serve that build.
- `npm run format` — format code and sort Tailwind classes.
- `npm run typecheck` — check TypeScript.
- `npm test` — run behavior tests.

Stop the development server before building in the same checkout; both use `.next`.

[AGENTS.md](AGENTS.md) contains code conventions, CMS editing notes and manual release instructions. [The contact-page plan](docs/contact-page-plan.md) tracks the remaining contact setup.
