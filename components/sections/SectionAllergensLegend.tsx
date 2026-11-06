import type { Allergen } from "@/lib/content";

export function SectionAllergensLegend({
  allergens,
}: {
  allergens: Allergen[];
}) {
  if (!allergens.length) return null;
  return (
    <section
      className="border-t border-solid border-t-border py-[clamp(48px,_6vw,_120px)] [&_dd]:wrap-anywhere [&_dl]:grid [&_dl]:grid-cols-3 [&_dl]:gap-x-12 [&_dl]:gap-y-6 max-[1024px]:[&_dl]:grid-cols-2 max-[768px]:[&_dl]:grid-cols-1 [&_dl_>_div]:flex [&_dl_>_div]:scroll-mt-[var(--menu-anchor-clearance,_110px)] [&_dl_>_div]:gap-4 [&_dl_>_div]:text-[16px] [&_dl_>_div]:leading-[1.5] [&_dl_>_div:target]:[outline:1px_solid_var(--color-accent)] [&_dl_>_div:target]:outline-offset-[8px] [&_dt]:shrink-0 [&_dt]:font-semibold [&_h2]:mb-8 [&_h2]:text-[28px] [&_h2]:font-medium [&_h2]:tracking-[-.035em]"
      aria-label="Allergene"
    >
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] max-[768px]:px-5 [&_*]:min-w-0">
        <div className="mx-auto max-w-156">
          <h2>Allergene</h2>
          <dl>
            {allergens.map((allergen) => (
              <div key={allergen._id} id={`allergen-${allergen._id}`}>
                <dt>{allergen.code}</dt>
                <dd>{allergen.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
