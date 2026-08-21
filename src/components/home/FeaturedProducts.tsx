import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ProductCardData } from "@/components/shop/ProductCard";

export interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products: ProductCardData[];
  currency?: string;
  viewAllHref?: string;
  className?: string;
}

export function FeaturedProducts({
  title = "Featured Plants",
  subtitle = "Handpicked favorites to elevate your space",
  products,
  currency,
  viewAllHref = "/shop",
  className,
}: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Curated"
            title={title}
            subtitle={subtitle}
            align="left"
            className="mb-0"
          />
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/20 bg-accent px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ProductGrid products={products} currency={currency} />
      </div>
    </section>
  );
}
