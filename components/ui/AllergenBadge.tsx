type AllergenBadgeProps = {
  code: string;
  label: string;
};

export function AllergenBadge({ code, label }: AllergenBadgeProps) {
  return (
    <abbr
      title={label}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-foreground/[0.07] text-[10px] font-medium text-muted no-underline"
    >
      {code}
    </abbr>
  );
}
