import { Reveal } from "@/components/ui/Reveal";
import { StatementAccent } from "@/components/homepage/StatementAccent";

function splitStatement(text: string) {
  const breaks = [...text.matchAll(/\s+/gu)].filter(
    (match) =>
      text.slice(0, match.index).trim() &&
      text.slice(match.index + match[0].length).trim(),
  );
  // Respect an author's line break, then sentence punctuation, then a balanced word break.
  const boundary =
    breaks.find((match) => match[0].includes("\n")) ||
    breaks.find((match) =>
      /[.!?…][”"'’»)]*$/.test(text.slice(0, match.index)),
    ) ||
    breaks.reduce<(typeof breaks)[number] | undefined>(
      (closest, match) =>
        !closest ||
        Math.abs(match.index - text.length / 2) <
          Math.abs(closest.index - text.length / 2)
          ? match
          : closest,
      undefined,
    );
  if (!boundary) return [text];
  const index = boundary.index + boundary[0].length;
  // Retain every character, including the separator, for copying and assistive technology.
  return [text.slice(0, index), text.slice(index)];
}

export function SectionLargeText({ text }: { text?: string | null }) {
  if (!text?.trim()) return null;
  const [opening, closing] = splitStatement(text);
  return (
    <section
      className="section-statement mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] py-[clamp(72px,_9vw,_176px)] text-foreground max-[768px]:px-5 [&_*]:min-w-0 [&_button:focus-visible]:[outline:2px_solid_var(--color-accent)] [&_button:focus-visible]:outline-offset-[6px] [&_p]:w-fit [&_p]:max-w-full [&_p]:text-[clamp(64px,_13vw,_260px)] [&_p]:leading-[1.04] [&_p]:font-medium [&_p]:tracking-[-0.055em] [&_p]:text-balance [&_p]:wrap-anywhere [&_p]:whitespace-pre-line max-[768px]:[&_p]:text-[clamp(56px,_19vw,_144px)] [&[data-long='true']_p]:text-[clamp(34px,_6vw,_120px)] [&[data-long='true']_p]:leading-[1.1] [&[data-long='true']_p]:tracking-[-0.04em]"
      data-home-section="statement"
      data-long={text.length > 64}
    >
      <div className="grid gap-[clamp(12px,_2vw,_40px)]">
        <Reveal mask duration={0.9}>
          <p>{opening}</p>
        </Reveal>
        {closing && <StatementAccent text={closing} />}
      </div>
    </section>
  );
}
