# URL normalization and rollout

## Working environment

All ongoing implementation, content changes, migration trials, and review previews use the `development` dataset. Keep production unchanged until the user is happy with the full result and approves its rollout. An individual milestone's lock-in permits its commit, not a production release. The production procedure below is reserved for the user after development review. Step 8 prepares verification and handover only; it does not authorize the assistant to release. See [release review](release-review.md).

## Policy

- Public page paths are lowercase and have no trailing slash, except `/`.
- `/home` redirects to `/`.
- New CMS slugs use `a–z`, digits, and single hyphens, with a maximum of 96 characters. German umlauts become `ae`, `oe`, and `ue`; `ß` becomes `ss` during generation.
- Pages, posts, and legal pages share one case-insensitive namespace. Menu categories have their own anchor namespace. Drafts and release versions of the same document do not count as separate owners of a slug.
- Built-in routes, including `menu`, `stories`, `order`, `studio`, and `api`, are reserved. Only a page may use `home`.
- Existing URLs are not regenerated from titles. The migration changes case only and stops on invalid slugs or collisions.
- Studio, API, Next.js, Vercel, and asset paths retain their original case. Public redirects preserve user query parameters. Next.js manages its own internal RSC parameters.
- Next.js normalizes repeated slashes before middleware, so a repeated-slash URL that also contains capitals can take two redirects.

`lib/urls.ts` is shared by middleware, Studio slug validation, link construction, metadata, and auditing. GROQ queries lowercase projected slugs and match legacy content case-insensitively. The frontend explicitly reads the published perspective.

## Validation commands

```sh
npm test
npm run typecheck
npm run slugs:check -- --dataset development
```

The release-time command `npm run slugs:check -- --dataset production` intentionally exits nonzero until production's legacy `Impressum` slug is migrated. Builds run the same audit with a temporary exception for that exact published document and spelling. New uppercase slugs, malformed slugs, missing published slugs, and cross-document collisions still fail the build.

To audit a raw export, including drafts, before an import or migration:

```sh
npm run slugs:check -- --snapshot .sanity-backups/content.ndjson
```

Studio validation does not constrain direct Content Lake API writes. Run this audit before imports and after automated writes. The build audit checks published content without requiring credentials.

## Snapshots and migration tooling

Raw production and development snapshots were taken on 31 October 2026. They are in the ignored `.sanity-backups/` directory, alongside route inventories and verification results. Production contained 198 documents, including 5 drafts; development contained 200 documents, including 6 drafts.

The raw exports preserve documents, draft state, asset records, and asset references. They do not contain asset binaries; the URL migration does not change assets.

To make a fresh raw export before a later migration:

```sh
npx sanity dataset export development .sanity-backups/development-before-migration.tar.gz --raw
```

The migration requires a locally authenticated Sanity CLI. It defaults to a dry run, requires an explicit dataset, uses revision-guarded patches in one transaction, and writes a backup of affected documents before applying. It changes only `slug.current`, never publishes drafts, and verifies the affected documents afterward. Running it again is a no-op.

```sh
npm run slugs:normalize -- --dataset development
```

## Current state

- Development: `Impressum` → `impressum` applied and verified. A subsequent dry run reports no changes.
- Production: dry run proposes the same one-document change. No production mutation has been applied; rollout is deferred until approval of the full result.
- Code: implemented, locally verified, and committed with the user's authorization on 1 November 2026. See `PROJECT_PLAN.md` for implementation commit references. No push or deployment performed as part of this work.

## Production release order

1. Complete development review of the full result and obtain the user's approval for production rollout. Commit only code explicitly locked in by the user. Take a fresh production backup and dry-run all planned content migrations against current production content; preserve owner edits and drafts rather than replacing production with development.
2. Deploy the compatible code while the production document still has `Impressum` as its slug.
3. Verify `/impressum` returns `200` with canonical `https://tapparo.com/impressum`; `/Impressum` and `/Impressum/` return `308` to it. Verify a story, menu, navigation, Studio, sitemap, and query-string preservation.
4. Refresh the production raw export and slug migration dry run:

   ```sh
   npx sanity dataset export production .sanity-backups/production-before-migration.tar.gz --raw
   npm run slugs:normalize -- --dataset production
   ```
5. Apply the production migration:

   ```sh
   npm run slugs:normalize -- --dataset production --apply --site https://tapparo.com
   ```

   The script refuses to migrate published page URLs unless their lowercase destinations already return `200` with the expected canonical URL on the production site. It also aborts on concurrent changes to affected documents.

6. Run the strict production audit and a second migration dry run. Both should report no pending changes.
7. Remove `--allow-legacy-case` from `prebuild` in `package.json` and remove its temporary exception in `scripts/check-slugs.ts`. Review that cleanup before committing it.
8. Verify production after cache revalidation, and update `PROJECT_PLAN.md` with the commit and release references.

Do not migrate production before the compatible route resolver is deployed: the old code matches slugs case-sensitively.

## Rollback and later URL changes

The migration backup records each affected document's previous content and slug. If a content rollback is needed, inspect the current document, then restore only its previous `slug.current` with a revision-guarded patch. Do not overwrite the entire dataset or replace an owner's intervening content edits.

Keep the lowercase-compatible resolver and redirects in service when rolling back other changes: clients may have cached the permanent redirect. Both uppercase and lowercase stored slugs work with the compatibility resolver.

Later substantive URL changes require an explicit old-path → new-path redirect, deployed before the CMS slug change. Case normalization alone does not preserve renamed URLs.

## Verification recorded for this implementation

- 11 automated tests cover redirects, exclusions, query preservation, German slug generation, manual validation, namespaces, collisions, draft/release identity, and case-only migration planning.
- TypeScript validation passes.
- A clean production build using the unchanged production dataset and a trailing-slash `NEXT_PUBLIC_SITE_URL` succeeds. Final verification used an isolated source copy because other development servers were writing to the workspace’s `.next` directory.
- HTTP checks against that build pass for all 14 public pages: homepage, menu, stories overview, 10 stories, and imprint.
- Every public page has its expected canonical URL. The sitemap has 14 unique clean URLs, and robots points to the correct sitemap.
- Case and trailing-slash redirects, encoded ASCII slugs, home aliases, RSC navigation, unknown-route 404s, Studio, and image assets were checked.
- Development migration verification confirmed a slug-only change and no draft publication.
- Before committing on 1 November 2026, all 11 tests, TypeScript validation, and the development published-slug audit passed again. The development audit reported no errors, warnings, or pending case changes.

Local detailed HTTP results: `.sanity-backups/url-http-verification.json`.
