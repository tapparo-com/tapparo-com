import { cache } from "react";
import {
  resolveContent,
  type PageDocument,
  type StoryDocument,
  type LegalDocument,
} from "@/lib/content";
import { sanityFetch } from "./fetch";
import {
  PAGE_BY_SLUG_QUERY,
  BLOG_POST_QUERY,
  LEGAL_PAGE_QUERY,
} from "./queries";

/** Request-scoped sharing keeps the metadata and rendered route on the same content. */
export const getContentBySlug = cache((slug: string) =>
  resolveContent(slug, {
    page: (slug) =>
      sanityFetch<PageDocument | null>({
        query: PAGE_BY_SLUG_QUERY,
        params: { slug },
        tags: ["page"],
      }),
    post: (slug) =>
      sanityFetch<StoryDocument | null>({
        query: BLOG_POST_QUERY,
        params: { slug },
        tags: ["post"],
      }),
    legal: (slug) =>
      sanityFetch<LegalDocument | null>({
        query: LEGAL_PAGE_QUERY,
        params: { slug },
        tags: ["legalPage"],
      }),
  }),
);
