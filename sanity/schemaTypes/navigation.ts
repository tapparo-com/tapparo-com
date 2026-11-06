import { defineType, defineField, defineArrayMember } from "sanity";
import { MenuIcon, ComposeIcon } from "@sanity/icons";

// Shared page link type
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
      description: "Select an internal page, story, or legal page.",
      to: [
        { type: "page" },
        { type: "post" },
        { type: "legalPage" },
        { type: "menuPage" },
        { type: "storiesPage" },
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      slug: "page.slug.current",
      pageType: "page._type",
    },
    prepare({ title, slug, pageType }) {
      const resolvedSlug =
        pageType === "menuPage"
          ? "menu"
          : pageType === "storiesPage"
            ? "stories"
            : slug;
      return {
        title: title || "Page Link",
        subtitle: resolvedSlug ? `/${resolvedSlug}` : "No page selected",
      };
    },
  },
});

export const navigationHeader = defineType({
  name: "navigationHeader",
  title: "Header Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "pageLinks",
      title: "Pages",
      type: "array",
      description:
        "Page links in the navigation overlay. Drag to reorder. The site inserts 'Jetzt bestellen' immediately after Home (or first if Home is absent), linking via /order to Degaso. Its label and destination are fixed and are not edited in this list.",
      of: [navPageLink],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      description:
        "Select shared Social Link documents and drag to order them. They follow the page links with the same visual weight and open in new tabs. Creating a Social Link alone does not add it to navigation.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "socialLink" }],
        }),
      ],
    }),
    defineField({
      name: "showPhone",
      title: "Show Phone Number",
      type: "boolean",
      description:
        "Display the phone number from Site Settings > Contact in the menu overlay.",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Header Navigation" };
    },
  },
});

export const navigationFooter = defineType({
  name: "navigationFooter",
  title: "Footer",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "pageLinks",
      title: "Pages",
      type: "array",
      description:
        "Links in the footer's 'Entdecken' group. Drag to reorder. Opening hours and contact details come from Site Settings; group headings, column layout, wordmark and 'nach oben' action are fixed by the site.",
      of: [navPageLink],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      description:
        "Links in the footer's 'Im Netz' group. Select shared Social Link documents and drag to order them. These are independent of the header and Coming Soon selections.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "socialLink" }],
        }),
      ],
    }),
    defineField({
      name: "showPhone",
      title: "Show Phone in Footer",
      type: "boolean",
      description:
        "Display the phone number from Site Settings > Contact in the footer.",
      initialValue: true,
    }),
    defineField({
      name: "showEmail",
      title: "Show Email in Footer",
      type: "boolean",
      description:
        "Display the email address from Site Settings > Contact in the footer.",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer" };
    },
  },
});
