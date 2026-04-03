import { defineType, defineField, defineArrayMember } from "sanity";
import { MenuIcon } from "@sanity/icons";

// Shared item types used by both navigation and footer
const navPageLink = defineArrayMember({
  type: "object",
  name: "navPageLink",
  title: "Page Link",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Display text, e.g. 'Home', 'Menu', 'Stories'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "page",
      title: "Page",
      type: "reference",
      description: "Select an internal page.",
      to: [{ type: "page" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", slug: "page.slug.current" },
    prepare({ title, slug }) {
      return {
        title: title || "Page Link",
        subtitle: slug ? `/${slug}` : "No page selected",
      };
    },
  },
});

const navSocialLinks = defineArrayMember({
  type: "object",
  name: "navSocialLinks",
  title: "Social Links",
  description:
    "Includes all social links defined in Site Settings.",
  fields: [
    defineField({
      name: "placeholder",
      title: "Info",
      type: "string",
      readOnly: true,
      initialValue:
        "Renders all social links from Site Settings. Add or remove social links there.",
      description:
        "No configuration needed — links are pulled from Site Settings automatically.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Social Links",
        subtitle: "All social links from Site Settings",
      };
    },
  },
});

const navPhoneLink = defineArrayMember({
  type: "object",
  name: "navPhoneLink",
  title: "Phone Number",
  description:
    "Displays the phone number from Site Settings as a clickable call link.",
  fields: [
    defineField({
      name: "placeholder",
      title: "Info",
      type: "string",
      readOnly: true,
      initialValue:
        "Displays the phone number from Site Settings as a clickable call link.",
      description:
        "No configuration needed — the phone number is pulled from Site Settings.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Phone Number",
        subtitle: "Clickable tel: link from Site Settings",
      };
    },
  },
});

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "menuItems",
      title: "Navigation Links",
      type: "array",
      description:
        "Links shown in the menu overlay when a user clicks 'Menu'. Drag to reorder.",
      of: [navPageLink, navSocialLinks, navPhoneLink],
    }),
    defineField({
      name: "footerItems",
      title: "Footer Links",
      type: "array",
      description:
        "Page and social links shown in the site footer. Drag to reorder.",
      of: [navPageLink, navSocialLinks],
    }),
    defineField({
      name: "footerShowPhone",
      title: "Show Phone in Footer",
      type: "boolean",
      description: "Display the phone number from Site Settings in the footer contact column.",
      initialValue: true,
    }),
    defineField({
      name: "footerShowEmail",
      title: "Show Email in Footer",
      type: "boolean",
      description: "Display the email address from Site Settings in the footer contact column.",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Navigation" };
    },
  },
});
