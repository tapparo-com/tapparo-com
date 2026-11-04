import { mkdirSync, writeFileSync } from "node:fs";
import { parseArgs, isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";
import { contactCopy, initialContactReasons } from "../lib/contact";

type Document = { _id: string; _rev: string; _type: string; _updatedAt?: string; pageLinks?: { _key: string; page?: { _ref: string } }[]; [key: string]: unknown };
async function main() {
  const { values } = parseArgs({ options: { apply: { type: "boolean", default: false } } });
  const client = getCliClient({ apiVersion: "2025-03-01" }).withConfig({ useCdn: false, perspective: "raw" });
  if (client.config().dataset !== "development" || client.config().projectId !== "64kcdhuf") throw new Error("This seed is development-only.");
  const routes = await client.fetch<Document[]>(`*[_type in ["page", "post", "legalPage"] && lower(slug.current) == "kontakt"]`);
  if (routes.length > 1 || (routes.length === 1 && (routes[0]._type !== "page" || routes[0]._id.startsWith("drafts.") || !(routes[0].sections as { _type: string }[] | undefined)?.some(section => section._type === "sectionContactForm")))) throw new Error("Kontakt already exists in a different form. Inspect it before continuing.");
  const legal = await client.fetch<{ _id: string } | null>(`*[_type == "legalPage" && slug.current == "impressum" && !(_id in path("drafts.**"))][0]{_id}`);
  if (!legal) throw new Error("Privacy page not found.");
  const navigation = await client.fetch<Document[]>(`*[_type in ["navigationHeader", "navigationFooter"] && !(_id in path("versions.**"))]`);
  console.log(JSON.stringify({ mode: values.apply ? "apply" : "dry run", dataset: "development", createPage: !routes.length, navigation: navigation.map(doc => doc._id) }));
  if (!values.apply) return;
  const revisions = await client.fetch<{ _id: string; _rev: string }[]>(`*[!(_type match "sanity.*") && !(_id in path("_.**"))]{_id,_rev}`);
  const backup = `.sanity-backups/contact/seed-${Date.now()}`;
  mkdirSync(".sanity-backups/contact", { recursive: true });
  writeFileSync(`${backup}-before.json`, JSON.stringify({ routes, navigation, revisions }, null, 2), { flag: "wx" });
  const page = routes[0] || await client.create({
    _type: "page", title: "Kontakt", slug: { _type: "slug", current: "kontakt" },
    seo: { title: "Kontakt & Catering", description: "Catering anfragen oder eine Frage an Tapparo stellen. Schreib uns – wir melden uns per E-Mail." },
    sections: [{ _key: "contact", _type: "sectionContactForm", ...contactCopy, reasons: initialContactReasons.map(reason => ({ ...reason, _type: "contactReason" })), privacyPage: { _type: "reference", _ref: legal._id } }],
  });
  let transaction = client.transaction();
  const changed: string[] = [];
  for (const document of navigation) {
    if (document.pageLinks?.some(link => link.page?._ref === page._id)) continue;
    changed.push(document._id);
    transaction = transaction.patch(document._id, patch => patch.ifRevisionId(document._rev).setIfMissing({ pageLinks: [] }).append("pageLinks", [{ _key: randomUUID().replaceAll("-", "").slice(0, 12), _type: "navPageLink", label: "Kontakt", page: { _type: "reference", _ref: page._id } }]));
  }
  if (changed.length) await transaction.commit();
  const after = await client.fetch<Document[]>(`*[_id in $ids]`, { ids: [page._id, ...navigation.map(doc => doc._id)] });
  const content = (doc: Document) => { const { _rev, _updatedAt, ...rest } = doc; return rest; };
  for (const original of navigation) {
    const actual = after.find(doc => doc._id === original._id)!;
    const expectedLinks = actual.pageLinks?.filter(link => link.page?._ref !== page._id);
    if (changed.includes(original._id) && !isDeepStrictEqual(content({ ...actual, pageLinks: expectedLinks }), content(original))) throw new Error(`Unexpected changes to ${original._id}; inspect ${backup}.`);
  }
  const afterRevisions = await client.fetch<{ _id: string; _rev: string }[]>(`*[!(_type match "sanity.*") && !(_id in path("_.**"))]{_id,_rev}`);
  if (revisions.some(old => !changed.includes(old._id) && afterRevisions.find(doc => doc._id === old._id)?._rev !== old._rev)) throw new Error("An unrelated document changed; inspect the snapshots.");
  writeFileSync(`${backup}-after.json`, JSON.stringify({ documents: after, revisions: afterRevisions }, null, 2));
  console.log(JSON.stringify({ pageId: page._id, changed, preserved: revisions.length - changed.length, backup }));
}
main().catch(error => { console.error(error instanceof Error ? error.message : "Seed failed"); process.exitCode = 1; });
