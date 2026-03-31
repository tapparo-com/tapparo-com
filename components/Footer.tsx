"use client";

import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

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

type FooterProps = {
  settings?: Settings | null;
};

export function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t-2 border-accent bg-background">
      <div className="mx-auto max-w-[1856px] px-3 pt-24 pb-12 md:px-8 md:pt-24 xl:pt-[280px] xl:pb-20">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr] xl:gap-16">
          {/* Left column: Logo + scroll-to-top */}
          <div className="flex flex-col items-start gap-8">
            {settings?.logo?.asset && (
              <div
                className="h-20 w-full max-w-[280px] bg-foreground"
                style={{
                  maskImage: `url(${urlFor(settings.logo).url()})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "left center",
                  WebkitMaskImage: `url(${urlFor(settings.logo).url()})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "left center",
                }}
                role="img"
                aria-label={`${settings.restaurantName || "Tapparo"} logo`}
              />
            )}
            {!settings?.logo?.asset && (
              <span className="font-display text-3xl font-bold text-foreground">
                {settings?.restaurantName || "Tapparo"}
              </span>
            )}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground hover:text-background md:flex"
            >
              &uarr;
            </button>
          </div>

          {/* Right column: 4-col grid (2x2 on mobile/tablet) */}
          <div className="grid grid-cols-2 gap-8 xl:grid-cols-4 xl:gap-12">
            {/* Restaurant nav */}
            <nav aria-label="Site navigation">
              <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                Restaurant
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Menu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/imprint"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/imprint"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </nav>

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
                {settings?.phone && (
                  <p>
                    <a
                      href={`tel:${settings.phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-foreground"
                    >
                      {settings.phone}
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
            <div>
              <h4 className="mb-4 font-sans text-xs font-medium uppercase tracking-widest text-foreground">
                Follow
              </h4>
              {settings?.socialLinks && settings.socialLinks.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {settings.socialLinks.map((link) => (
                    <li key={link._key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-foreground"
                      >
                        {link.platform.charAt(0).toUpperCase() +
                          link.platform.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
