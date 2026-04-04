import { defineType, defineField, defineArrayMember } from "sanity";
import {
  CogIcon,
  EnvelopeIcon,
  ClockIcon,
  UsersIcon,
  SearchIcon,
} from "@sanity/icons";

export const settingsBrand = defineType({
  name: "settingsBrand",
  title: "Brand",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "restaurantName",
      title: "Restaurant Name",
      type: "string",
      description:
        "Displayed in the hero, header, footer, and browser tab. Used in structured data for Google.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "Shown below the logo in the hero section and on the Coming Soon page.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "SVG file used in the hero (light) and header/footer (dark). Upload a single-color SVG — the site applies colors automatically.",
    }),
    defineField({
      name: "supportingLogo",
      title: "Supporting Logo",
      type: "image",
      description:
        "Illustrative graphic used on the 404 page. Upload an SVG or PNG with a transparent background.",
    }),
    defineField({
      name: "supportingLogoTagline",
      title: "Supporting Logo with Tagline",
      type: "image",
      description:
        "Logo variant that includes the tagline (e.g. Tapparo + Focacceria . Daybar). Used on the Coming Soon page. Upload an SVG or PNG with a transparent background.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Brand" };
    },
  },
});

export const settingsContact = defineType({
  name: "settingsContact",
  title: "Contact",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
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
      description:
        "Shown in the footer and menu overlay as a clickable tel: link. Include country code, e.g. +49 89 27279100.",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Shown in the footer. Use line breaks for formatting.",
    }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      description:
        "Google Maps link shown as 'Maps' in the footer. Opens in a new tab.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact" };
    },
  },
});

export const settingsHours = defineType({
  name: "settingsHours",
  title: "Opening Hours",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "openingHours",
      title: "Opening Hours",
      type: "array",
      description:
        "Shown in the SubHero section and the footer. Single source of truth — edit here, updates everywhere.",
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
  ],
  preview: {
    prepare() {
      return { title: "Opening Hours" };
    },
  },
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Display name, e.g. 'Instagram', 'WhatsApp', 'TikTok'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      description: "Must be a valid https URL.",
      validation: (rule) =>
        rule.required().custom((url) =>
          !url || url.startsWith("https://")
            ? true
            : "URL must start with https://"
        ),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "url" },
  },
});

export const settingsSeo = defineType({
  name: "settingsSeo",
  title: "SEO",
  type: "document",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "isComingSoon",
      title: "Coming Soon Mode",
      type: "boolean",
      description:
        "When ON, the entire public site is replaced with a Coming Soon page. Only the Studio remains accessible.",
      initialValue: false,
    }),
    defineField({
      name: "comingSoonBody",
      title: "Coming Soon Body",
      type: "array",
      description:
        "Text shown on the Coming Soon page below the logo. Displayed in large type.",
      of: [{ type: "block" }],
      hidden: ({ document }) => !document?.isComingSoon,
    }),
    defineField({
      name: "comingSoonShowAddress",
      title: "Show Address",
      type: "boolean",
      description: "Display the address from Site Settings > Contact on the Coming Soon page.",
      initialValue: false,
      hidden: ({ document }) => !document?.isComingSoon,
    }),
    defineField({
      name: "comingSoonSocialLinks",
      title: "Coming Soon Social Links",
      type: "array",
      description:
        "Social links shown on the Coming Soon page. Pick from Site Settings > Social Links.",
      of: [{ type: "reference", to: [{ type: "socialLink" }] }],
      hidden: ({ document }) => !document?.isComingSoon,
    }),
    defineField({
      name: "titleTemplate",
      title: "Title Template",
      type: "string",
      description:
        'Pattern for browser tab titles. Use %s as a placeholder for the page title, e.g. "%s — Tapparo" produces "Menu — Tapparo".',
      placeholder: "%s — Tapparo",
    }),
    defineField({
      name: "metaTitle",
      title: "Default Meta Title",
      type: "string",
      description:
        "Default browser tab title. Used when a page doesn't set its own.",
    }),
    defineField({
      name: "metaDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      description:
        "Default meta description for search engines. Keep under 160 characters.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "SEO" };
    },
  },
});
