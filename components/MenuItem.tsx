import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type Props = {
  item: {
    title: string;
    description?: string;
    pricingType: string;
    price?: number;
    priceVariants?: { _key: string; label: string; price: number }[];
    dietaryTags?: string[];
    image?: any;
  };
};

const tagLabels: Record<string, string> = {
  vegan: "Vegan",
  vegetarian: "Vegetarian",
  "gluten-free": "GF",
  "contains-nuts": "Nuts",
};

export function MenuItem({ item }: Props) {
  return (
    <div className="flex gap-4">
      {item.image && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
          <Image
            src={urlFor(item.image).width(160).height(160).url()}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">{item.title}</p>
          {item.description && (
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          )}
          {item.dietaryTags && item.dietaryTags.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              {item.dietaryTags.map((tag) => tagLabels[tag] || tag).join(" · ")}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          {item.pricingType === "single" && item.price != null && (
            <p className="font-medium">€{item.price.toFixed(2)}</p>
          )}
          {item.pricingType === "variants" &&
            item.priceVariants?.map((v) => (
              <p key={v._key} className="text-sm">
                <span className="text-muted">{v.label}</span>{" "}
                <span className="font-medium">€{v.price.toFixed(2)}</span>
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
