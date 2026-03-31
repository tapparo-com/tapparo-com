import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type GridImage = {
  _key: string;
  asset: { _id: string; url: string; metadata?: { lqip?: string } };
  alt?: string;
};

type SectionImageGridProps = {
  title?: string | null;
  images?: GridImage[] | null;
};

export function SectionImageGrid({ title, images }: SectionImageGridProps) {
  const hasImages = images && images.length > 0;

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[1856px] px-3 py-24 md:px-8 md:py-24 xl:py-[180px]">
        <div className="grid gap-8 md:grid-cols-[1fr_3fr]">
          {title && (
            <h2 className="font-sans text-base text-foreground">{title}</h2>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {hasImages
              ? images.map((img) => (
                  <div key={img._key} className="aspect-[4/5] overflow-hidden">
                    <Image
                      src={urlFor(img).width(624).height(780).url()}
                      alt={img.alt || ""}
                      width={624}
                      height={780}
                      className="h-full w-full object-cover"
                      placeholder={
                        img.asset?.metadata?.lqip ? "blur" : undefined
                      }
                      blurDataURL={img.asset?.metadata?.lqip || undefined}
                    />
                  </div>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-[#A0A0A0]"
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
