export { settingsHours } from "./opening-hours";
import { defineType, defineField } from "sanity";
import {
  CogIcon,
  EnvelopeIcon,
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
        "Brand text used in accessible labels, logo fallbacks and restaurant search data. It does not rewrite uploaded logo artwork. Browser tab titles are controlled under SEO and individual pages.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description:
        "Read with the restaurant name in the hero's screen-reader heading and used in restaurant search data. It is not the hero's visible Short introduction. The welcome and Coming Soon logo use uploaded artwork, not this text.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "Shared hero, header/menu and footer wordmark. Use a dark, single-color SVG on a transparent background; the footer requires SVG artwork. The header may invert it over photographs. Intro artwork is separate under Site Settings > Page Intro.",
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
      description: "Public email link in the footer (when enabled there) and the contact form fallback. This does not change the enquiry form recipient or activate delivery; those are managed separately in server configuration.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description:
        "Phone link shown when enabled separately in Navigation > Header and Navigation > Footer. Include the country code, e.g. +49 89 27279100.",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Shared address in the hero, navigation overlay and footer, and optionally Coming Soon. Line breaks are preserved in the footer. Edit the map destination separately below.",
    }),
    defineField({
      name: "mapUrl",
      title: "Map URL",
      type: "url",
      description:
        "Destination for the hero/navigation address link and the footer's 'Route planen' link. Opens in a new tab. Leave empty to keep the address as plain text and hide the footer map link.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact" };
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
        "Replace regular site pages with the Coming Soon screen. This does not disable the Studio or online-order redirect. The Coming Soon layout and label are fixed; edit its body, address visibility and social selection below.",
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
        "Fallback title for Home when Home has no SEO title. Other page types normally supply their own title. Changing the restaurant name does not change this field.",
    }),
    defineField({
      name: "metaDescription",
      title: "Default Meta Description",
      type: "text",
      rows: 3,
      description:
        "Fallback search summary for Home when Home has no SEO description. Other page types should have their own descriptions. Aim for fewer than 160 characters.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "SEO" };
    },
  },
});
