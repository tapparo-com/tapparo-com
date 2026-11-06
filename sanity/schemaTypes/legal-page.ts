import { slugField } from "./slug-field";
import { defineType, defineField, defineArrayMember } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Page heading, e.g. Imprint, Privacy Policy",
      validation: (rule) => rule.required(),
    }),
    slugField("Lowercase URL slug, e.g. 'impressum'. Must be unique across pages, posts, and legal pages."),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Full legal text with headings, paragraphs, lists, links and inline images. The website builds jump links from main headings automatically. An identical opening page-title heading is displayed only once; section spacing and type sizes are fixed.",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
          ],
        }),
      ],
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      description: "Date displayed as 'Stand' above the legal text. Update it when revising the content; it does not automatically follow the document's last edit time.",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
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
          description: "Browser tab title. Leave empty to use the legal page title with the shared title template.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Search-engine summary for this legal page. Set it explicitly; an empty value does not currently inherit the site-wide description.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
