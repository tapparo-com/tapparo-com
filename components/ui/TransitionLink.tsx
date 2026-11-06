"use client";

import Link from "next/link";
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
  const url = typeof href === "string" ? href : href.pathname || "/";
  const isOrdering = isOrderingHref(url);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Use the rendered URL so object hrefs retain their query and fragment.
    const destination = new URL(e.currentTarget.href);
    // Let external links, new tabs, and modifier keys pass through.
    if (
      destination.origin !== window.location.origin ||
      !["http:", "https:"].includes(destination.protocol) ||
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
    if (isOrderingHref(destination.pathname)) {
      e.preventDefault();
      window.location.assign(e.currentTarget.href);
      return;
    }

    // Next's normal link behavior owns same-page anchors, queries, and scrolling.
    if (!navigateTo || destination.pathname === window.location.pathname)
      return;

    e.preventDefault();
    navigateTo(
      `${destination.pathname}${destination.search}${destination.hash}`,
      { replace: props.replace, scroll: props.scroll },
    );
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      {...props}
      prefetch={isOrdering ? false : props.prefetch}
    >
      {children}
    </Link>
  );
}
