import { defineType, defineField, defineArrayMember } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "restaurantName",
      title: "Restaurant Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "isComingSoon",
      title: "Coming Soon Mode",
      type: "boolean",
      description: "When enabled, the public site shows a coming soon page.",
      initialValue: true,
    }),
    defineField({
      name: "comingSoonText",
      title: "Coming Soon Text",
      type: "text",
      rows: 3,
      hidden: ({ parent }) => !parent?.isComingSoon,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Day",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "hours",
              title: "Hours",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "day", subtitle: "hours" },
          },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "TikTok", value: "tiktok" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),
    defineField({
      name: "seoDefaults",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Default Meta Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Default Meta Description",
          type: "text",
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
