import { TransitionLink } from "@/components/ui/TransitionLink";

type ButtonLinkProps = {
  href: string;
  label: string;
  variant?: "filled" | "outline";
};

export function ButtonLink({
  href,
  label,
  variant = "filled",
}: ButtonLinkProps) {
  const base =
    "inline-flex items-center gap-1 border px-[18px] py-1.5 text-base font-medium uppercase leading-7 transition-colors";

  const variants = {
    filled:
      "border-accent bg-accent text-background hover:bg-accent/90",
    outline:
      "border-accent bg-transparent text-accent hover:bg-accent/5",
  };

  return (
    <TransitionLink href={href} className={`${base} ${variants[variant]}`}>
      <span>{label}</span>
      <span>{"->"}</span>
    </TransitionLink>
  );
}
