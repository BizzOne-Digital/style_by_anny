import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard, type ProductCardData } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export type { ProductCardData };

export interface ProductGridProps {
  products: ProductCardData[];
  currency?: string;
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  currency = "CAD",
  className,
  emptyMessage = "No products found matching your criteria.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="No products found"
        description={emptyMessage}
        action={
          <Link href="/shop">
            <Button variant="outline">Browse all plants</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          currency={currency}
        />
      ))}
    </div>
  );
}
