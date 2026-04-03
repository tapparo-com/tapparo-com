"use client";

import Link from "next/link";
import { useEffect } from "react";

type NavItem = {
  _key: string;
  _type: string;
  // navPageLink
  label?: string;
  slug?: string;
  // navSocialLinks
  socialLinks?: { _key: string; platform: string; url: string }[];
  // navPhoneLink
  phone?: string;
};

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  items?: NavItem[] | null;
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function MenuOverlay({ isOpen, onClose, items }: MenuOverlayProps) {
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
        {items?.map((item) => {
          if (item._type === "navPageLink" && item.slug) {
            return (
              <Link
                key={item._key}
                href={item.slug === "home" ? "/" : `/${item.slug}`}
                onClick={onClose}
                className="font-sans text-[30px] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            );
          }

          if (item._type === "navSocialLinks" && item.socialLinks) {
            return item.socialLinks.map((link) => (
              <a
                key={link._key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[30px] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
              >
                {capitalize(link.platform)}
              </a>
            ));
          }

          if (item._type === "navPhoneLink" && item.phone) {
            return (
              <a
                key={item._key}
                href={`tel:${item.phone.replace(/\s/g, "")}`}
                className="font-sans text-[30px] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
              >
                {item.phone}
              </a>
            );
          }

          return null;
        })}
      </nav>
    </div>
  );
}
