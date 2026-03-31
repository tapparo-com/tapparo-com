import { defineField, defineArrayMember } from "sanity";
import {
  ImageIcon,
  BlockContentIcon,
  DocumentTextIcon,
  PlayIcon,
  TagIcon,
  ComponentIcon,
  StarIcon,
  BlockquoteIcon,
} from "@sanity/icons";

export const sectionHero = defineArrayMember({
  type: "object",
  name: "sectionHero",
  title: "Hero",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "SVG logo overlay on the hero",
    }),
    defineField({
      name: "heroImages",
      title: "Background Images",
      type: "array",
      description: "Carousel images — auto-rotate in background",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: 'e.g. "Focacceria • Daybar"',
    }),
  ],
  preview: {
    select: { subtitle: "tagline" },
    prepare({ subtitle }) {
      return { title: "Hero", subtitle };
    },
  },
});

export const sectionIntro = defineArrayMember({
  type: "object",
  name: "sectionIntro",
  title: "Intro",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "array",
      description:
        "Use bold for accent-colored text",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "menuImage",
      title: "Menu Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Intro" };
    },
  },
});

export const sectionMoodImages = defineArrayMember({
  type: "object",
  name: "sectionMoodImages",
  title: "Image Grid",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Label",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "3 portrait images (4:5 ratio)",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: { subtitle: "title" },
    prepare({ subtitle }) {
      return { title: "Image Grid", subtitle };
    },
  },
});

export const sectionQuote = defineArrayMember({
  type: "object",
  name: "sectionQuote",
  title: "Quote",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
  ],
  preview: {
    select: { subtitle: "author" },
    prepare({ subtitle }) {
      return { title: "Quote", subtitle };
    },
  },
});

export const sectionLargeText = defineArrayMember({
  type: "object",
  name: "sectionLargeText",
  title: "Large Text",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "text",
      title: "Display Text",
      type: "text",
      rows: 4,
    }),
  ],
  preview: {
    select: { subtitle: "text" },
    prepare({ subtitle }) {
      return {
        title: "Large Text",
        subtitle: subtitle?.slice(0, 60),
      };
    },
  },
});

export const sectionGallery = defineArrayMember({
  type: "object",
  name: "sectionGallery",
  title: "Gallery",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Gallery" };
    },
  },
});

export const sectionStories = defineArrayMember({
  type: "object",
  name: "sectionStories",
  title: "Stories",
  icon: StarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "OUR STORIES"',
    }),
    defineField({
      name: "count",
      title: "Number of Posts",
      type: "number",
      initialValue: 6,
      description: "How many recent posts to show",
    }),
  ],
  preview: {
    select: { subtitle: "heading" },
    prepare({ subtitle }) {
      return { title: "Stories", subtitle };
    },
  },
});

export const sectionRichText = defineArrayMember({
  type: "object",
  name: "sectionRichText",
  title: "Rich Text",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Rich Text" };
    },
  },
});

export const sectionMenuHeader = defineArrayMember({
  type: "object",
  name: "sectionMenuHeader",
  title: "Menu Header",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { subtitle: "title" },
    prepare({ subtitle }) {
      return { title: "Menu Header", subtitle };
    },
  },
});

export const sectionMenuCategories = defineArrayMember({
  type: "object",
  name: "sectionMenuCategories",
  title: "Menu Categories",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "placeholder",
      title: "Info",
      type: "string",
      readOnly: true,
      initialValue: "This section renders all menu categories and items automatically.",
      description: "No configuration needed — categories are pulled from the Menu collection.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Menu Categories (auto)" };
    },
  },
});

export const allSectionTypes = [
  sectionHero,
  sectionIntro,
  sectionMoodImages,
  sectionQuote,
  sectionLargeText,
  sectionGallery,
  sectionStories,
  sectionRichText,
  sectionMenuHeader,
  sectionMenuCategories,
];
