import Link from "next/link";
import Image from "next/image";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { sanityFetch } from "@/sanity/lib/fetch";
import { BRAND_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import styles from "./not-found.module.css";
import shared from "@/components/homepage/Homepage.module.css";

type Brand = {
  restaurantName?: string;
  logo?: { asset?: { _ref: string } };
  supportingLogo?: { asset?: { _id: string; url: string } };
};

function FallbackLockup({ name = "Tapparo" }: { name?: string }) {
  return <div className={styles.fallbackLockup}>
    <Image src="/brand/intro-lockup.svg" alt={name} fill priority
      sizes="(max-width: 767px) 170px, 300px" />
  </div>;
}

export default async function NotFound() {
  const brand = await sanityFetch<Brand | null>({ query: BRAND_QUERY, tags: ["settingsBrand"] }).catch(() => null);
  const name = brand?.restaurantName || "Tapparo";
  return <main className={`${styles.page} selection-invert`} id="main-content" tabIndex={-1}>
    <div className={styles.layout}>
      <div className={styles.content}>
        <p className={styles.note}>404 — Diese Seite gibt’s leider nicht.</p>
        <h1 className={styles.title}>Suchst du nach<br />Focaccia?</h1>
        <Link href="/menu" className={`${shared.animatedLink} ${styles.menuLink}`}>
          <span>Die gibt’s hier!</span><AnimatedUnderline />
        </Link>
        <Link href="/" className={styles.homeLink}>oder zurück zur Startseite</Link>
      </div>
      <div className={styles.brand}>
        {brand?.supportingLogo?.asset ? <>
          <div className={styles.illustration}>
            <Image src={brand.supportingLogo.asset.url} alt="" fill priority
              sizes="(max-width: 767px) 160px, (max-width: 1279px) 280px, 360px" />
          </div>
          <div className={styles.wordmark}>
            <Image src={brand.logo?.asset ? urlFor(brand.logo).url() : "/design-preview/logo-desktop.svg"}
              alt={name} fill priority sizes="(max-width: 767px) 170px, 280px" />
          </div>
        </> : <FallbackLockup name={name} />}
      </div>
    </div>
  </main>;
}
