import type {
  BrandSettings,
  ContactSettings,
  NavigationSettings,
  SeoSettings,
} from "@/lib/content";
import type { HoursSettings } from "@/lib/opening-hours";
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
import type { Metadata, Viewport } from "next";
import type { SiteData } from "@/components/hero/types";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f5f4f2",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await sanityFetch<SeoSettings | null>({
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
      sanityFetch<SeoSettings | null>({
        query: SEO_QUERY,
        tags: ["settingsSeo"],
      }),
      sanityFetch<NavigationSettings | null>({
        query: HEADER_NAV_QUERY,
        tags: ["navigationHeader", "socialLink", "settingsContact"],
      }),
      sanityFetch<NavigationSettings | null>({
        query: FOOTER_NAV_QUERY,
        tags: ["navigationFooter", "socialLink"],
      }),
      sanityFetch<SiteData["intro"]>({
        query: PAGE_INTRO_QUERY,
        tags: ["settingsPageIntro"],
      }),
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
      <SiteShell
        data={{
          brand: {
            name: brand?.restaurantName || "Tapparo",
            tagline: brand?.tagline,
            logo: brand?.logo?.asset ? urlFor(brand.logo).url() : null,
          },
          contact,
          hours,
          navigation: headerNav,
          intro,
        }}
      >
        <main id="main-content" tabIndex={-1} className="min-h-svh">
          {children}
        </main>
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
