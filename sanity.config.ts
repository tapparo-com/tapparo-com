import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemaTypes";
import { CogIcon, MenuIcon, TagIcon, DocumentTextIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const HIDDEN_TYPES = [
  "siteSettings",
  "navigation",
  "page",
  "menuCategory",
  "menuItem",
  "allergen",
  "post",
  "author",
];

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings singleton
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
        .title("Navigation")
        .icon(MenuIcon)
        .child(
          S.document()
            .schemaType("navigation")
            .documentId("navigation")
            .title("Navigation")
        ),
      S.divider(),

      // Pages collection
      S.documentTypeListItem("page").title("Pages"),
      S.divider(),

      // Menu group
      S.listItem()
        .title("Menu")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Menu")
            .items([
              S.documentTypeListItem("menuCategory").title("Categories"),
              S.documentTypeListItem("menuItem").title("Items"),
              S.documentTypeListItem("allergen").title("Allergens"),
            ])
        ),

      // Stories group
      S.listItem()
        .title("Stories")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Stories")
            .items([
              S.documentTypeListItem("post").title("Posts"),
              S.documentTypeListItem("author").title("Authors"),
            ])
        ),
    ]);

export default defineConfig({
  name: "default",
  title: "Tapparo",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  plugins: [structureTool({ structure }), media(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
