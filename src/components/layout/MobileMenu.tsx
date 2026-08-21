"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";

export interface NavLink {
  href: string;
  label: string;
}

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: readonly NavLink[];
  brandName: string;
  logo?: string;
}

export function MobileMenu({
  open,
  onClose,
  navLinks,
  brandName,
  logo,
}: MobileMenuProps) {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      onClose();
      previousPathname.current = pathname;
    }
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface shadow-elevated"
      >
        <div className="flex items-center justify-between border-b border-border bg-accent/30 px-4 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            {logo ? (
              <MediaImage
                src={logo}
                alt={brandName}
                width={120}
                height={36}
                className="h-8 w-auto"
                objectFit="contain"
              />
            ) : (
              <span className="font-heading text-lg font-semibold text-primary">
                {brandName}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-lg text-text hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-text hover:bg-accent"
                )}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border bg-accent/20 p-4">
          <Link
            href="/order-lookup"
            className="block rounded-xl px-4 py-3.5 text-base font-medium text-text hover:bg-accent"
            onClick={onClose}
          >
            Order Lookup
          </Link>
        </div>
      </div>
    </div>
  );
}
