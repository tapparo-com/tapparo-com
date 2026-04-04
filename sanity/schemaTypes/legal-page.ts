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
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL path, e.g. 'imprint' becomes tapparo.com/imprint",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Full page content. Supports headings, paragraphs, and inline images.",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      description: "Date shown on the page indicating when this legal text was last updated.",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
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
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
