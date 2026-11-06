import type { ContactSettings, NavigationSettings } from "@/lib/content";
import { pathForSlug } from "@/lib/urls";
import { SanityLogo } from "@/components/ui/SanityLogo";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

type Settings = ContactSettings & {
  restaurantName?: string | null;
  logoSvg?: string | null;
  openingHours?: { _key: string; day: string; hours: string }[];
};

type FooterProps = {
  settings?: Settings | null;
  footerNav?: NavigationSettings | null;
};

export function Footer({ settings, footerNav }: FooterProps) {
  const pageLinks = (footerNav?.pageLinks || []).filter((link) => link.slug);
  const socialLinks = footerNav?.socialLinks || [];
  const name = settings?.restaurantName || "Tapparo";
  const hasContact =
    settings?.address ||
    settings?.mapUrl ||
    (footerNav?.showEmail !== false && settings?.email) ||
    (footerNav?.showPhone !== false && settings?.phone);

  return (
    <footer className="relative border-t border-solid border-t-accent bg-background [&_:is(a,_button):focus-visible]:[outline:2px_solid_var(--color-accent)] [&_:is(a,_button):focus-visible]:outline-offset-[5px] [&_a]:[transition:color_.2s_ease] motion-reduce:[&_a]:transition-none [&_a:hover]:underline [&_a:hover]:decoration-accent [&_a:hover]:underline-offset-[5px]">
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pt-[clamp(32px,_3vw,_64px)] pb-0 [&_*]:min-w-0">
        <div className="grid grid-cols-[minmax(260px,_1fr)_repeat(3,_minmax(0,_1fr))] items-start gap-[clamp(32px,_4vw,_80px)] text-left max-[1024px]:grid-cols-2 max-[1024px]:gap-8 max-[600px]:grid-cols-1 max-[600px]:gap-7 [&_h2]:mb-[14px] [&_h2]:text-[16px] [&_h2]:leading-[1.5] [&_h2]:font-medium">
          {settings?.openingHours?.length ? (
            <section
              className="[&_dd]:text-left [&_dd]:wrap-anywhere [&_dl]:w-fit [&_dl]:max-w-full [&_dl]:text-[16px] [&_dl]:leading-[1.5] [&_dl_>_div]:grid [&_dl_>_div]:grid-cols-[minmax(0,_1fr)_minmax(0,_auto)] [&_dl_>_div]:gap-6 [&_dl_>_div]:py-1 [&_dl_>_div]:wrap-anywhere"
              aria-label="Öffnungszeiten"
            >
              <h2>Öffnungszeiten</h2>
              <dl>
                {settings.openingHours.map((entry) => (
                  <div key={entry._key}>
                    <dt>{entry.day}</dt>
                    <dd>{entry.hours}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
          {hasContact && (
            <section
              className="[&_address]:text-[16px] [&_address]:leading-[1.5] [&_address]:wrap-anywhere [&_address]:whitespace-pre-line [&_address]:not-italic"
              aria-label="Kontakt"
            >
              <h2>Kontakt</h2>
              {settings?.address && <address>{settings.address}</address>}
              <div className="mt-3 flex flex-col items-start [&_a]:flex [&_a]:min-h-11 [&_a]:max-w-full [&_a]:items-center [&_a]:justify-start [&_a]:text-left [&_a]:text-[16px] [&_a]:wrap-anywhere [&_a]:underline [&_a]:underline-offset-[5px]">
                {settings?.mapUrl && (
                  <a
                    href={settings.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Route planen
                  </a>
                )}
                {footerNav?.showEmail !== false && settings?.email && (
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                )}
                {footerNav?.showPhone !== false && settings?.phone && (
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>
                    {settings.phone}
                  </a>
                )}
              </div>
            </section>
          )}
          {(pageLinks.length > 0 || socialLinks.length > 0) && (
            <nav
              className="col-[span_2] grid grid-cols-2 content-start items-start gap-[clamp(32px,_4vw,_80px)] max-[1024px]:col-[1_/_-1] max-[1024px]:gap-x-8 max-[600px]:gap-x-6 [&_a]:flex [&_a]:min-h-11 [&_a]:max-w-full [&_a]:items-center [&_a]:justify-start [&_a]:text-[16px] [&_a]:leading-[1.5] [&_a]:wrap-anywhere"
              aria-label="Fußnavigation"
            >
              {pageLinks.length > 0 && (
                <div className="flex max-w-full flex-col items-start [&:last-child:not(:only-child)]:justify-self-end max-[1024px]:[&:last-child:not(:only-child)]:justify-self-start [&:only-of-type]:col-[1_/_-1]">
                  <h2>Entdecken</h2>
                  {pageLinks.map((item) => (
                    <TransitionLink
                      key={item._key}
                      href={pathForSlug(item.slug)}
                    >
                      {item.label}
                    </TransitionLink>
                  ))}
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex max-w-full flex-col items-start [&:last-child:not(:only-child)]:justify-self-end max-[1024px]:[&:last-child:not(:only-child)]:justify-self-start [&:only-of-type]:col-[1_/_-1]">
                  <h2>Im Netz</h2>
                  {socialLinks.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </nav>
          )}
        </div>
      </div>
      <div className="mt-[clamp(28px,_3vw,_56px)] flex items-center justify-between gap-6 border-t border-solid border-t-border px-[var(--page-gutter)] pt-4 pb-6 [&_>_*]:min-w-0">
        <TransitionLink
          href="/"
          className="flex min-h-11 w-37 max-w-[45%] items-center text-[28px] max-[600px]:w-33 [&_>_div]:w-full [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          aria-label={`${name} Startseite`}
        >
          {settings?.logoSvg ? (
            <SanityLogo svgHtml={settings.logoSvg} alt={name} />
          ) : (
            <span>{name}</span>
          )}
        </TransitionLink>
        <ScrollToTop />
      </div>
    </footer>
  );
}
