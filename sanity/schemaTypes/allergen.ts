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
      description:
        "Short code shown as a link beside menu items, e.g. 'G'. It also identifies this entry in the automatic allergen legend. Keep codes consistent when reusing allergens across items.",
      validation: (rule) => rule.required().max(3),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "Full name in the allergen legend and the item link's accessible label, e.g. 'Gluten'. There is no hover tooltip. The legend lists all published allergens, sorted by code.",
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
