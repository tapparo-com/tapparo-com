import { absoluteSiteUrl } from "@/lib/urls";
import { canIndexSite } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        ...(canIndexSite()
          ? { allow: "/", disallow: ["/studio", "/api/", "/order"] }
          : { disallow: "/" }),
      },
    ],
    sitemap: absoluteSiteUrl("/sitemap.xml"),
  };
}
