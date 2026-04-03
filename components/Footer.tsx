"use client";

import Link from "next/link";
import { SanityLogo } from "@/components/ui/SanityLogo";

type Settings = {
  restaurantName: string;
  logo?: { asset?: { _id: string; url: string } } | null;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  openingHours?: { _key: string; day: string; hours: string }[];
  socialLinks?: { _key: string; platform: string; url: string }[];
};

type NavItem = {
  _key: string;
  _type: string;
  label?: string;
  slug?: string;
  socialLinks?: { _key: string; platform: string; url: string }[];
  phone?: string;
};

type FooterProps = {
  settings?: Settings | null;
  footerItems?: NavItem[] | null;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Footer({ settings, footerItems }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Split footer items into page links vs other types for column layout
  const pageLinks: NavItem[] = [];
  const socialLinks: { _key: string; platform: string; url: string }[] = [];
  let phoneNumber: string | null = null;

  footerItems?.forEach((item) => {
    if (item._type === "navPageLink") pageLinks.push(item);
    if (item._type === "navSocialLinks" && item.socialLinks) {
      socialLinks.push(...item.socialLinks);
    }
    if (item._type === "navPhoneLink" && item.phone) {
      phoneNumber = item.phone;
    }
  });

  return (
    <footer className="relative z-10 border-t border-accent bg-background">
      <div className="mx-auto max-w-[1856px] px-3 pt-24 pb-12 md:px-8 md:pt-24 xl:pt-[280px] xl:pb-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] xl:gap-16">
          {/* Left column: Logo + scroll-to-top */}
          <div className="flex flex-col items-start gap-8">
            <Link href="/">
              {settings?.logo?.asset ? (
                <SanityLogo
                  logo={settings.logo}
                  alt={`${settings.restaurantName || "Tapparo"} logo`}
                  className="w-full max-w-[280px] text-foreground [&_svg]:w-full [&_svg]:h-auto"
                />
              ) : (
                <span className="font-display text-3xl font-bold text-foreground">
                  {settings?.restaurantName || "Tapparo"}
                </span>
              )}
            </Link>
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background md:flex"
            >
              &uarr;
            </button>
          </div>

          {/* Right column: 4-col grid */}
          <div className="grid grid-cols-2 gap-8 xl:grid-cols-4 xl:gap-12">
            {/* Pages */}
            {pageLinks.length > 0 && (
              <nav aria-label="Site navigation">
                <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                  Pages
                </h4>
                <ul className="space-y-2 text-sm">
                  {pageLinks.map((item) => (
                    <li key={item._key}>
                      <Link
                        href={item.slug === "home" ? "/" : `/${item.slug}`}
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                Contact
              </h4>
              <address className="space-y-2 text-sm not-italic text-muted">
                <p className="font-medium uppercase text-foreground">
                  {settings?.restaurantName || "Tapparo"}
                </p>
                {settings?.address && (
                  <p className="whitespace-pre-line">{settings.address}</p>
                )}
                {settings?.mapUrl && (
                  <p>
                    <a
                      href={settings.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-2 transition-colors hover:text-accent"
                    >
                      See map
                    </a>
                  </p>
                )}
                {(phoneNumber || settings?.phone) && (
                  <p>
                    <a
                      href={`tel:${(phoneNumber || settings?.phone || "").replace(/\s/g, "")}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {phoneNumber || settings?.phone}
                    </a>
                  </p>
                )}
                {settings?.email && (
                  <p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {settings.email}
                    </a>
                  </p>
                )}
              </address>
            </div>

            {/* Hours */}
            <div>
              <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                Hours
              </h4>
              {settings?.openingHours && settings.openingHours.length > 0 && (
                <dl className="space-y-1 text-sm text-muted">
                  {settings.openingHours.map((entry) => (
                    <div key={entry._key} className="flex justify-between gap-4">
                      <dt>{entry.day}</dt>
                      <dd>{entry.hours}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            {/* Follow */}
            {socialLinks.length > 0 && (
              <div>
                <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                  Follow
                </h4>
                <ul className="space-y-2 text-sm">
                  {socialLinks.map((link) => (
                    <li key={link._key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {capitalize(link.platform)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile scroll-to-top */}
        <div className="mt-8 flex justify-end md:hidden">
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
          >
            &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
