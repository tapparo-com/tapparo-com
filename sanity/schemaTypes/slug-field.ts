import { defineField, type SlugIsUniqueValidator } from "sanity";
import { publishedDocumentId, ROUTE_TYPES, slugifyTitle, validateSlug } from "../../lib/urls";

export const isUniqueSlug: SlugIsUniqueValidator = async (slug, context) => {
  const document = context.document;
  if (!document?._id) return false;
  const types = document._type === "menuCategory" ? ["menuCategory"] : [...ROUTE_TYPES];
  const matches = await context.getClient({ apiVersion: "2025-03-01" }).fetch<{ _id: string }[]>(
    `*[_type in $types && lower(slug.current) == $slug]{_id}`,
    { types, slug: slug.toLowerCase() },
    { perspective: "raw", useCdn: false },
  );
  // A draft and its published/release versions are the same logical document.
  return matches.every((match) => publishedDocumentId(match._id) === publishedDocumentId(document._id));
};

export function slugField(description: string) {
  return defineField({
    name: "slug",
    type: "slug",
    description,
    options: {
      source: "title",
      slugify: slugifyTitle,
      isUnique: isUniqueSlug,
    },
    validation: (rule) => rule.required().custom((value, context) =>
      validateSlug(value?.current, context.document?._type || "page")
    ),
  });
}
