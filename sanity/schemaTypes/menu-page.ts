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
      description: "Heading above the menu. Leave empty to use 'Speisekarte'. The page always lives at /menu.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Optional text below the heading. Leave empty to hide this introduction.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      description:
        "Select published categories with URL slugs and drag to order them. This sets both the category dropdown order and the sections below it. The dropdown, layout and allergen legend are added automatically.",
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
      description: "Browser/search metadata for this page. These fields do not change the visible page heading or body.",
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Custom browser tab title. Leave empty to use 'Speisekarte', with the shared title template. The visible page heading is a separate field.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Search-engine summary for /menu. Set it explicitly; an empty value does not currently inherit the site-wide description.",
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
