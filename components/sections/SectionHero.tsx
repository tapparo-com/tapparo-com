"use client";

import { normalizeTickerPhrases } from "@/lib/content";

import Image, { getImageProps } from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { usePageTransition } from "@/components/ui/PageTransition";
import {
  BrandArtwork,
  CROSSFADE_SECONDS,
  HeroTicker,
  HeroChoices,
  StatusDetails,
} from "@/components/hero/HeroParts";
import { heroSlideInterval } from "@/lib/animation";
import type { HeroSecondaryLink } from "@/lib/hero-links";
import { HeroIntro } from "@/components/hero/HeroIntro";
import { useSite } from "@/components/hero/SiteShell";
import {
  ENTRANCE_BOOTSTRAP,
  SITE_INTRO_SESSION_KEY,
  useHeroEntrance,
} from "@/components/hero/useHeroEntrance";
import {
  heroImage,
  heroImageSizes,
  type SanityHeroImage,
} from "@/lib/hero-images";

type HeroProps = {
  heroImages?: SanityHeroImage[] | null;
  tickerPhrases?: string[] | null;
  imageDuration?: number | null;
  description?: string | null;
  secondaryLink?: HeroSecondaryLink | null;
};

export function SectionHero(props: HeroProps) {
  return <Hero key={JSON.stringify(props.heroImages)} {...props} />;
}

function Hero({
  heroImages,
  tickerPhrases = [],
  imageDuration,
  description,
  secondaryLink,
}: HeroProps) {
  const slideInterval = heroSlideInterval(imageDuration);
  const {
    data: { brand, contact, intro },
    status,
    reduced,
    hydrated,
    visible,
    menuPresent,
  } = useSite();
  const root = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<{ width: number; height: number }>();
  const images = useMemo(
    () =>
      (heroImages || [])
        .map((image) => heroImage(image, frame))
        .filter((image) => image !== null),
    [heroImages, frame],
  );
  const phrases = normalizeTickerPhrases(tickerPhrases);
  const [slide, setSlide] = useState({ current: 0, previous: 0, version: 0 });
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState(false);
  const inView = useInView(root, { amount: 0.1 });
  const { isTransitioning } = usePageTransition();
  const { entrance, active, finish } = useHeroEntrance(
    root,
    photo,
    reduced,
    SITE_INTRO_SESSION_KEY,
    isTransitioning,
    intro?.enabled !== false,
  );
  const next = images.length ? (slide.current + 1) % images.length : 0;
  const current = images[slide.current],
    previous = images[slide.previous],
    upcoming = images[next];
  const stopped =
    !hydrated ||
    reduced ||
    !visible ||
    !inView ||
    active ||
    menuPresent ||
    isTransitioning;

  useEffect(() => {
    if (menuPresent) finish();
  }, [menuPresent, finish]);
  useEffect(() => {
    if (!photo.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setFrame((current) =>
        current?.width === width && current.height === height
          ? current
          : { width, height },
      );
    });
    observer.observe(photo.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!upcoming || images.length < 2 || loaded.has(upcoming.id) || stopped)
      return;
    let active = true;
    const image = new window.Image();
    const { props } = getImageProps({
      src: upcoming.src,
      alt: "",
      fill: true,
      sizes: heroImageSizes(upcoming, frame),
    });
    image.onload = () => {
      if (active) setLoaded((current) => new Set(current).add(upcoming.id));
    };
    image.sizes = props.sizes || "";
    image.srcset = props.srcSet || "";
    image.src = props.src;
    return () => {
      active = false;
      image.onload = null;
    };
  }, [upcoming, images.length, loaded, stopped, frame]);
  useEffect(() => {
    if (
      stopped ||
      images.length < 2 ||
      !loaded.has(current.id) ||
      !loaded.has(upcoming.id)
    )
      return;
    const timer = setTimeout(() => {
      setFailed(false);
      setSlide((slide) => ({
        current: next,
        previous: slide.current,
        version: slide.version + 1,
      }));
    }, slideInterval);
    return () => clearTimeout(timer);
  }, [
    stopped,
    images.length,
    loaded,
    current?.id,
    upcoming?.id,
    next,
    slideInterval,
  ]);

  return (
    <div
      ref={root}
      className="hero-stage bg-background [font-family:var(--font-instrument-sans),_sans-serif] text-foreground [--header-height:108px] [--page-gutter:32px] max-[1024px]:[--header-height:84px] max-[1024px]:[--page-gutter:20px] [&_:is(a,_button,_select,_textarea,_summary,_input):focus-visible]:[outline:2px_solid_var(--color-accent)] [&_:is(a,_button,_select,_textarea,_summary,_input):focus-visible]:outline-offset-[5px] [&_:is(button,_a,_summary,_select,_textarea)]:[-webkit-tap-highlight-color:transparent] [&_:is(button,_summary)]:cursor-pointer [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[.5] [&[data-entrance='first']]:[--entry-delay:.7s] [&[data-entrance='return']]:[--entry-delay:0s]"
      data-site-hero
      data-has-ticker={phrases.length > 0}
      data-reduced-motion={reduced}
      data-entrance={entrance.mode}
      data-entrance-run={entrance.run}
      suppressHydrationWarning
      onPointerDownCapture={active ? finish : undefined}
    >
      <script dangerouslySetInnerHTML={{ __html: ENTRANCE_BOOTSTRAP }} />
      <section
        className="site-hero relative grid min-h-dvh w-full grid-cols-[minmax(0,_3fr)_minmax(0,_2fr)] max-[1024px]:grid-cols-1 max-[1024px]:grid-rows-[minmax(220px,_1fr)_auto]"
        aria-label={brand.name}
      >
        {/* Keep the intro's spoken identity available after its decorative artwork exits. */}
        <h1 className="sr-only">
          {brand.name}
          {brand.tagline ? ` — ${brand.tagline}` : ""}
        </h1>
        <div
          ref={photo}
          className="hero-photo relative min-h-0 min-w-0 overflow-hidden bg-foreground [&[data-intro-pending='true']]:opacity-[0]"
          data-hero-photo
          data-slide={slide.current}
          data-image-count={images.length}
        >
          {previous && previous.id !== current?.id && (
            <div
              className="absolute top-0 right-0 bottom-0 left-0"
              aria-hidden="true"
            >
              <Image
                src={previous.src}
                alt=""
                fill
                sizes={heroImageSizes(previous, frame)}
                className="hero-photo-image object-cover [object-position:center]"
                style={{ objectPosition: previous.position }}
              />
            </div>
          )}
          {current && (
            <motion.div
              key={slide.version}
              className="absolute top-0 right-0 bottom-0 left-0"
              data-active-image
              initial={slide.version && !reduced ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0 : CROSSFADE_SECONDS,
                ease: "linear",
              }}
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes={heroImageSizes(current, frame)}
                priority={slide.current === 0}
                fetchPriority={slide.current === 0 ? "high" : "auto"}
                className="hero-photo-image object-cover [object-position:center]"
                style={{ objectPosition: current.position }}
                onLoad={() =>
                  setLoaded((loaded) =>
                    loaded.has(current.id)
                      ? loaded
                      : new Set(loaded).add(current.id),
                  )
                }
                onError={() => setFailed(true)}
              />
            </motion.div>
          )}
          {(!current || failed) && (
            <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-4 bg-background px-8 py-8 [&_>_span:first-child]:h-[130px] [&_>_span:first-child]:w-[min(70%,_360px)] [&_>_span:last-child]:text-center [&_>_span:last-child]:text-[16px]">
              <BrandArtwork logo={brand.logo} />
              <span>{brand.tagline || brand.name}</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-10 pt-27 pb-6 [--hero-inset:32px] max-[1024px]:gap-5 max-[1024px]:pt-5 max-[1024px]:pb-4 max-[1024px]:[--hero-inset:20px] [@media_(max-height:_600px)_and_(min-width:_1024px)]:gap-6 [@media_(max-height:_600px)_and_(min-width:_1024px)]:pt-22 [@media_(max-height:_600px)_and_(min-width:_1024px)]:pb-5">
          <div className="hero-copy my-auto w-full min-w-0 text-left max-[1024px]:my-0">
            <div
              className="hero-brand mb-6 h-26 max-[1024px]:mb-3 max-[1024px]:h-[58px] [@media_(max-height:_600px)_and_(min-width:_1024px)]:mb-4 [@media_(max-height:_600px)_and_(min-width:_1024px)]:h-20"
              aria-hidden="true"
            >
              <BrandArtwork logo={brand.logo} />
            </div>
            {description && (
              <div className="hero-introduction [&_p]:text-[clamp(26px,_2.5vw,_32px)] [&_p]:leading-[1.25] [&_p]:tracking-[-.035em] [&_p]:text-pretty max-[1024px]:[&_p]:text-[clamp(22px,_5.8vw,_26px)] max-[1024px]:[&_p]:leading-[1.25] [@media_(max-height:_600px)_and_(min-width:_1024px)]:[&_p]:text-[26px]">
                <p>{description}</p>
              </div>
            )}
            <HeroChoices secondaryLink={secondaryLink} />
            <div className="hero-details mt-7 max-[1024px]:mt-[14px] [@media_(max-height:_600px)_and_(min-width:_1024px)]:mt-6">
              <StatusDetails status={status} contact={contact} />
            </div>
          </div>
          {phrases.length > 0 && (
            <HeroTicker phrases={phrases} stopped={stopped} reduced={reduced} />
          )}
        </div>
      </section>
      {entrance.mode === "first" && current && (
        <HeroIntro
          key={entrance.run}
          photo={photo}
          image={current}
          artwork={intro?.artworkUrl}
        />
      )}
    </div>
  );
}
