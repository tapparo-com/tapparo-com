import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
  slug: string;
  authorName?: string;
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <Link href={`/${post.slug}`} className="group block">
        <div className="flex flex-col gap-5">
          <div className="relative aspect-square overflow-hidden">
            {post.coverImage ? (
              <Image
                src={urlFor(post.coverImage).width(624).height(624).url()}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-muted/20" />
            )}
          </div>

          <h3 className="font-sans text-2xl font-medium leading-8 text-foreground">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-base leading-7 text-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex items-center gap-4">
              {post.authorName && (
                <span className="text-base uppercase text-foreground">
                  {post.authorName}
                </span>
              )}
              {post.publishedAt && (
                <time
                  dateTime={post.publishedAt}
                  className="text-base uppercase text-muted"
                >
                  {formatDate(post.publishedAt)}
                </time>
              )}
            </div>
            <span className="flex items-center gap-1 text-base uppercase text-accent group-hover:underline">
              <span>Read</span>
              <span>{"->"}</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
