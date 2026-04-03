import { defineType, defineField, defineArrayMember } from "sanity";
import { BasketIcon } from "@sanity/icons";

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Item name as shown on the menu, e.g. 'Margherita'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Ingredients or short description shown below the item name in muted text.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      description: "Which menu category this item belongs to. The item appears under this category on the menu page.",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricingType",
      title: "Pricing Type",
      type: "string",
      description: "'Single Price' for items with one price. 'Price Variants' for items with sizes (e.g. S/L).",
      options: {
        list: [
          { title: "Single Price", value: "single" },
          { title: "Price Variants", value: "variants" },
        ],
        layout: "radio",
      },
      initialValue: "single",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      description: "Price in euros. Shown as '€X.XX' on the menu.",
      hidden: ({ parent }) => parent?.pricingType !== "single",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { pricingType?: string };
          if (parent?.pricingType === "single" && !value) {
            return "Price is required for single pricing";
          }
          return true;
        }),
    }),
    defineField({
      name: "priceVariants",
      title: "Price Variants",
      type: "array",
      description: "Multiple price options. Each needs a label (e.g. 'S', 'L') and a price.",
      hidden: ({ parent }) => parent?.pricingType !== "variants",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "price" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Variant",
                subtitle: subtitle ? `€${subtitle}` : undefined,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "allergens",
      title: "Allergens",
      type: "array",
      description: "Select from the allergen list. Shown as small circular badges (e.g. G, D, N) next to the item.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "allergen" }],
        }),
      ],
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      description: "When OFF, this item is hidden from the menu page. Use for seasonal items that are temporarily unavailable.",
      initialValue: true,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      description: "Order within the category. Lower numbers appear first.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
});
