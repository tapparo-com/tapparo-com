import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { CogIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings", "homePage", "menuPage"];

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("Home Page")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home Page")
        ),
      S.listItem()
        .title("Menu Page")
        .child(
          S.document()
            .schemaType("menuPage")
            .documentId("menuPage")
            .title("Menu Page")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string)
      ),
    ]);

export default defineConfig({
  name: "default",
  title: "Tapparo",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
