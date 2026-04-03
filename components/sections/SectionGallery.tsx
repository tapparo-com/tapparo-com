import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type GalleryImage = {
  _key: string;
  asset: { _id: string; url: string; metadata?: { lqip?: string } };
  alt?: string;
};

type SectionGalleryProps = {
  images?: GalleryImage[] | null;
  caption?: string | null;
};

export function SectionGallery({ images, caption }: SectionGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="overflow-clip bg-background px-3 py-10 md:px-8 md:py-10 xl:py-10">
      {/* Horizontal image row — overflows off-screen */}
      <div className="mx-auto max-w-[1856px]">
        <div className="flex items-center gap-3 md:gap-10">
          {images.map((img) => (
            <div
              key={img._key}
              className="w-[328px] shrink-0 md:w-[480px] xl:w-[624px]"
            >
              <div className="relative aspect-[730/1015] overflow-hidden">
                <Image
                  src={urlFor(img).width(730).height(1015).url()}
                  alt={img.alt || ""}
                  fill
                  className="object-cover"
                  placeholder={img.asset?.metadata?.lqip ? "blur" : undefined}
                  blurDataURL={img.asset?.metadata?.lqip || undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caption below in sidebar grid layout */}
      {caption && (
        <div className="mx-auto max-w-[1856px] px-3 pt-10 md:px-8">
          <div className="md:grid grid-cols-sidebar md:gap-10">
            <div className="md:col-start-2">
              <p className="max-w-gutter text-section-heading font-sans font-medium text-foreground">
                {caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
