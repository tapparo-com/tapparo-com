import { getHoursRows } from "@/lib/opening-hours";
import type { Metadata } from "next";
import { absoluteSiteUrl } from "@/lib/urls";
import { serializeJsonLd, structuredHours } from "@/lib/seo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BRAND_QUERY,
  CONTACT_QUERY,
  HOURS_QUERY,
  PAGE_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { fetchLogoSvg } from "@/sanity/lib/fetchSvg";
import { SectionRenderer } from "@/components/SectionRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<any>({ query: PAGE_BY_SLUG_QUERY, params: { slug: "home" }, tags: ["page"] });
  return {
    alternates: { canonical: absoluteSiteUrl("/") },
    ...(page?.seo?.title && { title: page.seo.title }),
    ...(page?.seo?.description && { description: page.seo.description }),
  };
}

export default async function HomePage() {
  const [brand, contact, hours, pageData] = await Promise.all([
    sanityFetch<any>({ query: BRAND_QUERY, tags: ["settingsBrand"] }),
    sanityFetch<any>({ query: CONTACT_QUERY, tags: ["settingsContact"] }),
    sanityFetch<any>({ query: HOURS_QUERY, tags: ["settingsHours"] }),
    sanityFetch<any>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug: "home" },
      tags: ["page"],
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand?.restaurantName || "Tapparo",
    url: absoluteSiteUrl("/"),
    hasMenu: absoluteSiteUrl("/menu"),
    description: brand?.tagline,
    ...(contact?.address && { address: contact.address }),
    ...(contact?.phone && { telephone: contact.phone }),
    ...structuredHours(hours, new Date().getUTCFullYear()),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <SectionRenderer
        documentId={pageData?._id}
        sections={pageData?.sections || []}
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
