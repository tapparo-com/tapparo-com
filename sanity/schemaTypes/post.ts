import { slugField } from "./slug-field";
import { defineType, defineField } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Blog post headline. Also used in the Stories carousel cards.",
      validation: (rule) => rule.required(),
    }),
    slugField("Lowercase URL slug, e.g. 'focaccia-di-recco'. Must be unique across pages, posts, and legal pages. Keep published URLs stable; renaming requires a redirect."),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Plain-text teaser shown in Stories cards. Formatting such as **bold** is not supported here; use Body for formatted text.",
      validation: (rule) =>
        rule.max(200).warning("Keep it under 200 characters for best previews"),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      description: "Full post content. Supports headings, paragraphs, bold, italic, links, and inline images.",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description: "Shown on the post and in Stories cards. Use a photo at least 1200px wide, or choose Show full image for posters and artwork with text.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "fit",
          title: "Image Framing",
          type: "string",
          initialValue: "cover",
          options: {
            layout: "radio",
            list: [
              { title: "Fill frame — photos", value: "cover" },
              { title: "Show full image — posters and artwork", value: "contain" },
            ],
          },
          description: "Applies to the article and all Stories cards. Show full image prevents automatic cropping; any crop you set in the image editor still applies. Existing images default to Fill frame.",
          validation: (rule) => rule.custom((value) =>
            !value || value === "cover" || value === "contain" || "Choose one of the image framing options."
          ),
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Publication date shown on the post and used for sorting. Posts display newest first.",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      description: "Shown on the post page. Select from the Authors list under Stories.",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "showRelatedStories",
      title: "Show Related Stories",
      type: "boolean",
      description:
        "Show an 'Other Stories' section at the bottom of this post.",
      initialValue: true,
    }),
    defineField({
      name: "relatedStories",
      title: "Related Stories",
      type: "array",
      description:
        "Pick up to 2 posts. If left empty, the 2 most recent posts are shown.",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (rule) => rule.max(2),
      hidden: ({ parent }) => parent?.showRelatedStories === false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Meta Title",
          type: "string",
          description: "Custom browser tab title. If empty, uses the post title. Appears as: 'Post Title — Tapparo'.",
        }),
        defineField({
          name: "description",
          title: "Meta Description",
          type: "text",
          rows: 3,
          description: "Custom meta description for search engines. If empty, uses the excerpt. Keep under 160 characters.",
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Published Date",
      name: "publishedAt",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "coverImage",
    },
  },
});
