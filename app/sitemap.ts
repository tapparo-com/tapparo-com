import type { MetadataRoute } from "next";
import { absoluteSiteUrl, pathForSlug, validateSlug } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  LEGAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";

type Entry = { slug: string; _updatedAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, legalPages] = await Promise.all([
    sanityFetch<Entry[]>({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
    }),
    sanityFetch<Entry[]>({
      query: BLOG_LIST_QUERY,
      tags: ["post"],
    }),
    sanityFetch<Entry[]>({
      query: LEGAL_SLUGS_QUERY,
      tags: ["legalPage"],
    }),
  ]);

  const entries: MetadataRoute.Sitemap = ["/", "/menu", "/stories"].map(
    (path) => ({
      url: absoluteSiteUrl(path),
    }),
  );
  for (const entry of [
    ...(pages ?? []),
    ...(posts ?? []),
    ...(legalPages ?? []),
  ]) {
    if (validateSlug(entry.slug, "post") !== true) continue;
    entries.push({
      url: absoluteSiteUrl(pathForSlug(entry.slug)),
      ...(entry._updatedAt ? { lastModified: entry._updatedAt } : {}),
    });
  }
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
