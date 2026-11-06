"use client";

import { motion } from "motion/react";
import { TransitionLink } from "@/components/ui/TransitionLink";
import type { OpeningStatus } from "@/lib/opening-hours";
import { EASE, StatusDetails } from "./HeroParts";
import { getMenuLinks } from "./navigation";
import type { SiteData } from "./types";
import styles from "./Hero.module.css";

export function NavigationContent({ navigation, status, contact, pathname, reduced, onNavigate }: {
  navigation: SiteData["navigation"];
  status: OpeningStatus;
  contact: SiteData["contact"];
  pathname: string;
  reduced: boolean;
  onNavigate: () => void;
}) {
  const links = getMenuLinks(navigation);
  return <div className={styles.navigationLayout}>
    <div className={styles.navigationContent}>
      <nav aria-label="Hauptnavigation" className={styles.menuLinks}>
        {links.map((link, index) => <motion.div key={link.key}
          initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.08 + index * 0.045, ease: EASE }}>
          <TransitionLink href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}
            aria-current={!link.external && pathname === link.href ? "page" : undefined}
            onClick={event => { if (!link.external && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate(); }}>{link.label}</TransitionLink>
        </motion.div>)}
      </nav>
      <motion.div className={styles.menuInformation}
        initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.22, ease: EASE }}>
        {navigation?.phone && <a className={styles.menuPhone} href={`tel:${navigation.phone.replace(/[^+\d]/g, "")}`}>{navigation.phone}</a>}
        <StatusDetails status={status} contact={contact} />
      </motion.div>
    </div>
  </div>;
}
