"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/ui/PageTransition";

type TransitionLinkProps = Omit<
  React.ComponentProps<typeof Link>,
  "onClick"
> & {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigateTo } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const url = typeof href === "string" ? href : href.pathname || "/";

    // Let external links, new tabs, and modifier keys pass through
    if (
      url.startsWith("http") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    // Skip transition if already on this page
    if (url === pathname) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    navigateTo(url);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
