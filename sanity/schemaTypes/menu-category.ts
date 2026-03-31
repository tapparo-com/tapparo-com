import { defineType, defineField, defineArrayMember } from "sanity";
import { TagIcon } from "@sanity/icons";

export const menuCategory = defineType({
  name: "menuCategory",
  title: "Menu Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Category name shown as a heading on the menu page, e.g. 'Focaccia Classica'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Used for the anchor link in the category navigation. Auto-generated from the title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Short subtitle shown next to the category heading.",
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      description: "Visual grouping — currently informational, may be used for styling in the future.",
      options: {
        list: [
          { title: "Classica", value: "classica" },
          { title: "Speciale", value: "speciale" },
          { title: "Stagionale", value: "stagionale" },
          { title: "Beverage", value: "beverage" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "extras",
      title: "Extras",
      type: "array",
      description: "Add-ons shown at the bottom of this category, e.g. 'Extra cheese +€1.00'.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
          },
        }),
      ],
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first on the menu page. Use 0, 1, 2, 3... to set the order.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
