import { Reveal } from "@/components/ui/Reveal";
import { StatementAccent } from "@/components/homepage/StatementAccent";
import styles from "@/components/homepage/Homepage.module.css";

function splitStatement(text: string) {
  const breaks = [...text.matchAll(/\s+/gu)].filter(
    (match) => text.slice(0, match.index).trim() && text.slice(match.index + match[0].length).trim(),
  );
  // Respect an author's line break, then sentence punctuation, then a balanced word break.
  const boundary = breaks.find(match => match[0].includes("\n"))
    || breaks.find(match => /[.!?…][”"'’»)]*$/.test(text.slice(0, match.index)))
    || breaks.reduce<(typeof breaks)[number] | undefined>((closest, match) =>
      !closest || Math.abs(match.index - text.length / 2) < Math.abs(closest.index - text.length / 2)
        ? match : closest, undefined);
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
      className={`${styles.section} ${styles.statement}`}
      data-home-section="statement"
      data-long={text.length > 64}
    >
      <div className={styles.statementComposition}>
        <Reveal mask duration={0.9}>
          <p>{opening}</p>
        </Reveal>
        {closing && <StatementAccent text={closing} />}
      </div>
    </section>
  );
}
