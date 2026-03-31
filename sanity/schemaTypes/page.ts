import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";
import { allSectionTypes } from "./sections";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal name for this page. Also shown as a heading on non-menu pages.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path for this page, e.g. 'menu' becomes tapparo.com/menu. The slug 'home' is reserved for the homepage (served at tapparo.com/).",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "Drag to reorder. The footer is added automatically — no need to include it here.",
      of: allSectionTypes,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Custom browser tab title. If empty, falls back to the page title. Appears as: 'Your Title — Tapparo'.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Custom meta description for search engines. Keep under 160 characters. If empty, uses the site-wide default from Site Settings.",
        }),
      ],
    }),
  ],
});
