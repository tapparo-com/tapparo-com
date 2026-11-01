import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";
import { SLUG_TYPES } from "../lib/urls";
import { auditSlugs, type SlugDocument } from "../sanity/lib/slug-audit";

async function main() {
  loadEnvConfig(process.cwd());
  const { values } = parseArgs({ options: {
    dataset: { type: "string" },
    snapshot: { type: "string" },
    "allow-legacy-case": { type: "boolean", default: false },
  } });
  const dataset = values.dataset || process.env.NEXT_PUBLIC_SANITY_DATASET;
  const documents = values.snapshot
    ? readFileSync(values.snapshot, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line) as SlugDocument)
    : await createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        dataset,
        apiVersion: "2025-03-01",
        useCdn: false,
        perspective: "published",
      }).fetch<SlugDocument[]>(`*[_type in $types]{_id, _rev, _type, title, slug}`, { types: SLUG_TYPES });
  const report = auditSlugs(documents);
  console.log(JSON.stringify({ source: values.snapshot || `${dataset} (published)`, ...report }, null, 2));
  // The compatibility release must build before this one known document is migrated.
  // New uppercase slugs still fail the build. Remove the exception after rollout.
  const unexpectedCaseChanges = report.changes.filter((change) => !(
    values["allow-legacy-case"] &&
    change.id === "af46cbb8-5fc8-4c34-bfa5-dc2109805a84" &&
    change.before === "Impressum" && change.after === "impressum"
  ));
  if (report.errors.length || unexpectedCaseChanges.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Slug audit failed.");
  process.exitCode = 1;
});
