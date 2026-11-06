import { PortableText } from "@portabletext/react";
import { PortableTextLink } from "@/components/ui/PortableTextLink";
import { Reveal } from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { pathForSlug } from "@/lib/urls";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  label?: string | null;
  body?: any[] | null;
  image?: SectionImage | null;
  secondaryImage?: SectionImage | null;
  imageFirst?: boolean;
  contactAction?: { label?: string; slug?: string; reason?: string } | null;
};
export function SectionText({ label, body, image, secondaryImage, imageFirst, contactAction }: Props) {
  const images = [image, secondaryImage].filter(
    (item): item is SectionImage => !!item?.asset,
  );
  if (!body?.length && !images.length) return null;

  const copy = body?.length ? (
    <Reveal className={styles.productCopy} duration={0.85}>
      <div className={styles.richText}>
        <PortableText
          value={body}
          components={{ marks: { link: PortableTextLink } }}
        />
      </div>
      {contactAction?.slug && contactAction.label && <div className={styles.productAction}>
        <TransitionLink className={styles.animatedLink} href={`${pathForSlug(contactAction.slug)}${contactAction.reason ? `?anliegen=${encodeURIComponent(contactAction.reason)}` : ""}`}>
          <span>{contactAction.label}</span><AnimatedUnderline />
        </TransitionLink>
      </div>}
    </Reveal>
  ) : null;

  return (
    <section
      className={styles.product}
      data-home-section="product"
    >
      <div className={styles.section}>
        {label && (
          <Reveal className={styles.sectionHeader}>
            <h2 className={`${styles.title} ${styles.productTitle}`}>{label}</h2>
          </Reveal>
        )}
        <div
          className={styles.productGrid}
          data-image-count={images.length}
          data-image-first={!!imageFirst}
        >
          {!imageFirst && copy}
          {images.length > 0 && (
            <Reveal className={styles.productImageReveal} mask duration={0.9}>
              <div className={styles.productImages} data-image-count={images.length}>
                {images.map((item, index) => (
                  <figure
                    key={index}
                    className={index === 0 ? styles.productPrimary : styles.productSecondary}
                  >
                    <SectionMedia
                      image={item}
                      natural
                      maxWidth={2100}
                      sizes={images.length === 1
                        ? "(max-width: 767px) calc(100vw - 40px), (max-width: 2100px) 94vw, 1956px"
                        : index === 0
                          ? "(max-width: 767px) 80vw, (max-width: 2100px) 70vw, 1467px"
                          : "(max-width: 767px) 42vw, (max-width: 2100px) 32vw, 652px"}
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
