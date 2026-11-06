import { slugField } from "./slug-field";
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
      description: "Editor name and visible heading on ordinary pages, including Kontakt. Home does not display this title; its hero supplies the main heading. Renaming a page does not change its URL or navigation labels.",
      validation: (rule) => rule.required(),
    }),
    slugField("URL slug in lowercase, e.g. 'about'. 'home' identifies the homepage at /. Menu, stories, order, and system routes are reserved. Unique across pages, posts, and legal pages."),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      description: "Add, remove and drag sections to set page order. Each section has a fixed design and documents its editable content. Use Hero first on Home and one Contact Form per enquiry page. Header, footer and first-visit welcome are added automatically from shared settings.",
      of: allSectionTypes,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description: "Browser/search metadata for this page. These fields do not change the visible page heading or body.",
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Custom browser tab title, formatted with Site Settings > SEO > Title Template. If empty, ordinary pages use their page title; Home uses the site-wide Default Meta Title.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Search-engine summary, ideally under 160 characters. Home uses the site-wide default when empty. Other pages should have their own description; an empty field does not currently inherit that default.",
        }),
      ],
    }),
  ],
});
