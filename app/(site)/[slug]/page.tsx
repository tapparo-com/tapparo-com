import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PAGE_BY_SLUG_QUERY,
  BLOG_POST_QUERY,
  BLOG_LIST_QUERY,
  PAGES_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";
import { PostBody } from "@/components/PostBody";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [pages, posts] = await Promise.all([
    sanityFetch<{ slug: string }[]>({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
    }),
    sanityFetch<{ slug: string }[]>({
      query: BLOG_LIST_QUERY,
      tags: ["post"],
    }),
  ]);

  return [
    ...(pages ?? []).map((p) => ({ slug: p.slug })),
    ...(posts ?? []).map((p) => ({ slug: p.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Try CMS page first
  const page = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["page"],
  });

  if (page) {
    return {
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
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
    };
  }

  return {};
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;

  // --- Try CMS page ---
  const [page, settings] = await Promise.all([
    sanityFetch<any>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug },
      tags: ["page"],
    }),
    sanityFetch<any>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
  ]);

  if (page) {
    return (
      <>
        {page.title && slug !== "menu" && (
          <header className="mx-auto max-w-[1856px] px-3 pt-12 pb-4 md:px-8 md:pt-16">
            <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
          </header>
        )}
        <SectionRenderer
          sections={page.sections || []}
          shared={{
            restaurantName: settings?.restaurantName,
            tagline: settings?.tagline,
            logo: settings?.logo,
            openingHours: settings?.openingHours,
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

  if (post) {
    return (
      <article className="mx-auto max-w-2xl px-6 py-20">
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr; Back
        </Link>

        <header className="mt-8">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            {post.author && (
              <span className="font-medium text-foreground">
                {post.author.name}
              </span>
            )}
            {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
          </div>
        </header>

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={urlFor(post.coverImage).width(1200).height(675).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {post.body && (
          <div className="prose prose-neutral mt-12 max-w-none">
            <PostBody value={post.body} />
          </div>
        )}
      </article>
    );
  }

  notFound();
}
