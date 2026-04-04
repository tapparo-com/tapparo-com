import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BRAND_QUERY,
  CONTACT_QUERY,
  HOURS_QUERY,
  SEO_QUERY,
  HEADER_NAV_QUERY,
  FOOTER_NAV_QUERY,
} from "@/sanity/lib/queries";
import { ComingSoon } from "@/components/ComingSoon";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityFetch<any>({
    query: SEO_QUERY,
    tags: ["settingsSeo"],
  });

  return {
    title: {
      default: seo?.metaTitle || "Tapparo",
      template: seo?.titleTemplate || "%s — Tapparo",
    },
    description: seo?.metaDescription || "Day bar & focacceria",
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brand, contact, hours, seo, headerNav, footerNav] =
    await Promise.all([
      sanityFetch<any>({ query: BRAND_QUERY, tags: ["settingsBrand"] }),
      sanityFetch<any>({ query: CONTACT_QUERY, tags: ["settingsContact"] }),
      sanityFetch<any>({ query: HOURS_QUERY, tags: ["settingsHours"] }),
      sanityFetch<any>({ query: SEO_QUERY, tags: ["settingsSeo"] }),
      sanityFetch<any>({
        query: HEADER_NAV_QUERY,
        tags: ["navigationHeader", "socialLink", "settingsContact"],
      }),
      sanityFetch<any>({
        query: FOOTER_NAV_QUERY,
        tags: ["navigationFooter", "socialLink"],
      }),
    ]);

  if (seo?.isComingSoon) {
    return (
      <ComingSoon
        settings={{
          restaurantName: brand?.restaurantName,
          logo: brand?.logo,
          comingSoonBody: seo?.comingSoonBody,
          socialLinks: seo?.comingSoonSocialLinks,
        }}
      />
    );
  }

  return (
    <>
      <Header
        restaurantName={brand?.restaurantName}
        logo={brand?.logo}
        headerNav={headerNav}
      />
      <main>{children}</main>
      <Footer
        settings={{
          restaurantName: brand?.restaurantName,
          logo: brand?.logo,
          email: contact?.email,
          phone: contact?.phone,
          address: contact?.address,
          mapUrl: contact?.mapUrl,
          openingHours: hours?.openingHours,
        }}
        footerNav={footerNav}
      />
    </>
  );
}
