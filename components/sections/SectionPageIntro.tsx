import { Reveal } from "@/components/ui/Reveal";
import styles from "@/components/pages/Pages.module.css";

export function SectionPageIntro({ title, description, narrow = false }: { title: string; description?: string | null; narrow?: boolean }) {
  return <header className={`${styles.container} ${styles.intro}`}>
    <div className={narrow ? styles.introReading : undefined}>
      <Reveal><h1 className={styles.title}>{title}</h1></Reveal>
      {description && <Reveal delay={.12}><p className={styles.description}>{description}</p></Reveal>}
    </div>
  </header>;
}
