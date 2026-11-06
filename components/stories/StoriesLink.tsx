import { TransitionLink } from "@/components/ui/TransitionLink";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";

export function StoriesLink() {
  return (
    <TransitionLink
      href="/stories"
      className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
    >
      <span>alle stories</span>
      <AnimatedUnderline />
    </TransitionLink>
  );
}
