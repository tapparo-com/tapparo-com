import { AllergenBadge } from "@/components/ui/AllergenBadge";

type Allergen = {
  _id: string;
  code: string;
  label: string;
};

type Category = {
  _id: string;
  title: string;
  slug: string;
};

type SectionMenuHeaderProps = {
  title: string;
  subtitle?: string | null;
  allergens: Allergen[];
  categories: Category[];
};

export function SectionMenuHeader({
  title,
  subtitle,
  allergens,
  categories,
}: SectionMenuHeaderProps) {
  return (
    <header className="mx-auto max-w-[1856px] px-4 pt-12 pb-8 md:px-8 md:pt-16 md:pb-10 xl:pt-20 xl:pb-12">
      <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl xl:text-[64px] xl:leading-none">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 max-w-md font-body text-sm text-muted md:mt-4 md:text-base">
          {subtitle}
        </p>
      )}

      {categories.length > 0 && (
        <nav aria-label="Menu categories" className="mt-6 md:mt-8 xl:mt-10">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
            {categories.map((cat) => (
              <li key={cat._id}>
                <a
                  href={`#${cat.slug}`}
                  className="font-sans text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent md:text-base"
                >
                  {cat.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <hr className="mt-6 border-border md:mt-8" />

      {allergens.length > 0 && (
        <aside aria-label="Allergen legend" className="mt-4 md:mt-6">
          <p className="mb-2 font-body text-xs text-muted">Allergens</p>
          <ul className="flex flex-wrap gap-2">
            {allergens.map((a) => (
              <li key={a._id} className="flex items-center gap-1.5">
                <AllergenBadge code={a.code} label={a.label} />
                <span className="font-body text-xs text-muted">{a.label}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </header>
  );
}
