import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  LEGAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tapparo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, legalPages] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
    }),
    sanityFetch<{ slug: string; publishedAt?: string }[]>({
      query: BLOG_LIST_QUERY,
      tags: ["post"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: LEGAL_SLUGS_QUERY,
      tags: ["legalPage"],
    }),
  ]);

  const pageEntries = (pages ?? []).map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: new Date(),
  }));

  const postEntries = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }));

  const legalEntries = (legalPages ?? []).map((page) => ({
    url: `${BASE_URL}/${page.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/menu`, lastModified: new Date() },
    { url: `${BASE_URL}/stories`, lastModified: new Date() },
    ...pageEntries,
    ...postEntries,
    ...legalEntries,
  ];
}
