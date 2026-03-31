import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  post: {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: any;
    publishedAt?: string;
  };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogCard({ post }: Props) {
  return (
    <article>
      <Link href={`/${post.slug}`} className="group block">
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={urlFor(post.coverImage).width(800).height(450).url()}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className={post.coverImage ? "mt-4" : ""}>
          {post.publishedAt && (
            <p className="text-sm text-muted">{formatDate(post.publishedAt)}</p>
          )}
          <h2 className="mt-1 text-xl font-bold tracking-tight group-hover:text-accent transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mt-2 text-muted">{post.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
