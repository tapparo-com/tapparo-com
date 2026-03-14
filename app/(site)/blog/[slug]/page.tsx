import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_LIST_QUERY, BLOG_POST_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PostBody } from "@/components/PostBody";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body?: any[];
  coverImage?: any;
  publishedAt?: string;
  author?: { name: string; image?: any };
  seo?: { title?: string; description?: string };
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: string }[]>({
    query: BLOG_LIST_QUERY,
    tags: ["post"],
  });

  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  if (!post) return {};

  return {
    title: post.seo?.title || `${post.title} — Tapparo`,
    description: post.seo?.description || post.excerpt,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<Post>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <Link
        href="/blog"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Back to blog
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
