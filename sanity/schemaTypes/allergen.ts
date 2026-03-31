import { defineType, defineField } from "sanity";
import { ComponentIcon } from "@sanity/icons";

export const allergen = defineType({
  name: "allergen",
  title: "Allergen",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "string",
      description: 'Short code shown on menu, e.g. "G" for Gluten',
      validation: (rule) => rule.required().max(3),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'Full name, e.g. "Gluten"',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "code" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Allergen",
        subtitle: subtitle ? `Code: ${subtitle}` : undefined,
      };
    },
  },
});
