type Allergen = {
  _id: string;
  code: string;
  label: string;
};

type SectionAllergensLegendProps = {
  allergens: Allergen[];
};

export function SectionAllergensLegend({
  allergens,
}: SectionAllergensLegendProps) {
  if (allergens.length === 0) return null;

  return (
    <section
      aria-label="Allergens legend"
      className="overflow-clip bg-background px-3 py-20 md:px-8"
    >
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          <div className="md:col-start-1">
            <span className="text-base uppercase text-foreground">
              Allergens
            </span>
          </div>
          <div className="mt-4 md:mt-0 md:col-start-2">
            <div className="flex flex-wrap gap-x-5 gap-y-3.5">
              {allergens.map((a) => (
                <div key={a._id} className="flex items-center gap-1">
                  <div className="flex size-5 items-center justify-center bg-foreground/[0.08] text-xs text-foreground">
                    {a.code}
                  </div>
                  <span className="text-xs text-muted">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
