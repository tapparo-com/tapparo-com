import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const storiesPage = defineType({
  name: "storiesPage",
  title: "Stories",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Page heading, e.g. Stories",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional introductory text below the title",
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
          description: "Custom browser tab title. If empty, uses 'Stories'.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Custom meta description for search engines.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Stories" };
    },
  },
});
