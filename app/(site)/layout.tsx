import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { ComingSoon } from "@/components/ComingSoon";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

type SiteSettings = {
  restaurantName: string;
  tagline: string;
  isComingSoon: boolean;
  comingSoonText: string;
  logo?: { asset?: { _id: string; url: string } };
  heroImages?: any[];
  email: string;
  phone: string;
  address: string;
  mapUrl?: string;
  openingHours: { _key: string; day: string; hours: string }[];
  socialLinks: { _key: string; platform: string; url: string }[];
  seoDefaults: { title: string; description: string };
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return {
    title: {
      default: settings?.seoDefaults?.title || "Tapparo",
      template: "%s — Tapparo",
    },
    description:
      settings?.seoDefaults?.description || "Day bar & focacceria",
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  if (settings?.isComingSoon) {
    return <ComingSoon settings={settings} />;
  }

  return (
    <>
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}
