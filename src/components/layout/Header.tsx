"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { SiteSettingsData } from "@/types";
import { MediaImage } from "@/components/MediaImage";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchBar } from "@/components/shop/SearchBar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export interface HeaderProps {
  settings: SiteSettingsData;
  onCartOpen: () => void;
}

export function Header({ settings, onCartOpen }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface shadow-header">
        <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-text hover:bg-accent hover:text-primary lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            >
              {settings.logo ? (
                <MediaImage
                  src={settings.logo}
                  alt={settings.brandName}
                  width={160}
                  height={40}
                  className="h-9 w-auto"
                  objectFit="contain"
                />
              ) : (
                <span className="font-heading text-xl font-semibold text-primary sm:text-2xl">
                  {settings.brandName}
                </span>
              )}
            </Link>
          </div>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-text hover:bg-accent hover:text-primary"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-lg text-text hover:bg-accent hover:text-primary"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search className="size-5" />
            </button>

            <Link
              href="/order-lookup"
              className="hidden size-10 items-center justify-center rounded-lg text-text hover:bg-accent hover:text-primary sm:inline-flex"
              aria-label="Account"
            >
              <User className="size-5" />
            </Link>

            <button
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-lg text-text hover:bg-accent hover:text-primary"
              onClick={onCartOpen}
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent-warm text-[10px] font-bold text-primary-dark">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border bg-accent/40 px-4 py-3 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl">
              <SearchBar autoFocus onSubmit={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={NAV_LINKS}
        brandName={settings.brandName}
        logo={settings.logo}
      />
    </>
  );
}
