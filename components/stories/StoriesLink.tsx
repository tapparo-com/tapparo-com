import { TransitionLink } from "@/components/ui/TransitionLink";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import styles from "@/components/homepage/Homepage.module.css";

export function StoriesLink() {
  return <TransitionLink href="/stories" className={styles.animatedLink}>
    <span>alle stories</span><AnimatedUnderline />
  </TransitionLink>;
}
