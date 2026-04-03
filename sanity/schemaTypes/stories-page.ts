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
  ],
  preview: {
    prepare() {
      return { title: "Stories" };
    },
  },
});
