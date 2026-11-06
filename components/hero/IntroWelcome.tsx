"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import styles from "./Hero.module.css";

/** Shared brand welcome; Home adds its photograph handoff alongside it. */
export function IntroWelcome({ artwork, width = "100%", height = "100%" }: {
  artwork?: string | null;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  return <>
    <motion.div className={styles.introBackdrop} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3, delay: 1.05 }} />
    <motion.div className={styles.introGreeting} style={{ width, height }}
      initial={{ opacity: 0, filter: "blur(6px)" }}
      animate={{ opacity: [0, 1, 1, 0], filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(4px)"] }}
      transition={{ duration: 1, delay: 0.05, times: [0, 0.4, 0.72, 1], ease: "easeInOut" }}>
      {/* Decorative artwork: the persistent page content supplies its own heading. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={artworkFailed ? "/brand/intro-lockup.svg" : artwork || "/brand/intro-lockup.svg"}
        width={1070} height={1392} alt="" onError={() => setArtworkFailed(true)} />
    </motion.div>
  </>;
}
