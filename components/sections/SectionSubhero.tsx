import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Reveal } from "@/components/ui/Reveal";
import { AboutIntroduction } from "@/components/homepage/AboutIntroduction";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import { pathForSlug } from "@/lib/urls";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  label?: string | null;
  heading?: PortableTextBlock[] | null;
  image?: SectionImage | null;
  secondaryImage?: SectionImage | null;
  button?: {
    label: string;
    slug?: string | null;
    variant?: "filled" | "outline" | null;
  } | null;
  showOpeningHours?: boolean;
  openingHours?: { _key: string; day: string; hours: string }[] | null;
};

export function SectionSubhero({
  label,
  heading,
  image,
  secondaryImage,
  button,
  showOpeningHours,
  openingHours,
}: Props) {
  const href = button?.slug ? pathForSlug(button.slug) : undefined;
  const hasButton = Boolean(href && button?.label);
  const hasHours = showOpeningHours && Boolean(openingHours?.length);
  const primary = image?.asset ? image : null;
  const secondary = secondaryImage?.asset ? secondaryImage : null;
  const imageCount = Number(!!primary) + Number(!!secondary);
  if (!heading?.length && !imageCount && !hasButton && !hasHours)
    return null;

  return (
    <section
      className={`${styles.section} ${styles.about}`}
      data-home-section="about"
      aria-label={label || "Über uns"}
    >
      {imageCount > 0 && (
        <div className={styles.aboutImages} data-image-count={imageCount}>
          {primary && (
            <figure className={styles.aboutPrimary}>
              <Reveal mask duration={0.9}>
                {hasButton ? (
                  <TransitionLink
                    href={href!}
                    className={styles.aboutImageLink}
                    aria-label={button!.label}
                  >
                    <SectionMedia
                      image={primary}
                      natural
                      sizes="(max-width: 767px) 86vw, (max-width: 1200px) 42vw, 560px"
                    />
                  </TransitionLink>
                ) : (
                  <SectionMedia
                    image={primary}
                    natural
                    sizes="(max-width: 767px) 86vw, (max-width: 1200px) 42vw, 560px"
                  />
                )}
              </Reveal>
            </figure>
          )}
          {secondary && (
            <figure className={styles.aboutSecondary}>
              <Reveal mask duration={0.9} delay={0.1}>
                <SectionMedia
                  image={secondary}
                  ratio={4 / 3}
                  sizes="(max-width: 767px) 86vw, (max-width: 2100px) 52vw, 1000px"
                />
              </Reveal>
            </figure>
          )}
        </div>
      )}
      <AboutIntroduction
        button={hasButton ? { href: href!, label: button!.label } : undefined}
        openingHours={hasHours ? openingHours! : undefined}
      >
        {heading?.length ? (
          <PortableText
            value={heading}
            components={{ marks: { link: PortableTextLink } }}
          />
        ) : null}
      </AboutIntroduction>
    </section>
  );
}
