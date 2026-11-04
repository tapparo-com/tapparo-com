import { Reveal } from "@/components/ui/Reveal";
import { GalleryScene } from "@/components/homepage/GalleryScene";
import {
  SectionMedia,
  type SectionImage,
} from "@/components/homepage/SectionMedia";
import styles from "@/components/homepage/Homepage.module.css";

type Props = {
  images?: (SectionImage & { _key: string })[] | null;
  caption?: string | null;
};
export function SectionGallery({ images, caption }: Props) {
  const selected = (images || []).filter((image) => image.asset);
  if (!selected.length && !caption) return null;
  // Repeat complete compositions without dropping or reordering owner-selected images.
  const scenes = Array.from({ length: Math.ceil(selected.length / 3) }, (_, index) =>
    selected.slice(index * 3, index * 3 + 3),
  );
  return (
    <section
      className={`${styles.section} ${styles.gallery}`}
      aria-label="Galerie"
      data-home-section="gallery"
    >
      {scenes.map((scene) => (
        <GalleryScene
          key={scene[0]._key}
          items={scene.map((image, index) => {
            const sourceWidth = image.asset?.metadata?.dimensions?.width;
            const croppedWidth = sourceWidth
              ? sourceWidth * (1 - (image.crop?.left || 0) - (image.crop?.right || 0))
              : undefined;
            const small = !!croppedWidth && croppedWidth < 480;
            return {
              key: image._key,
              sourceWidth: croppedWidth,
              content: (
                <SectionMedia
                  image={image}
                  natural
                  sizes={small ? `${Math.ceil(croppedWidth!)}px` : scene.length === 1
                    ? "(max-width: 767px) 90vw, 900px"
                    : index === 2
                      ? "(max-width: 767px) 64vw, 320px"
                      : "(max-width: 767px) 90vw, (max-width: 2100px) 55vw, 1150px"}
                />
              ),
            };
          })}
        />
      ))}
      {caption && (
        <Reveal className={styles.galleryCaption}>
          <p>{caption}</p>
        </Reveal>
      )}
    </section>
  );
}
