import { parseArgs } from "node:util";
import { getCliClient } from "sanity/cli";
import { prepareHoursMigration } from "../sanity/lib/hours-migration";

async function main() {
  const { values } = parseArgs({ options: { dataset: { type: "string" } } });
  if (!values.dataset || !["development", "production"].includes(values.dataset)) throw new Error("Specify --dataset development or production. This command only reads and never applies changes.");
  const client = getCliClient({ apiVersion: "2025-03-01" }).withConfig({ dataset: values.dataset, useCdn: false, perspective: "raw" });
  const documents = await client.fetch('*[_type == "settingsHours"]');
  console.log(JSON.stringify({ dataset: values.dataset, mode: "read-only", documents: documents.map((document: any) => ({
    id: document._id, revision: document._rev, setIfMissing: prepareHoursMigration(document),
    draftOrVersion: document._id.startsWith("drafts.") || document._id.startsWith("versions."),
  })) }, null, 2));
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Hours migration audit failed."); process.exitCode = 1; });
