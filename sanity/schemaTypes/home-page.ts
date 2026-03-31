import { defineType, defineField, defineArrayMember } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "introSection",
      title: "Intro Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "array",
          description:
            'Rich text heading — use text formatting for accent color spans (e.g. "simple, honest, and delicious" in red)',
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
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "imageGridSection",
      title: "Image Grid Section",
      type: "object",
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
          description: "Exactly 3 portrait images (4:5 aspect ratio)",
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
    }),
    defineField({
      name: "quoteSection",
      title: "Quote Section",
      type: "object",
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
    }),
    defineField({
      name: "largeTextSection",
      title: "Large Text Section",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Display Text",
          type: "text",
          rows: 4,
        }),
      ],
    }),
    defineField({
      name: "gallerySection",
      title: "Gallery Section",
      type: "object",
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
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "storiesHeading",
      title: "Stories Section Heading",
      type: "string",
      description: 'e.g. "OUR STORIES"',
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
