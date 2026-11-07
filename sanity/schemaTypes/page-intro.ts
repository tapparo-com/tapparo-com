import { defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

export const settingsPageIntro = defineType({
  name: "settingsPageIntro",
  title: "Page Intro",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "Show first-visit welcome",
      type: "boolean",
      initialValue: true,
      description:
        "Show the welcome once per tab session on the first page visited, including direct links to Menu or Stories. Home adds its photograph handoff when opened at the top. Reduced-motion visitors skip it. Turning this off keeps the short hero entrance.",
    }),
    defineField({
      name: "artwork",
      title: "Intro artwork — iconmark and wordmark",
      type: "image",
      options: { accept: "image/svg+xml,image/png,image/webp" },
      description:
        "Upload the complete iconmark + wordmark lockup on a transparent background, preferably as an SVG. The full artwork is shown without cropping. Leave empty to use the supplied Tapparo lockup. The restaurant name and tagline for screen readers come from Site Settings → Brand; no separate tagline is shown visually. The intro photograph comes from the first Home → Hero carousel image.",
    }),
  ],
  preview: { prepare: () => ({ title: "Page Intro" }) },
});
