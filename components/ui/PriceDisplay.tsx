type PriceDisplayProps = {
  pricingType: string;
  price?: number | null;
  priceVariants?: Array<{ _key: string; label: string; price: number }> | null;
};

export function PriceDisplay({
  pricingType,
  price,
  priceVariants,
}: PriceDisplayProps) {
  if (pricingType === "variants" && priceVariants?.length) {
    return (
      <span className="whitespace-nowrap text-right text-foreground">
        {priceVariants.map((v, i) => (
          <span key={v._key}>
            {i > 0 && " / "}
            {v.label && (
              <span className="text-muted">{v.label} </span>
            )}
            &euro;{v.price.toFixed(2)}
          </span>
        ))}
      </span>
    );
  }

  if (price != null) {
    return (
      <span className="whitespace-nowrap text-right text-foreground">
        &euro;{price.toFixed(2)}
      </span>
    );
  }

  return null;
}
