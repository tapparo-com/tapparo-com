import { defineField, defineArrayMember } from "sanity";
import { HERO_IMAGE_DURATION } from "../../lib/animation";
import { sectionContactForm } from "./contact-form";
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
  description: "Homepage opening section: carousel, introduction, ordering link, optional second link, opening status and ticker. Place it first on Home. Edit images, copy and the second link here; logo, contact details, hours and welcome artwork come from Site Settings. Layout and animation style are fixed by the site.",
  icon: ImageIcon,
  initialValue: { secondaryLink: { _type: "secondaryLink", enabled: false } },
  fields: [
    defineField({ name: "description", title: "Short introduction", type: "string", description: "Short text below the hero wordmark on desktop and mobile. Leave empty to hide this text; links and opening status remain visible.", validation: rule => rule.max(90) }),
    defineField({
      name: "secondaryLink", title: "Second link", type: "object",
      description: "Optional link after 'jetzt bestellen' on desktop and mobile. Choose its wording and an existing CMS page. The ordering link stays first and always points to /order.",
      options: { collapsible: false },
      initialValue: { enabled: false },
      fields: [
        defineField({
          name: "enabled", title: "Show second link", type: "boolean", initialValue: false,
          description: "Turn on to show a second link and edit its label and destination. Turn off to hide it while keeping those values for later.",
        }),
        defineField({
          name: "label", title: "Link label", type: "string",
          description: "The exact wording displayed, for example 'alle stories', 'speisekarte' or 'kontakt'. Required while the second link is enabled; no automatic wording is substituted.",
          hidden: ({ parent }) => parent?.enabled !== true,
          validation: rule => rule.max(80).custom((value, context) =>
            (context.parent as { enabled?: boolean } | undefined)?.enabled === true && !value?.trim()
              ? "Enter a label for the enabled second link." : true),
        }),
        defineField({
          name: "page", title: "Destination page", type: "reference",
          description: "Select an existing page, Menu, Stories overview, article or legal page. Publish the destination before publishing this link. External URLs and inline page creation are not available here. Required while the second link is enabled.",
          to: [{ type: "page" }, { type: "menuPage" }, { type: "storiesPage" }, { type: "post" }, { type: "legalPage" }],
          options: { disableNew: true, filter: '_type in ["menuPage", "storiesPage"] || defined(slug.current)' },
          hidden: ({ parent }) => parent?.enabled !== true,
          validation: rule => rule.custom((value, context) =>
            (context.parent as { enabled?: boolean } | undefined)?.enabled === true && !value?._ref
              ? "Select a destination for the enabled second link." : true),
        }),
      ],
    }),
    // Preserve legacy data; the website now reads secondaryLink only.
    defineField({ name: "menuLinkLabel", title: "Legacy menu link label", type: "string", hidden: true, validation: rule => rule.max(40) }),
    defineField({
      name: "tickerPhrases",
      title: "Ticker phrases",
      type: "array",
      description: "Moving text at the bottom of the hero information area. Add one word or phrase per entry and drag to reorder. Bullets are automatic. Leave empty to hide the ticker. Size, speed and placement are fixed; reduced-motion visitors see a static wrapping list.",
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
  description: "Introduction/About section with up to two images, rich text, one optional page link and optional shared opening hours. Image arrangement, text size and underline style are fixed by the site.",
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
      description: "Large introduction text. Use the editor's Bold formatting to highlight words in the orange accent color. Supports paragraphs, headings, lists and links; font sizes and colors follow the site design.",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "First image",
      type: "image",
      description: "The first image above the introduction. Its proportions and chosen crop are preserved, so menu artwork stays fully visible. If the optional Button has a label and destination, this image also links to that page.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
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
      description: "Show the shared hours table below the introduction. Edit its values under Site Settings > Opening Hours. Turning this off affects this section only, not the hero status or footer hours.",
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
  description: "An offset composition of up to three images with an optional heading. Edit images, order, crops and alternative text. Positions, sizes and mobile arrangement are set by the design; this is not a slideshow.",
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
              description: "Describe this image for visitors who cannot see it. This text is not shown as a caption.",
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
  description: "A large plain-text quote with attribution and up to two images. It can also show text only or images only. Image placement, quotation styling and animation are fixed by the site.",
  icon: BlockquoteIcon,
  fields: [
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Attribution below the quote, or below the images when there is no quote. Leave empty to hide the attribution. An author alone does not display the section.",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      description: "Plain text beside the images on desktop and above them on smaller screens. Leave empty for an image-only section. Rich-text formatting is not supported.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Optional image alongside the quote. Its proportions and chosen crop are preserved.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
      ],
    }),
    defineField({
      name: "secondaryImage",
      title: "Second image",
      type: "image",
      description: "Optional photograph that slightly overlaps the first image. Leave empty to keep the single-image layout. Set the crop and describe the photograph below.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is not a visible caption.", validation: rule => rule.required().warning("Describe the photograph for screen readers, or leave empty if decorative.") }),
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
  description: "A large plain-text brand statement. The site determines its type size, two-part composition and accent animation. Leave the text empty to hide the section.",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "text",
      title: "Display Text",
      type: "text",
      rows: 4,
      description: "Your complete statement is displayed. The first line break determines the split into two parts; otherwise the site chooses a sentence or balanced word break. Text wraps naturally on smaller screens. Rich-text formatting and custom colors are not available.",
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
  description: "A sequence of image compositions, with an optional caption below the complete gallery. Edit images, order and crops; grouping, overlaps and scroll animation are set by the design. Images do not open a lightbox and do not autoplay.",
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
            defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
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
  description: "Automatically lists published posts with URLs, newest first, with an optional pinned post first. Shows four cards initially and loads two more per click. Cards, button labels and the /stories destination are fixed. Edit individual cards under Stories > Posts.",
  icon: StarIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Section Label",
      type: "string",
      description: "Heading above this story collection. Leave empty to use 'Stories'; clearing it does not hide the heading.",
    }),
    defineField({
      name: "pinnedStory",
      title: "Pinned Story",
      type: "reference",
      description: "Optional published post to place first in this collection. It must have a URL slug. Remaining posts stay newest first. Leave empty for date order only. This does not change the order on the separate Stories page.",
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
  description: "One selected published story with its cover image and link. Override the title and excerpt for this section only. Edit cover framing in the source post; layout and link style are fixed. The section is hidden when the story cannot be resolved.",
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
      description: "Text for the accent-colored link beneath the excerpt. Its destination is always the selected story. The story image and title also link there; link style is fixed by the site.",
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
  description: "Product/editorial section with a heading, rich text, up to two images and an optional enquiry link. You can choose images-first or text-first order. Image proportions are preserved; placement, overlap, typography and borders follow the site design. Needs body text or an image to appear.",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "contactAction", title: "Enquiry link (optional)", type: "object",
      description: "Optional underlined link after the body text. Requires body text, a label and a published contact page. Optionally preselect an enabled enquiry reason. Remove this object to hide the link; it does not affect online ordering.",
      fields: [
        defineField({ name: "label", type: "string", description: "Text shown on the enquiry link, for example 'catering anfragen'. Its underline style is fixed.", initialValue: "catering anfragen", validation: rule => rule.required().max(80) }),
        defineField({ name: "page", type: "reference", to: [{ type: "page" }], description: "Choose a page containing a Contact Form section. Publish the destination page and give it a URL slug so the link can appear.", options: { filter: 'count(sections[_type == "sectionContactForm"]) > 0' }, validation: rule => rule.required() }),
        defineField({ name: "reason", title: "Reason identifier (optional)", type: "string", description: "Copy an enabled reason's Link identifier from that page's Contact Form, e.g. catering. Leave empty for no preselection. Unknown or disabled identifiers do not preselect anything; visitors can still choose a reason.", validation: rule => rule.max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) }),
      ],
    }),
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
      description: "Rich text with headings, paragraphs, lists, italic and links. Bold formatting highlights text in the orange accent color. Images are selected separately below. The enquiry link appears only when this body has content.",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "image",
      title: "First image",
      type: "image",
      description: "The larger leading image. Its proportions and crop are preserved; landscape photography works well.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
      ],
    }),
    defineField({
      name: "secondaryImage",
      title: "Second image",
      type: "image",
      description: "Optional smaller companion that overlaps the first image on desktop and mobile. Portrait or detail photography works well. Leave empty for one image and text.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", description: "Describe the image for visitors who cannot see it. This is alternative text, not a visible caption." }),
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
  sectionContactForm,
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
