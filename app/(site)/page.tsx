import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BRAND_QUERY,
  CONTACT_QUERY,
  HOURS_QUERY,
  PAGE_BY_SLUG_QUERY,
} from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";

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
    description: brand?.tagline,
    ...(contact?.address && { address: contact.address }),
    ...(contact?.phone && { telephone: contact.phone }),
    ...(hours?.openingHours &&
      hours.openingHours.length > 0 && {
        openingHours: hours.openingHours.map(
          (entry: any) => `${entry.day} ${entry.hours}`
        ),
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SectionRenderer
        sections={pageData?.sections || []}
        shared={{
          restaurantName: brand?.restaurantName,
          tagline: brand?.tagline,
          logo: brand?.logo,
          openingHours: hours?.openingHours,
        }}
      />
    </>
  );
}
