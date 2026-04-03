import { ImageResponse } from "next/og";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export const alt = "Tapparo — Focacceria • Daybar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const settings = await sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  const name = settings?.restaurantName || "Tapparo";
  const tagline = settings?.tagline || "Focacceria • Daybar";

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
          {name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#8D8D8D",
            marginTop: 16,
            letterSpacing: "0.2em",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
