import { slugField } from "./slug-field";
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
      description: "Name shown in the category dropdown and above this category's items. Changing it does not change the URL anchor.",
      validation: (rule) => rule.required(),
    }),
    slugField("Lowercase anchor used in menu navigation, e.g. 'focaccia'. Must be unique among menu categories."),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Optional text below the category heading. Line breaks are preserved; leave empty to hide it.",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      description: "Select published menu items and drag to order them. Items marked unavailable are hidden everywhere they are referenced. Edit names, prices, variants and allergens in the linked item documents.",
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
        "Optional add-ons after this category's items, in the order listed. These are local to this category, not reusable Menu Items.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description: "Add-on name displayed before its extra charge.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: "Display text for the extra charge, for example '0,50 €'. The website adds '+' automatically; do not enter another plus sign. Unlike item prices, this text is not reformatted.",
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
        "Optional images beside the item list on desktop and below it on smaller screens. Original proportions and selected crops are preserved. Drag to order. Multiple images get manual previous/next links; they do not autoplay.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          validation: (rule) =>
            rule
              .assetRequired()
              .error("Upload an image — items without an image are not shown on the website."),
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
