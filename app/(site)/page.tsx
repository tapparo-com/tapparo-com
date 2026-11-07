import type {
  PageDocument,
  BrandSettings,
  ContactSettings,
} from "@/lib/content";
import type { HoursSettings } from "@/lib/opening-hours";
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
import { SectionRenderer } from "@/components/SectionRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<PageDocument | null>({
    query: PAGE_BY_SLUG_QUERY,
    params: { slug: "home" },
    tags: ["page"],
  });
  return {
    alternates: { canonical: absoluteSiteUrl("/") },
    ...(page?.seo?.title && { title: page.seo.title }),
    ...(page?.seo?.description && { description: page.seo.description }),
  };
}

export default async function HomePage() {
  const [brand, contact, hours, pageData] = await Promise.all([
    sanityFetch<BrandSettings | null>({
      query: BRAND_QUERY,
      tags: ["settingsBrand"],
    }),
    sanityFetch<ContactSettings | null>({
      query: CONTACT_QUERY,
      tags: ["settingsContact"],
    }),
    sanityFetch<HoursSettings | null>({
      query: HOURS_QUERY,
      tags: ["settingsHours"],
    }),
    sanityFetch<PageDocument | null>({
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
        openingHours={getHoursRows(hours)}
      />
    </>
  );
}
