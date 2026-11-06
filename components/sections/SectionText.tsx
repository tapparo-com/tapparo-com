import type { TextBlock } from "@/lib/content";
import type { ContentImage } from "@/lib/content";
import { PortableText } from "@portabletext/react";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";
import { SectionMedia } from "@/components/ui/SectionMedia";

type Props = {
  label?: string | null;
  body?: TextBlock[] | null;
  image?: ContentImage | null;
  secondaryImage?: ContentImage | null;
  imageFirst?: boolean | null;
  contactAction?: {
    label?: string | null;
    slug?: string | null;
    reason?: string | null;
  } | null;
};
export function SectionText({
  label,
  body,
  image,
  secondaryImage,
  imageFirst,
  contactAction,
}: Props) {
  const images = [image, secondaryImage].filter(
    (item): item is ContentImage => !!item?.asset,
  );
  if (!body?.length && !images.length) return null;

  const copy = body?.length ? (
    <Reveal
      className="section-product-copy w-full focus-within:[transform:none]! focus-within:opacity-[1]!"
      duration={0.85}
    >
      <div className="editorial-text text-[clamp(24px,_2.6vw,_48px)] leading-[1.24] font-normal tracking-[-0.025em] wrap-anywhere [&_:is(h2,_h3,_h4)]:text-[1.14em] [&_:is(h2,_h3,_h4)]:leading-[1.15] [&_:is(h2,_h3,_h4)]:font-medium [&_:is(ul,_ol)]:pl-[1.2em] [&_>_*_+_*]:mt-[0.8em] [&_a]:underline [&_a]:decoration-[1px] [&_a]:underline-offset-[0.15em] [&_a:hover]:decoration-accent [&_ol]:list-decimal [&_strong]:[font-weight:inherit] [&_strong]:text-accent [&_ul]:list-disc">
        <PortableText
          value={body}
          components={{ marks: { link: PortableTextLink } }}
        />
      </div>
      {contactAction?.slug && contactAction.label && (
        <div className="mt-8 flex justify-end">
          <TransitionLink
            className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
            href={`${pathForSlug(contactAction.slug)}${contactAction.reason ? `?anliegen=${encodeURIComponent(contactAction.reason)}` : ""}`}
          >
            <span>{contactAction.label}</span>
            <AnimatedUnderline />
          </TransitionLink>
        </div>
      )}
    </Reveal>
  ) : null;

  return (
    <section
      className="border-t border-solid border-t-border"
      data-home-section="product"
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]">
        {label && (
          <Reveal className="section-header mb-[clamp(36px,_5vw,_90px)] flex flex-wrap items-baseline justify-between gap-6">
            <h2 className="text-[clamp(32px,4vw,64px)] leading-[1.05] font-medium tracking-[-0.055em] wrap-anywhere">
              {label}
            </h2>
          </Reveal>
        )}
        <div
          className="grid gap-[clamp(32px,_4vw,_64px)]"
          data-image-count={images.length}
          data-image-first={!!imageFirst}
        >
          {!imageFirst && copy}
          {images.length > 0 && (
            <Reveal className="w-full" mask duration={0.9}>
              <div
                className="section-product-images isolate grid grid-cols-12 items-start [&[data-image-count='1']]:grid-cols-1"
                data-image-count={images.length}
              >
                {images.map((item, index) => (
                  <figure
                    key={index}
                    className={
                      index === 0
                        ? "section-product-primary col-[1_/_10] row-[1] w-full max-[768px]:col-[1_/_11]"
                        : "z-[1] col-[9_/_-1] row-[1] mt-[36%] w-full max-[768px]:col-[8_/_-1] max-[768px]:mt-[85%]"
                    }
                  >
                    <SectionMedia
                      image={item}
                      natural
                      maxWidth={2100}
                      sizes={
                        images.length === 1
                          ? "(max-width: 767px) calc(100vw - 40px), (max-width: 2100px) 94vw, 1956px"
                          : index === 0
                            ? "(max-width: 767px) 80vw, (max-width: 2100px) 70vw, 1467px"
                            : "(max-width: 767px) 42vw, (max-width: 2100px) 32vw, 652px"
                      }
                    />
                  </figure>
                ))}
              </div>
            </Reveal>
          )}
          {imageFirst && copy}
        </div>
      </div>
    </section>
  );
}
