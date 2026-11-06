import type { ContentImage } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Reveal } from "@/components/ui/Reveal";
import { AboutIntroduction } from "@/components/homepage/AboutIntroduction";
import { SectionMedia } from "@/components/ui/SectionMedia";
import { pathForSlug } from "@/lib/urls";

type Props = {
  label?: string | null;
  heading?: PortableTextBlock[] | null;
  image?: ContentImage | null;
  secondaryImage?: ContentImage | null;
  button?: {
    label: string;
    slug?: string | null;
    variant?: "filled" | "outline" | null;
  } | null;
  showOpeningHours?: boolean | null;
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
  if (!heading?.length && !imageCount && !hasButton && !hasHours) return null;

  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pt-[clamp(48px,_5vw,_96px)] pb-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      data-home-section="about"
      aria-label={label || "Über uns"}
    >
      {imageCount > 0 && (
        <div
          className="mb-[clamp(40px,_5vw,_96px)] grid grid-cols-[minmax(0,_0.9fr)_minmax(0,_1.1fr)] items-start gap-[clamp(24px,_4vw,_80px)] max-[768px]:mb-10 max-[768px]:grid-cols-1 max-[768px]:gap-7 [&[data-image-count='1']]:grid-cols-1 [&[data-image-count='1']_>_figure]:mt-0 [&[data-image-count='1']_>_figure]:justify-self-center max-[768px]:[&[data-image-count='1']_>_figure]:w-full max-[768px]:[&[data-image-count='1']_>_figure]:max-w-140"
          data-image-count={imageCount}
        >
          {primary && (
            <figure className="mt-[clamp(48px,_7vw,_140px)] w-full max-w-140 max-[768px]:mt-0 max-[768px]:w-[78%] max-[768px]:max-w-110">
              <Reveal mask duration={0.9}>
                {hasButton ? (
                  <TransitionLink
                    href={href!}
                    className="block focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px]"
                    aria-label={button!.label}
                  >
                    <SectionMedia
                      image={primary}
                      natural
                      sizes={
                        imageCount === 1
                          ? "(max-width: 767px) calc(100vw - 40px), 560px"
                          : "(max-width: 767px) 78vw, (max-width: 1200px) 42vw, 560px"
                      }
                    />
                  </TransitionLink>
                ) : (
                  <SectionMedia
                    image={primary}
                    natural
                    sizes={
                      imageCount === 1
                        ? "(max-width: 767px) calc(100vw - 40px), 560px"
                        : "(max-width: 767px) 78vw, (max-width: 1200px) 42vw, 560px"
                    }
                  />
                )}
              </Reveal>
            </figure>
          )}
          {secondary && (
            <figure className="w-full max-w-250 justify-self-end max-[768px]:w-full max-[768px]:max-w-140 max-[768px]:justify-self-end">
              <Reveal mask duration={0.9} delay={0.1}>
                <SectionMedia
                  image={secondary}
                  ratio={4 / 3}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 2100px) 52vw, 1000px"
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
