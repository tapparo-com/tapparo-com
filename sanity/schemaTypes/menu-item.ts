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
      description: "Item name as shown on the menu.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Ingredients or short description.",
    }),
    defineField({
      name: "pricingType",
      title: "Pricing Type",
      type: "string",
      description: "Choose one euro price or a list of labelled variants. This selects which price fields appear on the menu; it does not create ordering options in Degaso.",
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
      description: "Numeric price in euros, for example 4.5. The website formats it as '4,50 €'. Leave empty for an item without a displayed price; zero displays as '0,00 €'.",
      hidden: ({ parent }) => parent?.pricingType !== "single",
    }),
    defineField({
      name: "priceVariants",
      title: "Price Variants",
      type: "array",
      description: "Multiple price options, e.g. S €5.50, L €7.50.",
      hidden: ({ parent }) => parent?.pricingType !== "variants",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Variant name shown beside its price, for example 'small' or '0.2 l'. Drag variants to set their order.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
              description: "Numeric euro amount for this variant. Currency and decimal formatting are added by the website.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "price" },
            prepare({ title, subtitle }) {
              return {
                title: title || "Variant",
                subtitle: subtitle != null ? `€${subtitle}` : undefined,
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
      description: "Select from the allergen list.",
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
      description: "When OFF, this item is hidden from the menu.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", price: "price" },
    prepare({ title, price }) {
      return {
        title: title || "Menu Item",
        subtitle: price != null ? `€${price}` : undefined,
      };
    },
  },
});
