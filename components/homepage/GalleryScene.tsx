"use client";

import { useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Homepage.module.css";

const desktopMotion = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
function subscribe(update: () => void) {
  const query = window.matchMedia(desktopMotion);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}
const getSnapshot = () => window.matchMedia(desktopMotion).matches;
const getServerSnapshot = () => false;

type GalleryItem = {
  key: string;
  sourceWidth?: number;
  content: ReactNode;
};
const travel = [[0, -24], [40, -40], [64, -64]];

function GalleryLayer({
  item, index, progress, moving,
}: {
  item: GalleryItem;
  index: number;
  progress: MotionValue<number>;
  moving: boolean;
}) {
  const y = useTransform(progress, [0, 1], travel[index]);
  return (
    <motion.figure
      className={styles.galleryFigure}
      data-small={!!item.sourceWidth && item.sourceWidth < 480}
      style={{
        ...({ "--source-width": `${item.sourceWidth || 1600}px` } as CSSProperties),
        y: moving ? y : 0,
      }}
    >
      <Reveal mask duration={0.9} delay={index * 0.08}>
        {item.content}
      </Reveal>
    </motion.figure>
  );
}

export function GalleryScene({ items }: { items: GalleryItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const moving = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smallOnly = items.every(item => !!item.sourceWidth && item.sourceWidth < 480);

  return (
    <div ref={ref} className={styles.galleryScene} data-count={items.length} data-small-only={smallOnly}>
      {items.map((item, index) => (
        <GalleryLayer key={item.key} item={item} index={index} progress={scrollYProgress} moving={moving && items.length > 1 && !smallOnly} />
      ))}
    </div>
  );
}
