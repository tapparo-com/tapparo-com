"use client";

import { useState } from "react";
import Link from "next/link";
import { SanityLogo } from "@/components/ui/SanityLogo";
import { MenuOverlay } from "@/components/MenuOverlay";

type HeaderNav = {
  pageLinks?: { _key: string; label: string; slug: string }[];
  socialLinks?: { _id: string; label: string; url: string }[];
  showPhone?: boolean;
  phone?: string | null;
};

type HeaderProps = {
  restaurantName?: string;
  logoSvg?: string | null;
  headerNav?: HeaderNav | null;
};

export function Header({
  restaurantName,
  logoSvg,
  headerNav,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-accent bg-background px-3 py-2 md:px-8 ">
        <div className="mx-auto max-w-[1856px]">
          <div className="flex items-center justify-between md:grid grid-cols-sidebar md:gap-10">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center">
              {logoSvg ? (
                <SanityLogo
                  svgHtml={logoSvg}
                  alt={`${restaurantName || "Tapparo"} logo`}
                  className="h-12 w-[131px] text-foreground [&_svg]:h-full [&_svg]:w-auto"
                />
              ) : (
                <span className="text-lg font-bold tracking-tight text-foreground">
                  {restaurantName || "Tapparo"}
                </span>
              )}
            </Link>
            <div className="flex items-center justify-end max-w-content">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="font-sans text-base font-medium uppercase text-foreground transition-colors hover:text-accent"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerNav={headerNav}
      />
    </>
  );
}
