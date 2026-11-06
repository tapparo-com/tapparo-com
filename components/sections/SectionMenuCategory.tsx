import type { Allergen, MenuItem } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryImages } from "@/components/menu/CategoryImages";
import type { ContentImage } from "@/lib/content";

type Props = {
  title: string;
  slug: string;
  description?: string | null;
  items: MenuItem[];
  extras?: { _key: string; name: string; price: string }[] | null;
  images?: ContentImage[] | null;
};
const euros = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});
function Price({ item }: { item: MenuItem }) {
  if (item.pricingType === "variants" && item.priceVariants?.length)
    return (
      <div className="ml-auto flex max-w-full flex-wrap justify-end gap-x-5 gap-y-2 text-[16px] leading-[1.5]">
        {item.priceVariants.map((variant) => (
          <span
            key={variant._key}
            className="flex max-w-full items-baseline gap-3"
            data-price={variant.price}
          >
            <span className="wrap-anywhere">{variant.label}</span>
            <span className="whitespace-nowrap tabular-nums">
              {euros.format(variant.price)}
            </span>
          </span>
        ))}
      </div>
    );
  return item.price != null ? (
    <span
      className="ml-auto flex max-w-full flex-wrap justify-end gap-x-5 gap-y-2 text-[16px] leading-[1.5] whitespace-nowrap tabular-nums"
      data-price={item.price}
    >
      {euros.format(item.price)}
    </span>
  ) : null;
}
export function SectionMenuCategory({
  title,
  slug,
  description,
  items,
  extras,
  images,
}: Props) {
  const validImages = (images || []).filter((image) => image?.asset);
  return (
    <section
      id={slug}
      aria-labelledby={`${slug}-heading`}
      className="menu-category scroll-mt-[var(--menu-anchor-clearance,_110px)] py-[clamp(40px,_4vw,_80px)] [&_:is(a,button):focus-visible]:[outline:2px_solid_var(--color-accent)] [&_:is(a,button):focus-visible]:outline-offset-[3px]"
      data-menu-category
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] max-[768px]:px-5 [&_*]:min-w-0">
        <div
          className="mx-auto max-w-156 [&[data-has-images='true']]:max-w-328 max-[1024px]:[&[data-has-images='true']]:max-w-156"
          data-has-images={validImages.length > 0}
        >
          <Reveal className="mb-6 [&_h2]:text-[28px] [&_h2]:leading-[1.15] [&_h2]:font-medium [&_h2]:tracking-[-.025em] [&_h2]:wrap-anywhere [&_p]:mt-4 [&_p]:max-w-[60ch] [&_p]:text-[16px] [&_p]:leading-[1.75] [&_p]:whitespace-pre-line max-[768px]:[&_p]:text-[16px]">
            <h2 id={`${slug}-heading`}>{title}</h2>
            {description && <p>{description}</p>}
          </Reveal>
          <div
            className="grid gap-[clamp(32px,_5vw,_96px)] [&[data-has-images='true']]:grid-cols-2 [&[data-has-images='true']]:items-start max-[1024px]:[&[data-has-images='true']]:grid-cols-1 max-[1024px]:[&[data-has-images='true']_>_figure]:w-[min(100%,_640px)] max-[1024px]:[&[data-has-images='true']_>_figure]:justify-self-end"
            data-has-images={validImages.length > 0}
          >
            <div>
              <ul className="grid grid-cols-1">
                {items.filter(Boolean).map((item) => (
                  <li
                    key={item._id}
                    className="border-t border-solid border-t-border py-4"
                    data-menu-item={item._id}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3 [&_h3]:flex-[1_1_160px] [&_h3]:text-[18px] [&_h3]:leading-[1.5] [&_h3]:font-medium [&_h3]:tracking-[-.015em] [&_h3]:wrap-anywhere">
                      <h3>{item.title}</h3>
                      <Price item={item} />
                    </div>
                    {item.description && (
                      <p className="mt-2 text-[16px] leading-[1.75] wrap-anywhere whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                    {!!item.allergens?.filter(Boolean).length && (
                      <ul
                        className="mt-2 flex flex-wrap justify-end gap-1 [&_a]:flex [&_a]:min-h-11 [&_a]:min-w-11 [&_a]:items-center [&_a]:justify-center [&_a]:text-[13px] [&_a:hover]:underline [&_a:hover]:decoration-accent [&_span]:border-b [&_span]:border-solid [&_span]:border-b-border"
                        aria-label={`Allergene: ${item.title}`}
                      >
                        {item.allergens
                          .filter((a): a is Allergen => !!a)
                          .map((allergen) => (
                            <li key={allergen._id}>
                              <a
                                href={`#allergen-${allergen._id}`}
                                aria-label={`${allergen.code}: ${allergen.label}`}
                              >
                                <span>{allergen.code}</span>
                              </a>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              {!!extras?.length && (
                <section
                  className="mt-8 border-t border-solid border-t-border pt-6 [&_dd]:text-right [&_dl]:grid [&_dl]:max-w-160 [&_dl]:gap-3 [&_dl_>_div]:flex [&_dl_>_div]:justify-between [&_dl_>_div]:gap-6 [&_dl_>_div]:text-[16px] [&_dl_>_div]:leading-[1.5] [&_dl_>_div]:wrap-anywhere [&_h3]:mb-4 [&_h3]:text-[20px] [&_h3]:font-medium"
                  aria-label={`Extras: ${title}`}
                >
                  <h3>Extras</h3>
                  <dl>
                    {extras.map((extra) => (
                      <div key={extra._key}>
                        <dt>{extra.name}</dt>
                        <dd>+{extra.price}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </div>
            {!!validImages.length && (
              <CategoryImages images={validImages} title={title} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
