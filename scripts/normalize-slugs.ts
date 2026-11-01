import { mkdirSync, writeFileSync } from "node:fs";
import { isDeepStrictEqual, parseArgs } from "node:util";
import { getCliClient } from "sanity/cli";
import { SLUG_TYPES, pathForSlug } from "../lib/urls";
import { auditSlugs, type SlugDocument } from "../sanity/lib/slug-audit";

async function main() {
  const { values } = parseArgs({ options: {
    dataset: { type: "string" },
    apply: { type: "boolean", default: false },
    site: { type: "string" },
  } });
  if (!values.dataset || !["development", "production"].includes(values.dataset)) {
    throw new Error("Specify --dataset development or --dataset production. Default mode is a dry run.");
  }
  const client = getCliClient({ apiVersion: "2025-03-01" }).withConfig({
    dataset: values.dataset, useCdn: false, perspective: "raw",
  });
  const documents = await client.fetch<SlugDocument[]>(
    `*[_type in $types]{_id, _rev, _type, title, slug}`, { types: SLUG_TYPES },
  );
  const report = auditSlugs(documents);
  console.log(JSON.stringify({ dataset: values.dataset, mode: values.apply ? "apply" : "dry run", ...report }, null, 2));
  if (report.errors.length) throw new Error("Resolve the reported errors before migrating. No documents changed.");
  if (!values.apply || !report.changes.length) return;

  // Never rename production content until its lowercase route is deployed and canonical.
  if (values.dataset === "production") {
    if (values.site !== "https://tapparo.com") {
      throw new Error("Production requires --site https://tapparo.com to verify the deployed compatibility fix.");
    }
    for (const change of report.changes.filter((change) => !change.id.startsWith("drafts.") && !change.id.startsWith("versions."))) {
      const document = documents.find((document) => document._id === change.id)!;
      if (document._type === "menuCategory") continue;
      const url = new URL(pathForSlug(change.after), values.site).href;
      const response = await fetch(url, { redirect: "manual" });
      const html = await response.text();
      const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/i)?.[0];
      if (response.status !== 200 || !canonical?.includes(`href="${url}"`)) {
        throw new Error(`Deploy and verify the URL fix first: ${url} must return 200 with its own canonical URL.`);
      }
    }
  }

  const ids = report.changes.map((change) => change.id);
  const before = await client.fetch<SlugDocument[]>(`*[_id in $ids]`, { ids });
  mkdirSync(".sanity-backups", { recursive: true });
  const backup = `.sanity-backups/${values.dataset}-slug-migration-${Date.now()}.json`;
  writeFileSync(backup, JSON.stringify({ projectId: client.config().projectId, dataset: values.dataset, changes: report.changes, documents: before }, null, 2), { flag: "wx" });

  let transaction = client.transaction();
  for (const change of report.changes) {
    if (!change.revision) throw new Error(`Missing revision for ${change.id}.`);
    transaction = transaction.patch(change.id, (patch) => patch
      .ifRevisionId(change.revision!)
      .set({ "slug.current": change.after }));
  }
  await transaction.commit();

  const after = await client.fetch<SlugDocument[]>(`*[_id in $ids]`, { ids });
  for (const original of before) {
    const change = report.changes.find((change) => change.id === original._id)!;
    const expected = { ...original, slug: { ...original.slug, current: change.after } };
    const actual = after.find((document) => document._id === original._id);
    const content = (document: SlugDocument & { _updatedAt?: string }) => {
      const { _rev, _updatedAt, ...fields } = document;
      return fields;
    };
    if (!actual || !isDeepStrictEqual(content(expected), content(actual))) {
      throw new Error(`Post-migration verification failed for ${original._id}. Review ${backup}.`);
    }
  }
  console.log(`Verified ${report.changes.length} slug-only changes. Drafts were not published. Backup: ${backup}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Slug migration failed.");
  process.exitCode = 1;
});
