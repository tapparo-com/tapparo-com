import { Reveal } from "@/components/ui/Reveal";

type SectionPageIntroProps = {
  title: string;
  description?: string | null;
};

export function SectionPageIntro({ title, description }: SectionPageIntroProps) {
  return (
    <Reveal>
    <section className="overflow-clip bg-background px-3 py-14 md:px-8 md:py-20 xl:pb-20 xl:pt-40">
      <div className="mx-auto max-w-[1856px]">
        <div className="md:grid grid-cols-sidebar md:gap-10">
          <div className="md:col-start-2">
            <div className="flex max-w-gutter flex-col gap-[60px]">
              <h1 className="text-[30px] font-medium leading-[1.1] tracking-[-0.6px] text-foreground md:text-[42px] md:tracking-[-0.84px]">
                {title}
              </h1>
              {description && (
                <p className="text-base leading-7 text-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </Reveal>
  );
}
