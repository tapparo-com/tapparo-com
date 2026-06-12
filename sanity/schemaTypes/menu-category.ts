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
      description: "Category name shown in the sidebar and tabs, e.g. 'Classica'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Used for anchor links in the tab navigation.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Short description shown below the category title in the sidebar.",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      description: "Pick menu items for this category. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "menuItem" }],
        }),
      ],
    }),
    defineField({
      name: "extras",
      title: "Extras",
      type: "array",
      description:
        "Add-ons shown at the bottom of this category, e.g. 'Oat milk +€0.50'.",
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
              description: "e.g. '€0.50'",
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
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Square images for this category. If multiple are added, arrow navigation appears.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          validation: (rule) =>
            rule
              .assetRequired()
              .error("Upload an image — items without an image are not shown on the website."),
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
