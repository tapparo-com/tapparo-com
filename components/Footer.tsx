import { pathForSlug } from "@/lib/urls";
import { SanityLogo } from "@/components/ui/SanityLogo";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import styles from "./Footer.module.css";

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
  const pageLinks = (footerNav?.pageLinks || []).filter(link => link.slug);
  const socialLinks = footerNav?.socialLinks || [];
  const name = settings?.restaurantName || "Tapparo";
  const hasContact = settings?.address || settings?.mapUrl
    || (footerNav?.showEmail !== false && settings?.email)
    || (footerNav?.showPhone !== false && settings?.phone);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.information}>
          {settings?.openingHours?.length ? (
            <section className={styles.hours} aria-label="Öffnungszeiten">
              <h2>Öffnungszeiten</h2>
              <dl>{settings.openingHours.map(entry => (
                <div key={entry._key}><dt>{entry.day}</dt><dd>{entry.hours}</dd></div>
              ))}</dl>
            </section>
          ) : null}
          {hasContact && (
            <section className={styles.contact} aria-label="Kontakt">
              <h2>Kontakt</h2>
              {settings?.address && <address>{settings.address}</address>}
              <div className={styles.contactLinks}>
                {settings?.mapUrl && <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer">Route planen</a>}
                {footerNav?.showEmail !== false && settings?.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
                {footerNav?.showPhone !== false && settings?.phone && <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>{settings.phone}</a>}
              </div>
            </section>
          )}
          {(pageLinks.length > 0 || socialLinks.length > 0) && (
            <nav className={styles.navigation} aria-label="Fußnavigation">
              {pageLinks.length > 0 && <div className={styles.linkGroup}>
                <h2>Entdecken</h2>
                {pageLinks.map(item => <TransitionLink key={item._key} href={pathForSlug(item.slug)}>{item.label}</TransitionLink>)}
              </div>}
              {socialLinks.length > 0 && <div className={styles.linkGroup}>
                <h2>Im Netz</h2>
                {socialLinks.map(link => <a key={link._id} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}
              </div>}
            </nav>
          )}
        </div>
      </div>
      <div className={styles.bottom}>
        <TransitionLink href="/" className={styles.logo} aria-label={`${name} Startseite`}>
          {settings?.logoSvg
            ? <SanityLogo svgHtml={settings.logoSvg} alt={name} />
            : <span>{name}</span>}
        </TransitionLink>
        <ScrollToTop />
      </div>
    </footer>
  );
}
