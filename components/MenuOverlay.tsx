"use client";

import Link from "next/link";
import { useEffect } from "react";

type HeaderNav = {
  pageLinks?: { _key: string; label: string; slug: string }[];
  socialLinks?: { _id: string; label: string; url: string }[];
  showPhone?: boolean;
  phone?: string | null;
};

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  headerNav?: HeaderNav | null;
};

const linkClass =
  "font-sans text-[30px] font-medium tracking-tight text-foreground transition-colors hover:text-accent";

export function MenuOverlay({ isOpen, onClose, headerNav }: MenuOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/75 backdrop-blur-sm">
      <nav className="flex flex-col items-center gap-4">
        {headerNav?.pageLinks?.map((item) => (
          <Link
            key={item._key}
            href={item.slug === "home" ? "/" : `/${item.slug}`}
            onClick={onClose}
            className={linkClass}
          >
            {item.label}
          </Link>
        ))}

        {headerNav?.socialLinks?.map((link) => (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {link.label}
          </a>
        ))}

        {headerNav?.phone && (
          <a
            href={`tel:${headerNav.phone.replace(/\s/g, "")}`}
            className={linkClass}
          >
            {headerNav.phone}
          </a>
        )}
      </nav>
    </div>
  );
}
