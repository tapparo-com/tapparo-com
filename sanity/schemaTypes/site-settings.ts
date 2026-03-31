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
      description: "Displayed in the hero (as fallback if no logo), footer, and browser tab. Used in structured data for Google.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Shown below the logo in the hero section and on the Coming Soon page. Example: 'Focacceria • Daybar'",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "SVG file used in the hero (light color) and footer (dark color). Upload a single-color SVG — the site applies colors automatically.",
    }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      description: "Google Maps link shown as 'See map' in the footer. Opens in a new tab.",
    }),
    defineField({
      name: "isComingSoon",
      title: "Coming Soon Mode",
      type: "boolean",
      description: "When ON, the entire public site is replaced with a Coming Soon page. Only the Studio remains accessible.",
      initialValue: true,
    }),
    defineField({
      name: "comingSoonText",
      title: "Coming Soon Text",
      type: "text",
      rows: 3,
      description: "Message shown on the Coming Soon page below the restaurant name.",
      hidden: ({ parent }) => !parent?.isComingSoon,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      description: "Shown in the footer as a clickable mailto: link.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "Shown in the footer as a clickable tel: link. Include country code, e.g. +49 171 6542209",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Shown in the footer. Use line breaks for formatting.",
    }),
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      description: "Shown in the Intro section and the footer. Single source of truth — edit here, updates everywhere.",
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
      description: "Shown in the footer under 'Follow'. Each link opens in a new tab.",
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
                  { title: "WhatsApp", value: "whatsapp" },
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
          description: "Default browser tab title. Used when a page doesn't set its own. On other pages: 'Page Title — Tapparo'.",
        }),
        defineField({
          name: "description",
          title: "Default Meta Description",
          type: "text",
          rows: 3,
          description: "Default meta description for search engines. Used when a page doesn't set its own. Keep under 160 characters.",
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
