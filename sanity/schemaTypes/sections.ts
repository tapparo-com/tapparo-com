import { defineField, defineArrayMember } from "sanity";
import { HERO_IMAGE_DURATION } from "../../lib/animation";
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
      description: "Text shown on the link, e.g. 'speisekarte'.",
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
      // Retain legacy data; About now has one consistent underlined link style.
      hidden: true,
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
      name: "tickerPhrases",
      title: "Ticker phrases",
      type: "array",
      description: "Add one word or phrase per entry and drag to reorder. Bullet separators and spacing are added automatically. Leave empty to hide the ticker.",
      of: [defineArrayMember({
        type: "string",
        validation: (rule) => rule.required().custom((value) => {
          if (!value?.trim()) return "Enter a word or phrase.";
          if (/[•·]/.test(value)) return "Add each phrase separately. Bullet separators are added automatically.";
          return true;
        }),
      })],
    }),
    defineField({
      name: "heroImages",
      title: "Carousel images",
      type: "array",
      description: "Choose the leading hero photographs and drag to set their order. The first is shown first; one image stays still. Use large, sharp photos (at least 1920 px wide) and set the crop/hotspot for responsive screens. Set the time between images below.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          validation: (rule) =>
            rule
              .assetRequired()
              .error("Upload an image — items without an image are not shown on the website."),
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for screen readers and SEO. Example: 'Bar counter with focaccia and wine glasses'", validation: rule => rule.required().warning("Describe the photograph for screen readers.") }),
          ],
        }),
      ],
    }),
    defineField({
      name: "imageDuration",
      title: "Image duration (seconds)",
      type: "number",
      initialValue: HERO_IMAGE_DURATION.default,
      description: "Time from one image change to the next, including the short crossfade. Leave empty for 1.2 seconds. Choose 1.2–15 seconds; playback waits for images to load and stays still with reduced motion or a single image.",
      validation: rule => rule.min(HERO_IMAGE_DURATION.min).max(HERO_IMAGE_DURATION.max).precision(1),
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
      title: "Section name",
      type: "string",
      description: "Names this section in the editor and for screen readers. No visible overline is displayed.",
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
      title: "First image",
      type: "image",
      description: "The first image above the introduction. Its proportions and chosen crop are preserved, so menu artwork stays fully visible. If a menu button is selected, this image also links to that page.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryImage",
      title: "Second image",
      type: "image",
      description: "Optional companion photograph above the text. Displayed in a landscape frame; use the crop and hotspot to keep the subject in view. On mobile both images stack before the introduction.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe this photograph for screen readers.", validation: rule => rule.required().warning("Add a description for screen readers.") }),
      ],
    }),
    defineField({
      name: "button",
      title: "Button",
      type: "array",
      description: "Optional link below the introduction, with an animated hand-drawn underline. Choose the text and destination; its appearance is set by the design.",
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
      description: "Optional heading above the image composition.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "Choose up to 3 photographs and drag to reorder. Images keep their proportions in an offset composition, stacked on mobile. Small files remain small details.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          validation: (rule) =>
            rule
              .assetRequired()
              .error("Upload an image — items without an image are not shown on the website."),
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
      description: "Attribution shown below the quote.",
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
      description: "Optional image alongside the quote. Its proportions and chosen crop are preserved.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryImage",
      title: "Second image",
      type: "image",
      description: "Optional photograph that slightly overlaps the first image. Leave empty to keep the single-image layout. Set the crop and describe the photograph below.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", validation: rule => rule.required().warning("Describe the photograph for screen readers, or leave empty if decorative.") }),
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
      description: "A prominent brand statement, with no attribution. Your complete text is displayed and wraps naturally on smaller screens.",
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
      description: "Drag to set the order. In each group of three, the first photograph leads, the second overlaps alongside it, and the third is a small detail. Mobile stacks them in the same order. Original proportions and crops are preserved; small files stay small. Additional images form another group.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          validation: (rule) =>
            rule
              .assetRequired()
              .error("Upload an image — items without an image are not shown on the website."),
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
      description: "Optional text below the complete gallery.",
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
      description: "Heading above the homepage story selection, e.g. Stories.",
    }),
    defineField({
      name: "pinnedStory",
      title: "Pinned Story",
      type: "reference",
      description: "Optional. Pick a story to always show first in the homepage selection. Leave empty to sort by date only.",
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
      description: "Small uppercase label above the story highlight, e.g. 'HIGHLIGHT'.",
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
  title: "Text + Images",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "string",
      description:
        "Optional heading above the image pair and text, e.g. 'Das Produkt'.",
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
      title: "First image",
      type: "image",
      description: "The larger leading image. Its proportions and crop are preserved; landscape photography works well.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryImage",
      title: "Second image",
      type: "image",
      description: "Optional smaller companion that overlaps the first image on desktop and mobile. Portrait or detail photography works well. Leave empty for one image and text.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "imageFirst",
      title: "Images first",
      type: "boolean",
      description:
        "Show the images before the text. Turn off to lead with the text, followed by the images. The heading stays at the top.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { subtitle: "label" },
    prepare({ subtitle }) {
      return { title: "Text + Images", subtitle };
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
  sectionText,
];
