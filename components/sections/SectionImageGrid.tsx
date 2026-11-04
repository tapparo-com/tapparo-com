import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/Reveal";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  title?: string | null;
  images?: (SectionImage & { _key: string })[] | null;
};
export function SectionImageGrid({ title, images }: Props) {
  const selected = (images || []).filter((image) => image.asset);
  if (!title && !selected.length) return null;
  return (
    <section className={styles.section} data-home-section="mood-images">
      {title && (
        <Reveal className={styles.sectionHeader}>
          <h2 className={styles.title}>{title}</h2>
        </Reveal>
      )}
      <div className={styles.galleryGrid}>
        {selected.map((image, index) => {
          const width = image.asset?.metadata?.dimensions?.width;
          return (
            <figure
              className={styles.galleryFigure}
              key={image._key}
              data-small={!!width && width < 480}
              style={
                { "--source-width": `${width || 1600}px` } as CSSProperties
              }
            >
              <Reveal mask delay={(index % 3) * 0.08}>
                <SectionMedia image={image} natural />
              </Reveal>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
