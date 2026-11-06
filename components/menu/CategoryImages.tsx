"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SectionMedia } from "@/components/ui/SectionMedia";
import type { ContentImage } from "@/lib/content";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function CategoryImages({
  images,
  title,
}: {
  images: ContentImage[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => setEnhanced(true), []);
  const valid = images.filter((image) => image.asset);
  if (!valid.length) return null;
  const current = valid[index % valid.length];
  return (
    <figure>
      <motion.div
        key={index}
        initial={index > 0 && !reduced ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
      >
        <SectionMedia
          image={{ ...current, alt: current.alt ?? title }}
          natural
          sizes="(max-width: 1023px) 90vw, (max-width: 2100px) 40vw, 800px"
        />
      </motion.div>
      {enhanced && valid.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
          <span className="text-[14px] tabular-nums" role="status">
            Bild {(index % valid.length) + 1} / {valid.length}
          </span>
          <button
            type="button"
            className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
            aria-label={`Vorheriges Bild: ${title}`}
            onClick={() => setIndex((i) => i + valid.length - 1)}
          >
            <span>zurück</span>
            <AnimatedUnderline />
          </button>
          <button
            type="button"
            className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
            aria-label={`Nächstes Bild: ${title}`}
            onClick={() => setIndex((i) => i + 1)}
          >
            <span>weiter</span>
            <AnimatedUnderline />
          </button>
        </div>
      )}
      {valid.length > 1 && (
        <noscript>
          <div className="[&_>_div]:mt-6">
            {valid.slice(1).map((image, i) => (
              <SectionMedia key={i} image={image} natural sizes="90vw" />
            ))}
          </div>
        </noscript>
      )}
    </figure>
  );
}
