import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemaTypes";
import {
  CogIcon,
  MenuIcon,
  TagIcon,
  DocumentTextIcon,
  ComposeIcon,
} from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const HIDDEN_TYPES = [
  "settingsBrand",
  "settingsContact",
  "settingsHours",
  "socialLink",
  "settingsSeo",
  "navigationHeader",
  "navigationFooter",
  "page",
  "menuPage",
  "menuCategory",
  "menuItem",
  "allergen",
  "post",
  "author",
  "legalPage",
];

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Site Settings group
      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site Settings")
            .items([
              S.listItem()
                .title("Brand")
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType("settingsBrand")
                    .documentId("settingsBrand")
                    .title("Brand")
                ),
              S.listItem()
                .title("Contact")
                .child(
                  S.document()
                    .schemaType("settingsContact")
                    .documentId("settingsContact")
                    .title("Contact")
                ),
              S.listItem()
                .title("Opening Hours")
                .child(
                  S.document()
                    .schemaType("settingsHours")
                    .documentId("settingsHours")
                    .title("Opening Hours")
                ),
              S.documentTypeListItem("socialLink").title("Social Links"),
              S.listItem()
                .title("SEO")
                .child(
                  S.document()
                    .schemaType("settingsSeo")
                    .documentId("settingsSeo")
                    .title("SEO")
                ),
            ])
        ),

      // Navigation group
      S.listItem()
        .title("Navigation")
        .icon(MenuIcon)
        .child(
          S.list()
            .title("Navigation")
            .items([
              S.listItem()
                .title("Header")
                .icon(MenuIcon)
                .child(
                  S.document()
                    .schemaType("navigationHeader")
                    .documentId("navigationHeader")
                    .title("Header Navigation")
                ),
              S.listItem()
                .title("Footer")
                .icon(ComposeIcon)
                .child(
                  S.document()
                    .schemaType("navigationFooter")
                    .documentId("navigationFooter")
                    .title("Footer")
                ),
            ])
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
              S.listItem()
                .title("Menu Page")
                .icon(TagIcon)
                .child(
                  S.document()
                    .schemaType("menuPage")
                    .documentId("menuPage")
                    .title("Menu Page")
                ),
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

      // Legal group
      S.documentTypeListItem("legalPage").title("Legal"),
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
