import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SITE_SETTINGS_QUERY,
  HOME_PAGE_QUERY,
  MENU_ITEMS_SAMPLE_QUERY,
} from "@/sanity/lib/queries";
import Link from "next/link";

type SiteSettings = {
  restaurantName: string;
  tagline: string;
  address: string;
  phone: string;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type HomePage = {
  title: string;
  body: any[];
} | null;

type MenuItem = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  pricingType: string;
  priceVariants?: { _key: string; label: string; price: number }[];
  category?: { title: string };
};

export default async function HomePage() {
  const [settings, page, menuItems] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ["siteSettings"],
    }),
    sanityFetch<HomePage>({
      query: HOME_PAGE_QUERY,
      tags: ["page"],
    }),
    sanityFetch<MenuItem[]>({
      query: MENU_ITEMS_SAMPLE_QUERY,
      tags: ["menuItem"],
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
          (entry) => `${entry.day} ${entry.hours}`
        ),
      }),
  };

  return (
    <div className="mx-auto max-w-2xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          {settings?.restaurantName || "Tapparo"}
        </h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          {settings?.tagline}
        </p>
      </section>

      {/* About */}
      {page?.body && (
        <section className="border-t border-border py-20">
          <div className="prose prose-neutral max-w-none">
            <PortableText value={page.body} />
          </div>
        </section>
      )}

      {/* Menu Teaser */}
      {menuItems && menuItems.length > 0 && (
        <section className="border-t border-border py-20">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            From the Menu
          </h2>
          <div className="mt-8 space-y-6">
            {menuItems.map((item) => (
              <div key={item._id} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-muted">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {item.pricingType === "single" && item.price != null && (
                    <p className="font-medium">€{item.price.toFixed(2)}</p>
                  )}
                  {item.pricingType === "variants" &&
                    item.priceVariants?.map((v) => (
                      <p key={v._key} className="text-sm text-muted">
                        {v.label} €{v.price.toFixed(2)}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/menu"
            className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
          >
            View full menu →
          </Link>
        </section>
      )}

      {/* Hours & Location */}
      {(settings?.openingHours || settings?.address) && (
        <section className="border-t border-border py-20">
          <div className="grid gap-12 sm:grid-cols-2">
            {settings.openingHours && settings.openingHours.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Hours
                </h2>
                <div className="mt-4 space-y-1">
                  {settings.openingHours.map((entry) => (
                    <p key={entry._key} className="text-sm">
                      <span className="font-medium">{entry.day}</span>{" "}
                      <span className="text-muted">{entry.hours}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
            {settings.address && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                  Location
                </h2>
                <p className="mt-4 whitespace-pre-line text-sm">
                  {settings.address}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
