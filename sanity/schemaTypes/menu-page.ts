import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";

export const menuPage = defineType({
  name: "menuPage",
  title: "Menu",
  type: "document",
  icon: TagIcon,
  fields: [
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
  ],
  preview: {
    prepare() {
      return { title: "Menu" };
    },
  },
});
