"use client";

import { useState } from "react";
import Link from "next/link";
import { SanityLogo } from "@/components/ui/SanityLogo";
import { MenuOverlay } from "@/components/MenuOverlay";

type NavItem = {
  _key: string;
  _type: string;
  label: string;
  slug?: string;
  url?: string;
  phone?: string;
};

type HeaderProps = {
  restaurantName?: string;
  logo?: { asset?: { _id: string; url: string } } | null;
  navigationItems?: NavItem[] | null;
};

export function Header({
  restaurantName,
  logo,
  navigationItems,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-accent bg-background">
        <div className="mx-auto flex max-w-[1856px] items-center justify-between px-3 py-3 md:px-8">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {logo?.asset ? (
              <SanityLogo
                logo={logo}
                alt={`${restaurantName || "Tapparo"} logo`}
                className="h-12 w-[131px] text-foreground [&_svg]:h-full [&_svg]:w-auto"
              />
            ) : (
              <span className="text-lg font-bold tracking-tight text-foreground">
                {restaurantName || "Tapparo"}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="font-sans text-base font-medium uppercase text-foreground transition-colors hover:text-accent"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navigationItems}
      />
    </>
  );
}
