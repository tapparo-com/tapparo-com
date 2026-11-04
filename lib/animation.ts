export const REVEAL_DURATION = 0.6;
export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;
export const REVEAL_OFFSET = 24;

export const STAGGER_DELAY = 0.08;

export const PAGE_TRANSITION_DURATION = 0.3;
export const COVER_EASE = [0.76, 0, 0.24, 1] as const;

export const HERO_CROSSFADE = 0.1;
export const HERO_IMAGE_DURATION = { default: 1.2, min: 1.2, max: 15 } as const;

/** Start-to-start timing, including the crossfade; wait for images before scheduling. */
export function heroSlideInterval(seconds?: number | null): number {
  const duration = typeof seconds === "number" && Number.isFinite(seconds)
    && seconds >= HERO_IMAGE_DURATION.min && seconds <= HERO_IMAGE_DURATION.max
    ? seconds : HERO_IMAGE_DURATION.default;
  return Math.round(duration * 1000);
}

export const TAB_SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };
