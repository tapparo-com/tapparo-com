import type { ContentImage } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteStatement } from "@/components/homepage/QuoteStatement";
import { SectionMedia } from "@/components/ui/SectionMedia";

type Props = {
  author?: string | null;
  quote?: string | null;
  image?: ContentImage | null;
  secondaryImage?: ContentImage | null;
};
export function SectionQuote({ author, quote, image, secondaryImage }: Props) {
  const hasQuote = Boolean(quote?.trim());
  const images = [image, secondaryImage].filter(
    (item): item is ContentImage => !!item?.asset,
  );
  const hasImage = images.length > 0;
  if (!hasQuote && !hasImage) return null;
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(80px,_9vw,_180px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      data-home-section="quote"
    >
      <div
        className="section-quote-grid grid grid-cols-[minmax(0,_1.9fr)_minmax(0,_1fr)] items-end gap-[clamp(32px,_5vw,_96px)] data-[has-quote=false]:grid-cols-1 max-[1024px]:grid-cols-1 max-[1024px]:gap-10 [&[data-has-image='false']]:max-w-320 [&[data-has-image='false']]:grid-cols-1"
        data-has-image={hasImage}
        data-has-quote={hasQuote}
      >
        {hasQuote && <QuoteStatement quote={quote!} author={author} />}
        {hasImage && (
          <figure
            className="section-quote-media w-full max-w-120 justify-self-end max-[1024px]:w-[70%] max-[1024px]:max-w-100 [&[data-image-count='2']]:max-w-160 max-[1024px]:[&[data-image-count='2']]:w-[90%] max-[1024px]:[&[data-image-count='2']]:max-w-140"
            data-image-count={images.length}
          >
            <Reveal mask duration={0.9}>
              <div
                className="section-quote-images isolate grid grid-cols-12 items-start"
                data-image-count={images.length}
              >
                {images.map((item, index) => (
                  <div
                    key={index}
                    className={
                      index === 0
                        ? "section-quote-primary col-[1_/_12] row-[1]"
                        : "z-[1] col-[8_/_-1] row-[1] mt-[140%]"
                    }
                  >
                    <SectionMedia
                      image={{
                        ...item,
                        alt: item.alt ?? (index === 0 ? author || "" : ""),
                      }}
                      natural
                      sizes={
                        images.length === 1
                          ? "(max-width: 1023px) 70vw, (max-width: 1600px) 32vw, 480px"
                          : index === 0
                            ? "(max-width: 1023px) 83vw, (max-width: 2100px) 30vw, 587px"
                            : "(max-width: 1023px) 38vw, (max-width: 2100px) 14vw, 267px"
                      }
                    />
                  </div>
                ))}
              </div>
            </Reveal>
            {!hasQuote && author && (
              <figcaption className="mt-[clamp(28px,_3vw,_56px)] text-[clamp(14px,_1.1vw,_18px)] leading-[1.5] wrap-anywhere">
                {author}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  );
}
