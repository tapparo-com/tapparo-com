"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";

type Allergen = {
  _id: string;
  code: string;
  label: string;
};

type MenuItem = {
  _id: string;
  title: string;
  description?: string | null;
  pricingType: string;
  price?: number | null;
  priceVariants?: Array<{ _key: string; label: string; price: number }> | null;
  allergens?: Allergen[] | null;
};

type Extra = {
  _key: string;
  name: string;
  price: string;
};

type CategoryImage = {
  _key: string;
  asset?: { _id: string; url: string };
  alt?: string;
};

type SectionMenuCategoryProps = {
  title: string;
  slug: string;
  description?: string | null;
  items: MenuItem[];
  extras?: Extra[] | null;
  images?: CategoryImage[] | null;
};

function PriceVariants({ item }: { item: MenuItem }) {
  if (item.pricingType === "variants" && item.priceVariants?.length) {
    return (
      <div className="flex items-center gap-6">
        {item.priceVariants.map((v) => (
          <span
            key={v._key}
            className="flex items-center gap-3 text-base uppercase leading-7 text-foreground"
          >
            <span>{v.label}</span>
            <span>&euro;{v.price.toFixed(2)}</span>
          </span>
        ))}
      </div>
    );
  }

  if (item.price != null) {
    return (
      <span className="text-base uppercase leading-7 text-foreground">
        &euro;{item.price.toFixed(2)}
      </span>
    );
  }

  return null;
}

export function SectionMenuCategory({
  title,
  slug,
  description,
  items,
  extras,
  images,
}: SectionMenuCategoryProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const hasImages = images && images.length > 0;
  const hasMultipleImages = images && images.length > 1;

  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-heading`}
      className="scroll-mt-[140px] overflow-clip bg-background px-3 py-20 md:px-8"
    >
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          {/* Col-1: category title + description */}
          <div className="mb-8 md:mb-0 md:col-start-1">
            <h2
              id={`${slug}-heading`}
              className="text-base uppercase text-foreground"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-7 text-base leading-7 text-muted">
                {description}
              </p>
            )}
          </div>

          {/* Col-2: items + image side by side */}
          <div className="md:col-start-2">
            <div className="flex flex-col gap-[60px] xl:flex-row xl:gap-10">
              {/* Items list */}
              <div className="flex max-w-gutter flex-col gap-[60px] xl:basis-1/2">
                <div className="flex flex-col gap-5">
                  {items.filter(Boolean).map((item) => (
                    <div key={item._id} className="flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-base font-medium uppercase leading-7 text-foreground">
                          {item.title}
                        </span>
                        <PriceVariants item={item} />
                      </div>
                      {item.description && (
                        <p className="text-base leading-7 text-[#404040]">
                          {item.description}
                        </p>
                      )}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="flex gap-1 pt-2">
                          {item.allergens.map((a) => (
                            <abbr
                              key={a._id}
                              title={a.label}
                              className="flex size-5 items-center justify-center bg-foreground/[0.08] text-xs text-foreground no-underline"
                            >
                              {a.code}
                            </abbr>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {extras && extras.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-base font-medium uppercase leading-7 text-foreground">
                      Extras
                    </span>
                    <div className="flex flex-wrap items-center">
                      {extras.map((extra, i) => (
                        <span key={extra._key} className="flex items-center">
                          {i > 0 && (
                            <span className="px-3 text-base leading-7 text-muted">
                              |
                            </span>
                          )}
                          <span className="flex items-center gap-3 text-base uppercase leading-7 text-foreground">
                            <span>{extra.name}</span>
                            <span>+{extra.price}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Image with carousel arrows */}
              {hasImages && (
                <div className="relative max-w-gutter xl:flex-1">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={urlFor(images[imageIndex]).width(624).height(624).url()}
                      alt={images[imageIndex]?.alt || title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {hasMultipleImages && (
                    <div className="absolute -bottom-12 right-0 flex gap-0.5">
                      <button
                        onClick={() =>
                          setImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        aria-label="Previous image"
                        className="flex size-12 items-center justify-center bg-background/75 text-accent backdrop-blur-sm"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M6 16H26M6 16L16 6M6 16L16 26"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() =>
                          setImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        aria-label="Next image"
                        className="flex size-12 items-center justify-center bg-background/75 text-accent backdrop-blur-sm"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                        >
                          <path
                            d="M26 16H6M26 16L16 26M26 16L16 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
