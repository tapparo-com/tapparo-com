import { AllergenBadge } from "@/components/ui/AllergenBadge";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

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

type SectionMenuCategoryProps = {
  title: string;
  slug: string;
  description?: string | null;
  items: MenuItem[];
  extras?: Extra[] | null;
};

export function SectionMenuCategory({
  title,
  slug,
  description,
  items,
  extras,
}: SectionMenuCategoryProps) {
  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-heading`}
      className="mx-auto max-w-[1856px] scroll-mt-8 px-4 py-8 md:px-8 md:py-10 xl:py-12"
    >
      <div className="flex items-baseline gap-4">
        <h2
          id={`${slug}-heading`}
          className="font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl xl:text-[28px]"
        >
          {title}
        </h2>
        {description && (
          <p className="font-sans text-sm text-muted">{description}</p>
        )}
      </div>

      <hr className="mt-3 border-border" />

      {items.length > 0 && (
        <ul
          role="list"
          className="mt-5 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2 md:gap-x-8 md:gap-y-[18px] xl:gap-x-12 xl:gap-y-5"
        >
          {items.map((item) => (
            <li key={item._id}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-sans text-sm font-semibold text-foreground md:text-base">
                  {item.title}
                </h3>
                <PriceDisplay
                  pricingType={item.pricingType}
                  price={item.price}
                  priceVariants={item.priceVariants}
                />
              </div>
              {item.description && (
                <p className="mt-1 font-sans text-xs leading-relaxed text-muted md:text-sm">
                  {item.description}
                </p>
              )}
              {item.allergens && item.allergens.length > 0 && (
                <ul
                  className="mt-1.5 flex gap-1"
                  aria-label="Allergens"
                >
                  {item.allergens.map((a) => (
                    <li key={a._id}>
                      <AllergenBadge code={a.code} label={a.label} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {extras && extras.length > 0 && (
        <aside className="mt-6 border-t border-border pt-4">
          <h3 className="sr-only">Extras</h3>
          <p className="mb-2 font-sans text-xs text-muted">Extras</p>
          <dl className="flex flex-wrap gap-x-4 gap-y-1">
            {extras.map((extra) => (
              <div key={extra._key} className="flex items-center gap-1">
                <dt className="font-sans text-xs font-semibold text-foreground">
                  {extra.name}
                </dt>
                <dd className="font-sans text-xs text-accent">
                  {extra.price}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </section>
  );
}
