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
  showPhone?: boolean;
  showEmail?: boolean;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Footer({ settings, footerItems, showPhone, showEmail }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageLinks: NavItem[] = [];
  const socialLinks: { _key: string; platform: string; url: string }[] = [];

  footerItems?.forEach((item) => {
    if (item._type === "navPageLink") pageLinks.push(item);
    if (item._type === "navSocialLinks" && item.socialLinks) {
      socialLinks.push(...item.socialLinks);
    }
  });

  return (
    <footer className="relative z-10 border-t border-accent bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="flex flex-col gap-10 md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Logo */}
          <div className="md:row-start-1 md:col-start-1">
            <Link href="/">
              {settings?.logo?.asset ? (
                <SanityLogo
                  logo={settings.logo}
                  alt={`${settings.restaurantName || "Tapparo"} logo`}
                  className="h-12 w-[131px] text-foreground [&_svg]:h-full [&_svg]:w-auto"
                />
              ) : (
                <span className="text-lg font-bold text-foreground">
                  {settings?.restaurantName || "Tapparo"}
                </span>
              )}
            </Link>
          </div>

          {/* Col-2: 4 info columns */}
          <div className="md:row-start-1 md:col-start-2">
            {/* Mobile: 2x2 grid. Desktop: 4-col flex with gap-20 */}
            <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-20 xl:flex xl:gap-20">
              {/* Pages */}
              {pageLinks.length > 0 && (
                <div className="flex flex-col gap-7">
                  <span className="text-base text-muted">Pages</span>
                  <nav className="flex flex-col">
                    {pageLinks.map((item) => (
                      <Link
                        key={item._key}
                        href={item.slug === "home" ? "/" : `/${item.slug}`}
                        className="text-base uppercase leading-7 text-foreground transition-colors hover:text-accent"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* Contact */}
              <div className="flex flex-col gap-7">
                <span className="text-base text-muted">Contact</span>
                <div className="flex flex-col">
                  {settings?.address && (
                    <p className="text-base uppercase leading-7 text-foreground whitespace-pre-line">
                      {settings.restaurantName}
                      {"\n"}
                      {settings.address}
                    </p>
                  )}
                  <div className="flex flex-col pt-7">
                    {settings?.mapUrl && (
                      <a
                        href={settings.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80"
                      >
                        Maps
                      </a>
                    )}
                    {showEmail !== false && settings?.email && (
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80"
                      >
                        {settings.email}
                      </a>
                    )}
                    {showPhone !== false && settings?.phone && (
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                        className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80"
                      >
                        {settings.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Hours */}
              {settings?.openingHours && settings.openingHours.length > 0 && (
                <div className="flex flex-col gap-7">
                  <span className="text-base text-muted">Hours</span>
                  <dl className="flex flex-col">
                    {settings.openingHours.map((entry) => (
                      <div
                        key={entry._key}
                        className="flex gap-2 text-base uppercase leading-7 text-foreground"
                      >
                        <dt className="w-[88px]">{entry.day}</dt>
                        <dd className="whitespace-nowrap">{entry.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Follow */}
              {socialLinks.length > 0 && (
                <div className="flex flex-col gap-7">
                  <span className="text-base text-muted">Follow</span>
                  <div className="flex flex-col">
                    {socialLinks.map((link) => (
                      <a
                        key={link._key}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base uppercase leading-7 text-foreground transition-colors hover:text-accent"
                      >
                        {capitalize(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="absolute bottom-5 right-3 flex size-12 items-center justify-center bg-background/75 backdrop-blur-sm text-accent transition-colors hover:text-accent/80 md:right-8 xl:bottom-20"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 26V6M16 6L6 16M16 6L26 16"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </footer>
  );
}
