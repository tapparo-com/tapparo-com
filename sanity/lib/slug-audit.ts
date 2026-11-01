import { publishedDocumentId, ROUTE_TYPES, SLUG_TYPES, validateSlug } from "../../lib/urls";

export type SlugDocument = {
  _id: string;
  _rev?: string;
  _type: string;
  title?: string;
  slug?: { current?: string };
};

export type SlugChange = { id: string; revision?: string; before: string; after: string };
export type SlugIssue = { id: string; message: string };

/** Shared by the read-only audit and the case-only migration. Never slugifies live URLs. */
export function auditSlugs(documents: SlugDocument[]) {
  const errors: SlugIssue[] = [];
  const warnings: SlugIssue[] = [];
  const changes: SlugChange[] = [];
  const paths = new Map<string, Set<string>>();

  for (const document of documents) {
    if (!(SLUG_TYPES as readonly string[]).includes(document._type)) continue;
    const slug = document.slug?.current;
    const id = publishedDocumentId(document._id);
    if (!slug && document._id.startsWith("drafts.")) {
      warnings.push({ id: document._id, message: "Unfinished draft has no slug; left untouched." });
      continue;
    }
    const lowercase = slug?.toLowerCase();
    const validation = validateSlug(lowercase, document._type);
    if (validation !== true) {
      errors.push({ id: document._id, message: validation });
      continue;
    }
    const namespace = (ROUTE_TYPES as readonly string[]).includes(document._type) ? "page" : "menu-anchor";
    const key = `${namespace}:${lowercase}`;
    const ids = paths.get(key) || new Set<string>();
    ids.add(id);
    paths.set(key, ids);
    if (slug !== lowercase) {
      changes.push({ id: document._id, revision: document._rev, before: slug!, after: lowercase! });
    }
  }
  for (const [path, ids] of paths) {
    if (ids.size > 1) errors.push({ id: [...ids].join(", "), message: `Slug collision at ${path}.` });
  }
  return { errors, warnings, changes };
}
