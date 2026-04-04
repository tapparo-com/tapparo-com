import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

type SectionTextProps = {
  label?: string | null;
  body?: any[] | null;
  image?: {
    asset?: { _id: string; url: string; metadata?: { lqip?: string } };
    alt?: string;
  } | null;
  imageFirst?: boolean;
};

export function SectionText({
  label,
  body,
  image,
  imageFirst,
}: SectionTextProps) {
  if (!body) return null;

  const hasImage = !!image?.asset;

  const textColumn = (
    <div className={`flex max-w-gutter flex-col gap-5${hasImage ? " xl:flex-1" : ""}`}>
      <div className="text-section-heading font-medium text-foreground">
        <PortableText value={body} />
      </div>
    </div>
  );

  const imageColumn = image?.asset ? (
    <div className="max-w-gutter xl:flex-1">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={urlFor(image).width(624).height(624).url()}
          alt={image.alt || ""}
          fill
          sizes="(max-width: 1280px) 100vw, 624px"
          className="object-cover"
          placeholder={image.asset.metadata?.lqip ? "blur" : undefined}
          blurDataURL={image.asset.metadata?.lqip || undefined}
        />
      </div>
    </div>
  ) : null;

  return (
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: Label */}
          {label && (
            <div className="mb-8 md:mb-0 md:col-start-1">
              <span className="text-base uppercase text-foreground">
                {label}
              </span>
            </div>
          )}

          {/* Col-2: Text + Image */}
          <div className="md:col-start-2">
            <div className="flex flex-col gap-[60px] xl:flex-row xl:items-start xl:gap-10">
              {imageFirst ? (
                <>
                  {imageColumn}
                  {textColumn}
                </>
              ) : (
                <>
                  {textColumn}
                  {imageColumn}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
