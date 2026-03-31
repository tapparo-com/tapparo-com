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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pricingType",
      title: "Pricing Type",
      type: "string",
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
      description: "Toggle off for seasonal items that are currently unavailable",
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
