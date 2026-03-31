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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Used as the section anchor ID on the menu page",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
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
      description: 'Per-category extras like "Extra cheese +€1.00"',
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
