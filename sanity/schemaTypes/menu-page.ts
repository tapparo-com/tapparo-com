import { defineType, defineField } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const menuPage = defineType({
  name: "menuPage",
  title: "Menu Page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Menu Page" };
    },
  },
});
