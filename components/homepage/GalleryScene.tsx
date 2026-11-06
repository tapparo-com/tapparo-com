"use client";

import {
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal } from "@/components/ui/Reveal";

const desktopMotion =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
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
const travel = [
  [0, -24],
  [40, -40],
  [64, -64],
];

function GalleryLayer({
  item,
  index,
  progress,
  moving,
}: {
  item: GalleryItem;
  index: number;
  progress: MotionValue<number>;
  moving: boolean;
}) {
  const y = useTransform(progress, [0, 1], travel[index]);
  return (
    <motion.figure
      className="section-gallery-figure w-full only:justify-self-center max-[768px]:col-[1] max-[768px]:row-[auto] max-[768px]:mt-0 max-[768px]:w-[78%] max-[768px]:[outline:none] max-[768px]:only:w-full min-[768px]:only:col-[2_/_12] min-[768px]:only:row-[auto] min-[768px]:only:w-[min(100%,_900px)] min-[768px]:[&:nth-child(1):not(:only-child)]:col-[1_/_7] min-[768px]:[&:nth-child(1):not(:only-child)]:row-[1] [&:nth-child(2)]:z-[1] max-[768px]:[&:nth-child(2)]:w-full max-[768px]:[&:nth-child(2)]:justify-self-end min-[768px]:[&:nth-child(2)]:col-[6_/_-1] min-[768px]:[&:nth-child(2)]:row-[1] min-[768px]:[&:nth-child(2)]:mt-[clamp(120px,_18vw,_360px)] [&:nth-child(3)]:z-[2] [&:nth-child(3)]:justify-self-center max-[768px]:[&:nth-child(3)]:w-[64%] max-[768px]:[&:nth-child(3)]:justify-self-center min-[768px]:[&:nth-child(3)]:col-[2_/_5] min-[768px]:[&:nth-child(3)]:row-[2] min-[768px]:[&:nth-child(3)]:-mt-16 min-[768px]:[&:nth-child(3)]:w-[min(100%,_320px)] min-[768px]:[&:nth-child(3)]:[outline:8px_solid_var(--color-background)] [&[data-small='true']]:max-w-[var(--source-width)]"
      data-small={!!item.sourceWidth && item.sourceWidth < 480}
      style={{
        ...({
          "--source-width": `${item.sourceWidth || 1600}px`,
        } as CSSProperties),
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
  const moving = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smallOnly = items.every(
    (item) => !!item.sourceWidth && item.sourceWidth < 480,
  );

  return (
    <div
      ref={ref}
      className="section-gallery-scene relative isolate grid grid-cols-12 items-start max-[768px]:grid-cols-1 max-[768px]:gap-6 [&[data-small-only='true']]:grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] [&[data-small-only='true']]:gap-8"
      data-count={items.length}
      data-small-only={smallOnly}
    >
      {items.map((item, index) => (
        <GalleryLayer
          key={item.key}
          item={item}
          index={index}
          progress={scrollYProgress}
          moving={moving && items.length > 1 && !smallOnly}
        />
      ))}
    </div>
  );
}
