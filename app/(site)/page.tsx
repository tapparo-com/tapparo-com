import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY, PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { SectionRenderer } from "@/components/SectionRenderer";

export default async function HomePage() {
  const [settings, pageData] = await Promise.all([
    sanityFetch<any>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
    sanityFetch<any>({
      query: PAGE_BY_SLUG_QUERY,
      params: { slug: "home" },
      tags: ["page"],
    }),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings?.restaurantName || "Tapparo",
    description: settings?.tagline,
    ...(settings?.address && { address: settings.address }),
    ...(settings?.phone && { telephone: settings.phone }),
    ...(settings?.openingHours &&
      settings.openingHours.length > 0 && {
        openingHours: settings.openingHours.map(
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
          restaurantName: settings?.restaurantName,
          tagline: settings?.tagline,
          logo: settings?.logo,
          openingHours: settings?.openingHours,
        }}
      />
    </>
  );
}
