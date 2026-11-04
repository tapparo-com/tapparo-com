import { Reveal } from "@/components/ui/Reveal";
import { QuoteStatement } from "@/components/homepage/QuoteStatement";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  author?: string | null;
  quote?: string | null;
  image?: SectionImage | null;
  secondaryImage?: SectionImage | null;
};
export function SectionQuote({
  author,
  quote,
  image,
  secondaryImage,
}: Props) {
  const hasQuote = Boolean(quote?.trim());
  const images = [image, secondaryImage].filter((item): item is SectionImage => !!item?.asset);
  const hasImage = images.length > 0;
  if (!hasQuote && !hasImage) return null;
  return (
    <section
      className={`${styles.section} ${styles.quote}`}
      data-home-section="quote"
    >
      <div className={styles.quoteGrid} data-has-image={hasImage} data-has-quote={hasQuote}>
        {hasQuote && <QuoteStatement quote={quote!} author={author} />}
        {hasImage && (
          <figure className={styles.quoteMedia} data-image-count={images.length}>
            <Reveal mask duration={0.9}>
              <div className={styles.quoteImages} data-image-count={images.length}>
                {images.map((item, index) => (
                  <div key={index} className={index === 0 ? styles.quotePrimary : styles.quoteSecondary}>
                    <SectionMedia
                      image={{ ...item, alt: item.alt ?? (index === 0 ? author || "" : "") }}
                      natural
                      sizes={images.length === 1
                        ? "(max-width: 1023px) 70vw, (max-width: 1600px) 32vw, 480px"
                        : index === 0
                          ? "(max-width: 1023px) 75vw, (max-width: 2100px) 27vw, 534px"
                          : "(max-width: 1023px) 45vw, (max-width: 2100px) 16vw, 320px"}
                    />
                  </div>
                ))}
              </div>
            </Reveal>
            {!hasQuote && author && <figcaption className={styles.attribution}>{author}</figcaption>}
          </figure>
        )}
      </div>
    </section>
  );
}
