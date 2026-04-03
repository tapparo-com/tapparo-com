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
      name: "heroImages",
      title: "Background Images",
      type: "array",
      description: "Full-screen background images that auto-rotate. Upload at least 1920×1080px for best quality. The logo and tagline from Site Settings are overlaid automatically.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for screen readers and SEO. Example: 'Bar counter with focaccia and wine glasses'" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hero" };
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
      description: "Large intro text. Use **bold** to highlight words in the accent color (red).",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "body",
      title: "Body Text",
      type: "text",
      rows: 4,
      description: "Paragraph text shown below the heading and 'View Menu' button.",
    }),
    defineField({
      name: "menuImage",
      title: "Menu Image",
      type: "image",
      description: "Illustration or photo shown on the left. Links to the menu page. Recommended aspect ratio 4:5 (portrait).",
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
      description: "Small label shown to the left of the images on desktop.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "Exactly 3 portrait photos. Displayed side by side on desktop, stacked on mobile. Recommended 4:5 ratio.",
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
      description: "Displayed in large editorial text.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Attribution shown in red before the quote on desktop, below on mobile. Use UPPERCASE for style.",
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
      description: "Large display text, no attribution. Same visual style as the Quote section.",
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
      description: "Auto-scrolling horizontal gallery. Upload a mix of landscape and portrait images for visual variety.",
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
      description: "Label shown above the blog card carousel. Example: 'OUR STORIES'.",
    }),
    defineField({
      name: "count",
      title: "Number of Posts",
      type: "number",
      initialValue: 6,
      description: "Number of recent blog posts to display. Cards are shown in a horizontal scroll.",
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
