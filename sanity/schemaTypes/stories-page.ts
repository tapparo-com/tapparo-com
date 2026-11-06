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
      description:
        "Heading for the automatic Stories overview at /stories. Leave empty to use 'Stories'. Manage the cards under Stories > Posts; this page does not have a section builder or manual post ordering.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description:
        "Optional text below the page heading. Leave empty to hide it.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      description:
        "Browser/search metadata for this page. These fields do not change the visible page heading or body.",
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
          description:
            "Search-engine summary for /stories. Set it explicitly; an empty value does not currently inherit the site-wide description.",
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
