import { defineField, defineArrayMember } from "sanity";
import {
  ImageIcon,
  BlockContentIcon,
  DocumentTextIcon,
  PlayIcon,
  StarIcon,
  BlockquoteIcon,
} from "@sanity/icons";

// Reusable button array member — opens in a modal when editing
const buttonLink = defineArrayMember({
  type: "object",
  name: "buttonLink",
  title: "Button",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Text shown on the button, e.g. 'View the menu'.",
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
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      description: "Visual style of the button.",
      options: {
        list: [
          { title: "Filled (accent background)", value: "filled" },
          { title: "Outline (accent border)", value: "outline" },
        ],
        layout: "radio",
      },
      initialValue: "filled",
    }),
  ],
  preview: {
    select: { title: "label", slug: "page.slug.current", pageType: "page._type" },
    prepare({ title, slug, pageType }) {
      const resolvedSlug =
        pageType === "menuPage"
          ? "menu"
          : pageType === "storiesPage"
            ? "stories"
            : slug;
      return {
        title: title || "Button",
        subtitle: resolvedSlug ? `/${resolvedSlug}` : "No page selected",
      };
    },
  },
});

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

export const sectionSubhero = defineArrayMember({
  type: "object",
  name: "sectionSubhero",
  title: "SubHero",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "string",
      description: "Small uppercase label shown in the left column on desktop, e.g. 'ABOUT'.",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "array",
      description: "Large intro text. Use **bold** to highlight words in the accent color (red).",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Illustration or photo displayed alongside the text. Portrait orientation recommended (roughly 3:4 ratio).",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "button",
      title: "Button",
      type: "array",
      description: "Optional call-to-action button. Add one to display it below the heading.",
      of: [buttonLink],
      validation: (rule) => rule.max(1).error("Only one button allowed."),
    }),
    defineField({
      name: "showOpeningHours",
      title: "Show Opening Hours",
      type: "boolean",
      description: "Toggle to display opening hours from Site Settings below the content.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { subtitle: "label" },
    prepare({ subtitle }) {
      return { title: "SubHero", subtitle };
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
      name: "author",
      title: "Author",
      type: "string",
      description: "Attribution shown in accent color above the quote text.",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "Large editorial text displayed next to the image.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Square image shown alongside the quote. Recommended 1:1 ratio.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
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
      description: "Portrait images displayed in a horizontal row that bleeds off-screen. Recommended 3:4 ratio, at least 4 images.",
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
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Large text shown below the image row.",
    }),
  ],
  preview: {
    select: { subtitle: "caption" },
    prepare({ subtitle }) {
      return { title: "Gallery", subtitle };
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
      title: "Section Label",
      type: "string",
      description: "Small uppercase label shown in the left column, e.g. 'OUR STORIES'.",
    }),
    defineField({
      name: "pinnedStory",
      title: "Pinned Story",
      type: "reference",
      description: "Optional. Pick a story to always show first in the grid. Leave empty to sort by date only.",
      to: [{ type: "post" }],
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

// Button variant without a page reference — link comes from the parent section
const storyButton = defineArrayMember({
  type: "object",
  name: "storyButton",
  title: "Button",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Text shown on the button, e.g. 'Learn more'.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      description: "Visual style of the button.",
      options: {
        list: [
          { title: "Filled (accent background)", value: "filled" },
          { title: "Outline (accent border)", value: "outline" },
        ],
        layout: "radio",
      },
      initialValue: "outline",
    }),
  ],
  preview: {
    select: { title: "label" },
    prepare({ title }) {
      return { title: title || "Button" };
    },
  },
});

export const sectionStoryHighlight = defineArrayMember({
  type: "object",
  name: "sectionStoryHighlight",
  title: "Story Highlight",
  icon: StarIcon,
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "string",
      description: "Small uppercase label shown in the left column on desktop, e.g. 'HIGHLIGHT'.",
    }),
    defineField({
      name: "story",
      title: "Story",
      type: "reference",
      description: "Select a blog post to highlight. Its title, excerpt, and cover image are used automatically.",
      to: [{ type: "post" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleOverride",
      title: "Title Override",
      type: "string",
      description: "Leave empty to use the post's title. Set a value to override it.",
    }),
    defineField({
      name: "excerptOverride",
      title: "Excerpt Override",
      type: "text",
      rows: 4,
      description: "Leave empty to use the post's excerpt. Set a value to override it.",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button Label",
      type: "string",
      description: "Text shown on the button, e.g. 'Learn more'. Links to the selected story.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "label", storyTitle: "story.title" },
    prepare({ subtitle, storyTitle }) {
      return {
        title: "Story Highlight",
        subtitle: subtitle || storyTitle,
      };
    },
  },
});

export const sectionText = defineArrayMember({
  type: "object",
  name: "sectionText",
  title: "Text + Image",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "string",
      description:
        "Small uppercase label shown in the left column on desktop.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Rich text content. Supports headings, bold, italic, and links.",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Square image displayed alongside the text. Recommended 1:1 ratio.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "imageFirst",
      title: "Image First",
      type: "boolean",
      description:
        "When enabled, the image appears on the left (desktop) or top (mobile). When disabled, the text comes first.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { subtitle: "label" },
    prepare({ subtitle }) {
      return { title: "Text + Image", subtitle };
    },
  },
});

export const allSectionTypes = [
  sectionHero,
  sectionSubhero,
  sectionStoryHighlight,
  sectionMoodImages,
  sectionQuote,
  sectionLargeText,
  sectionGallery,
  sectionStories,
  sectionRichText,
  sectionText,
];
