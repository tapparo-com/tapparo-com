"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";

/** Shared brand welcome; Home adds its photograph handoff alongside it. */
export function IntroWelcome({
  artwork,
  width = "100%",
  height = "100%",
}: {
  artwork?: string | null;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}) {
  const [artworkFailed, setArtworkFailed] = useState(false);
  return (
    <>
      <motion.div
        className="absolute top-0 right-0 bottom-0 left-0 bg-background"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.05 }}
      />
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center [&_img]:block [&_img]:h-[min(calc(100%_-_24px),_440px)] [&_img]:w-[min(76%,_340px)] [&_img]:object-contain"
        style={{ width, height }}
        initial={{ opacity: 0, filter: "blur(6px)" }}
        animate={{
          opacity: [0, 1, 1, 0],
          filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(4px)"],
        }}
        transition={{
          duration: 1,
          delay: 0.05,
          times: [0, 0.4, 0.72, 1],
          ease: "easeInOut",
        }}
      >
        {/* Decorative artwork: the persistent page content supplies its own heading. */}
        <img
          src={
            artworkFailed
              ? "/brand/intro-lockup.svg"
              : artwork || "/brand/intro-lockup.svg"
          }
          width={1070}
          height={1392}
          alt=""
          onError={() => setArtworkFailed(true)}
        />
      </motion.div>
    </>
  );
}
