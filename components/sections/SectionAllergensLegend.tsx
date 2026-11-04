import page from "@/components/pages/Pages.module.css";
import styles from "@/components/menu/Menu.module.css";

type Allergen = { _id: string; code: string; label: string };
export function SectionAllergensLegend({ allergens }: { allergens: Allergen[] }) {
  if (!allergens.length) return null;
  return <section className={`${page.container} ${styles.legend}`} aria-label="Allergene">
    <div className={styles.categoryLayout}>
      <h2>Allergene</h2>
      <dl>{allergens.map(allergen => <div key={allergen._id} id={`allergen-${allergen._id}`}>
        <dt>{allergen.code}</dt><dd>{allergen.label}</dd>
      </div>)}</dl>
    </div>
  </section>;
}
