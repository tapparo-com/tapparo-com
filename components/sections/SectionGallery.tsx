import type { ContentImage } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryScene } from "@/components/homepage/GalleryScene";
import { SectionMedia } from "@/components/ui/SectionMedia";

type Props = {
  images?: (ContentImage & { _key: string })[] | null;
  caption?: string | null;
};
export function SectionGallery({ images, caption }: Props) {
  const selected = (images || []).filter((image) => image.asset);
  if (!selected.length && !caption) return null;
  // Repeat complete compositions without dropping or reordering owner-selected images.
  const scenes = Array.from(
    { length: Math.ceil(selected.length / 3) },
    (_, index) => selected.slice(index * 3, index * 3 + 3),
  );
  return (
    <section
      className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pt-[clamp(40px,_5vw,_100px)] pb-[clamp(64px,_8vw,_160px)] max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px]"
      aria-label="Galerie"
      data-home-section="gallery"
    >
      {scenes.map((scene) => (
        <GalleryScene
          key={scene[0]._key}
          items={scene.map((image, index) => {
            const sourceWidth = image.asset?.metadata?.dimensions?.width;
            const croppedWidth = sourceWidth
              ? sourceWidth *
                (1 - (image.crop?.left || 0) - (image.crop?.right || 0))
              : undefined;
            const small = !!croppedWidth && croppedWidth < 480;
            return {
              key: image._key,
              sourceWidth: croppedWidth,
              content: (
                <SectionMedia
                  image={image}
                  natural
                  sizes={
                    small
                      ? `${Math.ceil(croppedWidth!)}px`
                      : scene.length === 1
                        ? "(max-width: 767px) 90vw, 900px"
                        : index === 2
                          ? "(max-width: 767px) 64vw, 320px"
                          : index === 0
                            ? "(max-width: 767px) 78vw, (max-width: 2100px) 47vw, 978px"
                            : "(max-width: 767px) 100vw, (max-width: 2100px) 55vw, 1141px"
                  }
                />
              ),
            };
          })}
        />
      ))}
      {caption && (
        <Reveal className="mt-[clamp(32px,_4vw,_80px)] mr-0 mb-0 ml-auto max-w-230 text-[clamp(24px,_3vw,_48px)] leading-[1.2] tracking-[-0.025em] wrap-anywhere">
          <p>{caption}</p>
        </Reveal>
      )}
    </section>
  );
}
