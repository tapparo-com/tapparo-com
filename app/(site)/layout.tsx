import { getHoursRows } from "@/lib/opening-hours";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  BRAND_QUERY,
  PAGE_INTRO_QUERY,
  CONTACT_QUERY,
  HOURS_QUERY,
  SEO_QUERY,
  HEADER_NAV_QUERY,
  FOOTER_NAV_QUERY,
} from "@/sanity/lib/queries";
import { fetchLogoSvg } from "@/sanity/lib/fetchSvg";
import { PageTransitionProvider } from "@/components/ui/PageTransition";
import { ComingSoon } from "@/components/ComingSoon";
import { SiteShell } from "@/components/hero/SiteShell";
import { urlFor } from "@/sanity/lib/image";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import type { SiteData } from "@/components/hero/types";

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
  const [brand, contact, hours, seo, headerNav, footerNav, intro] =
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
      sanityFetch<SiteData["intro"]>({ query: PAGE_INTRO_QUERY, tags: ["settingsPageIntro"] }),
    ]);

  const logoSvg = await fetchLogoSvg(brand?.logo);

  if (seo?.isComingSoon) {
    return (
      <ComingSoon
        settings={{
          restaurantName: brand?.restaurantName,
          logoSvg,
          supportingLogoTagline: brand?.supportingLogoTagline,
          comingSoonBody: seo?.comingSoonBody,
          address: seo?.comingSoonShowAddress ? contact?.address : undefined,
          socialLinks: seo?.comingSoonSocialLinks,
        }}
      />
    );
  }

  return (
    <PageTransitionProvider>
      <SiteShell data={{
        brand: { name: brand?.restaurantName || "Tapparo", tagline: brand?.tagline, logo: brand?.logo?.asset ? urlFor(brand.logo).url() : null },
        contact, hours, navigation: headerNav, intro,
      }}>
      <main id="main-content" tabIndex={-1} className="min-h-svh">{children}</main>
      <Footer
        settings={{
          restaurantName: brand?.restaurantName,
          logoSvg,
          email: contact?.email,
          phone: contact?.phone,
          address: contact?.address,
          mapUrl: contact?.mapUrl,
          openingHours: getHoursRows(hours),
        }}
        footerNav={footerNav}
      />
      </SiteShell>
    </PageTransitionProvider>
  );
}
