import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BRAND_QUERY, PAGE_INTRO_QUERY, CONTACT_QUERY, HOURS_QUERY, HEADER_NAV_QUERY, PAGE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { PageTransitionProvider } from "@/components/ui/PageTransition";
import { DesignPreview, type PreviewContent } from "@/components/design-preview/DesignPreview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tapparo — Design review",
  robots: { index: false, follow: false },
};

export default async function DesignPreviewPage() {
  if (process.env.NEXT_PUBLIC_SANITY_DATASET !== "development") notFound();

  const [home, contact, navigation, brand, hours, intro] = await Promise.all([
    sanityFetch<any>({ query: PAGE_BY_SLUG_QUERY, params: { slug: "home" }, revalidate: 0 }),
    sanityFetch<PreviewContent["contact"]>({ query: CONTACT_QUERY, revalidate: 0 }),
    sanityFetch<PreviewContent["navigation"]>({ query: HEADER_NAV_QUERY, revalidate: 0 }),
    sanityFetch<any>({ query: BRAND_QUERY, revalidate: 0 }),
    sanityFetch<PreviewContent["hours"]>({ query: HOURS_QUERY, revalidate: 0 }),
    sanityFetch<PreviewContent["intro"]>({ query: PAGE_INTRO_QUERY, revalidate: 0 }),
  ]);
  const hero = home?.sections?.find((section: any) => section._type === "sectionHero");
  const gallery = home?.sections?.find((section: any) => section._type === "sectionGallery");
  // Demonstration sequence only. The owner's current hero selection is not modified.
  const samples = [...(hero?.heroImages || []), ...(gallery?.images || []).slice(0, 1)];
  const images = [
    { id: "figma-hero", src: "/design-preview/hero-desktop.png", alt: "Frisch belegte Focaccia bei Tapparo", sketch: true },
    ...samples.filter((image: any) => image.asset).map((image: any) => ({
      id: image._key,
      src: urlFor(image).width(1600).quality(80).auto("format").url(),
      alt: image.alt || "Tapparo",
      sketch: false,
    })),
  ];

  return <PageTransitionProvider><DesignPreview content={{
    contact,
    intro,
    hours,
    navigation,
    images,
    imageDuration: hero?.imageDuration,
    tickerPhrases: (hero?.tickerPhrases || []).filter((phrase: unknown): phrase is string => typeof phrase === "string" && Boolean(phrase.trim())).map((phrase: string) => phrase.trim()),
    brand: {
      name: brand?.restaurantName || "Tapparo",
      tagline: brand?.tagline,
      logo: brand?.logo?.asset ? urlFor(brand.logo).url() : null,
    },
  }} /></PageTransitionProvider>;
}
