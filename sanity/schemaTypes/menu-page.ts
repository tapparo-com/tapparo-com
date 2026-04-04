import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";

export const menuPage = defineType({
  name: "menuPage",
  title: "Menu",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Page heading shown above the menu, e.g. Menu",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional introductory text below the title",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      description:
        "Menu categories shown on the menu page. Drag to reorder — this determines the tab order.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "menuCategory" }],
        }),
      ],
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
          description: "Custom browser tab title. If empty, uses 'Menu'.",
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
      return { title: "Menu" };
    },
  },
});
