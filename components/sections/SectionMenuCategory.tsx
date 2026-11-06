import { Reveal } from "@/components/ui/Reveal";
import { CategoryImages } from "@/components/menu/CategoryImages";
import type { SectionImage } from "@/components/homepage/SectionMedia";
import page from "@/components/pages/Pages.module.css";
import styles from "@/components/menu/Menu.module.css";

type Allergen = { _id: string; code: string; label: string };
type MenuItem = {
  _id: string; title: string; description?: string | null; pricingType: string; price?: number | null;
  priceVariants?: { _key: string; label: string; price: number }[] | null;
  allergens?: (Allergen | null)[] | null;
};
type Props = {
  title: string; slug: string; description?: string | null; items: MenuItem[];
  extras?: { _key: string; name: string; price: string }[] | null;
  images?: SectionImage[] | null;
};
const euros = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
function Price({ item }: { item: MenuItem }) {
  if (item.pricingType === "variants" && item.priceVariants?.length) return <div className={styles.prices}>
    {item.priceVariants.map(variant => <span key={variant._key} className={styles.variant} data-price={variant.price}>
      <span className={styles.variantLabel}>{variant.label}</span><span className={styles.amount}>{euros.format(variant.price)}</span>
    </span>)}
  </div>;
  return item.price != null ? <span className={`${styles.prices} ${styles.amount}`} data-price={item.price}>{euros.format(item.price)}</span> : null;
}
export function SectionMenuCategory({ title, slug, description, items, extras, images }: Props) {
  const validImages = (images || []).filter(image => image?.asset);
  return <section id={slug} aria-labelledby={`${slug}-heading`} className={styles.category} data-menu-category>
    <div className={page.container}>
      <div className={styles.categoryLayout} data-has-images={validImages.length > 0}>
        <Reveal className={styles.categoryHead}>
          <h2 id={`${slug}-heading`}>{title}</h2>
          {description && <p>{description}</p>}
        </Reveal>
        <div className={styles.content} data-has-images={validImages.length > 0}>
          <div>
            <ul className={styles.items}>
              {items.filter(Boolean).map(item => <li key={item._id} className={styles.item} data-menu-item={item._id}>
                <div className={styles.itemHeading}><h3>{item.title}</h3><Price item={item} /></div>
                {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                {!!item.allergens?.filter(Boolean).length && <ul className={styles.allergenCodes} aria-label={`Allergene: ${item.title}`}>
                  {item.allergens.filter((a): a is Allergen => !!a).map(allergen => <li key={allergen._id}>
                    <a href={`#allergen-${allergen._id}`} aria-label={`${allergen.code}: ${allergen.label}`}><span>{allergen.code}</span></a>
                  </li>)}
                </ul>}
              </li>)}
            </ul>
            {!!extras?.length && <section className={styles.extras} aria-label={`Extras: ${title}`}>
              <h3>Extras</h3><dl>{extras.map(extra => <div key={extra._key}><dt>{extra.name}</dt><dd>+{extra.price}</dd></div>)}</dl>
            </section>}
          </div>
          {!!validImages.length && <CategoryImages images={validImages} title={title} />}
        </div>
      </div>
    </div>
  </section>;
}
