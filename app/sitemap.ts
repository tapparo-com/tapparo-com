import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_LIST_QUERY } from "@/sanity/lib/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tapparo.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await sanityFetch<{ slug: string; publishedAt?: string }[]>({
    query: BLOG_LIST_QUERY,
    tags: ["post"],
  });

  const blogEntries = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
  }));

  return [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/menu`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/imprint`, lastModified: new Date() },
    ...blogEntries,
  ];
}
