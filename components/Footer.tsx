import { pathForSlug } from "@/lib/urls";
import { SanityLogo } from "@/components/ui/SanityLogo";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

type Settings = {
  restaurantName?: string;
  logoSvg?: string | null;
  email?: string;
  phone?: string;
  address?: string;
  mapUrl?: string;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type FooterNav = {
  pageLinks?: { _key: string; label: string; slug: string }[];
  socialLinks?: { _id: string; label: string; url: string }[];
  showPhone?: boolean;
  showEmail?: boolean;
};

type FooterProps = {
  settings?: Settings | null;
  footerNav?: FooterNav | null;
};

export function Footer({ settings, footerNav }: FooterProps) {
  const pageLinks = footerNav?.pageLinks || [];
  const socialLinks = footerNav?.socialLinks || [];
  const showPhone = footerNav?.showPhone;
  const showEmail = footerNav?.showEmail;

  return (
    <footer className="relative z-10 border-t border-accent bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="flex flex-col gap-10 md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Logo */}
          <div className="md:row-start-1 md:col-start-1">
            <TransitionLink href="/">
              {settings?.logoSvg ? (
                <SanityLogo
                  svgHtml={settings.logoSvg}
                  alt={`${settings.restaurantName || "Tapparo"} logo`}
                  className="h-12 w-[131px] text-foreground [&_svg]:h-full [&_svg]:w-auto"
                />
              ) : (
                <span className="text-lg font-bold text-foreground">
                  {settings?.restaurantName || "Tapparo"}
                </span>
              )}
            </TransitionLink>
          </div>

          {/* Col-2: 4 info columns */}
          <div className="md:row-start-1 md:col-start-2">
            {/* Mobile: 2 rows (Hours+Pages, Contact+Follow) sized to content.
                XL: single row reordered (Pages, Contact, Hours, Follow) via order. */}
            <div className="flex flex-col gap-20 xl:flex-row">
              {/* Row 1 mobile: Hours + Pages */}
              <div className="grid grid-cols-[fit-content(100%)_1fr] gap-x-8 xl:contents">
                {settings?.openingHours && settings.openingHours.length > 0 && (
                  <div className="flex flex-col gap-7 xl:order-3">
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

                {pageLinks.length > 0 && (
                  <div className="flex flex-col gap-7 xl:order-1">
                    <span className="text-base text-muted">Pages</span>
                    <nav className="flex flex-col">
                      {pageLinks.map((item) => (
                        <TransitionLink
                          key={item._key}
                          href={pathForSlug(item.slug)}
                          className="text-base uppercase leading-7 text-foreground transition-colors hover:text-accent"
                        >
                          {item.label}
                        </TransitionLink>
                      ))}
                    </nav>
                  </div>
                )}
              </div>

              {/* Row 2 mobile: Contact + Follow */}
              <div className="grid grid-cols-[fit-content(100%)_1fr] gap-x-8 xl:contents">
                <div className="flex flex-col gap-7 xl:order-2">
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
                          className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80 hover:underline"
                        >
                          Maps
                        </a>
                      )}
                      {showEmail !== false && settings?.email && (
                        <a
                          href={`mailto:${settings.email}`}
                          className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80 hover:underline"
                        >
                          {settings.email}
                        </a>
                      )}
                      {showPhone !== false && settings?.phone && (
                        <a
                          href={`tel:${settings.phone.replace(/\s/g, "")}`}
                          className="text-base uppercase leading-7 text-accent transition-colors hover:text-accent/80 hover:underline"
                        >
                          {settings.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {socialLinks.length > 0 && (
                  <div className="flex flex-col gap-7 xl:order-4">
                    <span className="text-base text-muted">Follow</span>
                    <div className="flex flex-col">
                      {socialLinks.map((link) => (
                        <a
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base uppercase leading-7 text-foreground transition-colors hover:text-accent"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
}
