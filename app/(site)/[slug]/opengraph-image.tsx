import { ImageResponse } from "next/og";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  PAGE_BY_SLUG_QUERY,
  BLOG_POST_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const alt = "Tapparo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try CMS page first
  const page = await sanityFetch<any>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["page"],
  });

  if (page) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 80,
            backgroundColor: "#181818",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: "#F5F4F2" }}>
            {page.title}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#8D8D8D",
              marginTop: 16,
            }}
          >
            Tapparo
          </div>
        </div>
      ),
      { ...size }
    );
  }

  // Try blog post
  const post = await sanityFetch<any>({
    query: BLOG_POST_QUERY,
    params: { slug },
    tags: ["post"],
  });

  if (post) {
    const coverUrl = post.coverImage
      ? urlFor(post.coverImage).width(600).height(630).url()
      : null;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundColor: "#181818",
            fontFamily: "sans-serif",
          }}
        >
          {/* Text side */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 80,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#F5F4F2",
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </div>
            {post.excerpt && (
              <div
                style={{
                  fontSize: 20,
                  color: "#8D8D8D",
                  marginTop: 16,
                  lineHeight: 1.4,
                }}
              >
                {post.excerpt.slice(0, 120)}
                {post.excerpt.length > 120 ? "..." : ""}
              </div>
            )}
            <div
              style={{
                fontSize: 20,
                color: "#E84F2F",
                marginTop: 24,
              }}
            >
              Tapparo
            </div>
          </div>
          {/* Cover image side */}
          {coverUrl && (
            <img
              src={coverUrl}
              width={480}
              height={630}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
      ),
      { ...size }
    );
  }

  // Fallback
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#181818",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, color: "#F5F4F2" }}>
          Tapparo
        </div>
      </div>
    ),
    { ...size }
  );
}
