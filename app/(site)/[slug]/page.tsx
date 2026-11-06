import { getHoursRows } from "@/lib/opening-hours";
import { absoluteSiteUrl, pathForSlug, validateSlug } from "@/lib/urls";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PAGE_BY_SLUG_QUERY,
  BLOG_POST_QUERY,
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  BRAND_QUERY,
  HOURS_QUERY,
  RELATED_STORIES_QUERY,
  LEGAL_PAGE_QUERY,
  LEGAL_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { fetchLogoSvg } from "@/sanity/lib/fetchSvg";
import { SectionRenderer } from "@/components/SectionRenderer";
import { StoryArticle } from "@/components/pages/StoryArticle";
import { LegalArticle } from "@/components/pages/LegalArticle";
import { SectionPageIntro } from "@/components/sections/SectionPageIntro";
import { SectionRelatedStories } from "@/components/sections/SectionRelatedStories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [pages, posts, legalPages] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: BLOG_LIST_QUERY,
      tags: ["post"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: LEGAL_SLUGS_QUERY,
      tags: ["legalPage"],
    }),
  ]);

  const slugs = [...(pages ?? []), ...(posts ?? []), ...(legalPages ?? [])]
    .map((entry) => entry.slug?.toLowerCase())
    .filter((slug) => slug && validateSlug(slug, "post") === true);
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (validateSlug(slug, "post") !== true) notFound();

  // Try CMS page first
  const page = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["page"],
  });

  if (page) {
    return {
      alternates: { canonical: absoluteSiteUrl(pathForSlug(slug)) },
      title: page.seo?.title || page.title,
      description: page.seo?.description,
    };
  }

  // Try blog post
  const post = await sanityFetch<any>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  if (post) {
    return {
      alternates: { canonical: absoluteSiteUrl(pathForSlug(slug)) },
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    };
  }

  // Try legal page
  const legal = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { slug },
    tags: ["legalPage"],
  });

  if (legal) {
    return {
      alternates: { canonical: absoluteSiteUrl(pathForSlug(slug)) },
      title: legal.seo?.title || legal.title,
      description: legal.seo?.description,
    };
  }

  return {};
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  if (validateSlug(slug, "post") !== true) notFound();

  // --- Try CMS page ---
  const [page, brand, hours] = await Promise.all([
    sanityFetch<any>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug },
      tags: ["page"],
    }),
    sanityFetch<any>({ query: BRAND_QUERY, tags: ["settingsBrand"] }),
    sanityFetch<any>({ query: HOURS_QUERY, tags: ["settingsHours"] }),
  ]);

  if (page) {
    return (
      <>
        {page.title && slug !== "menu" && (
          <SectionPageIntro title={page.title} narrow={page.sections?.some((section: { _type: string }) => section._type === "sectionContactForm")} />
        )}
        <SectionRenderer
          documentId={page._id}
          sections={page.sections || []}
          shared={{
            restaurantName: brand?.restaurantName,
            tagline: brand?.tagline,
            logoSvg: await fetchLogoSvg(brand?.logo),
            openingHours: getHoursRows(hours),
          }}
        />
      </>
    );
  }

  // --- Try blog post ---
  const post = await sanityFetch<any>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  // Fetch related stories when enabled (default: true)
  let relatedPosts: any[] | null = null;
  if (post && post.showRelatedStories !== false) {
    relatedPosts = post.relatedStories?.filter((item: any) => item?.slug).length
      ? post.relatedStories.filter((item: any) => item?.slug)
      : await sanityFetch<any[]>({
          query: RELATED_STORIES_QUERY,
          params: { slug },
          tags: ["post"],
        });
  }

  if (post) {
    return <>
      <StoryArticle post={post} showBackLink={!relatedPosts?.length} />
      {relatedPosts?.length ? <SectionRelatedStories posts={relatedPosts} /> : null}
    </>;
  }

  // --- Try legal page ---
  const legal = await sanityFetch<any>({
    query: LEGAL_PAGE_QUERY,
    params: { slug },
    tags: ["legalPage"],
  });

  if (legal) return <LegalArticle legal={legal} />;

  notFound();
}
