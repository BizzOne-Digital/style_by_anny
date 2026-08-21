import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import type { SiteSettingsData } from "@/types";

interface FooterProps {
  settings: SiteSettingsData;
}

const FOOTER_LINKS = {
  shop: [
    { href: "/shop", label: "All Plants" },
    { href: "/pricing", label: "Pricing" },
    { href: "/cart", label: "Cart" },
    { href: "/order-lookup", label: "Order Lookup" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/testimonials", label: "Testimonials" },
    { href: "/blog", label: "Blog" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/search", label: "Search" },
  ],
};

export function Footer({ settings }: FooterProps) {
  const activeSocial = settings.socialLinks
    ?.filter((l) => l.active && l.url)
    .sort((a, b) => a.order - b.order);

  return (
    <footer className="mt-auto bg-footer text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-heading text-2xl font-semibold text-white">
              {settings.brandName}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {settings.tagline}
            </p>
            <div className="mt-5 space-y-2.5">
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-accent-warm"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent-warm" />
                  {settings.email}
                </a>
              )}
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-accent-warm"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent-warm" />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>

          {(
            [
              ["Shop", FOOTER_LINKS.shop],
              ["Company", FOOTER_LINKS.company],
              ["Support", FOOTER_LINKS.support],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent-warm">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {activeSocial && activeSocial.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-5 border-t border-white/10 pt-8">
            {activeSocial.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm capitalize text-white/70 transition-colors hover:text-accent-warm"
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} {settings.brandName}.{" "}
            {settings.footerText}
          </p>
        </div>
      </div>
    </footer>
  );
}
