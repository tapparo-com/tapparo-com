"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/ui/PageTransition";
import { isOrderingHref } from "@/lib/ordering";

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
  const url = typeof href === "string" ? href : href.pathname || "/";
  const isOrdering = isOrderingHref(url);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Let external links, new tabs, and modifier keys pass through
    if (
      url.startsWith("http") ||
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      (props.target && props.target !== "_self") ||
      props.download !== undefined
    ) {
      return;
    }

    // /order leaves the site. Use a full navigation without the internal-page overlay.
    if (isOrdering) {
      e.preventDefault();
      window.location.assign(e.currentTarget.href);
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
    <Link href={href} onClick={handleClick} {...props} prefetch={isOrdering ? false : props.prefetch}>
      {children}
    </Link>
  );
}
