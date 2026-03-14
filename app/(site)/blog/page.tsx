import { sanityFetch } from "@/sanity/lib/fetch";
import { BLOG_LIST_QUERY } from "@/sanity/lib/queries";
import { BlogCard } from "@/components/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Tapparo",
  description: "Stories, recipes, and updates from Tapparo.",
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: any;
  publishedAt?: string;
};

export default async function BlogPage() {
  const posts = await sanityFetch<Post[]>({
    query: BLOG_LIST_QUERY,
    tags: ["post"],
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
      {posts && posts.length > 0 ? (
        <div className="mt-12 space-y-16">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted">No posts yet.</p>
      )}
    </div>
  );
}
