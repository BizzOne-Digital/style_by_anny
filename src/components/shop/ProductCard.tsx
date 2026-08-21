import Link from "next/link";
import { cn, formatPrice, getEffectivePrice } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";
import { Badge } from "@/components/ui/Badge";

export interface ProductCardData {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  salePrice?: number | null;
  images?: { mediaId: string; alt?: string; order?: number }[];
  stockStatus?: string;
  shortDescription?: string;
  category?: { name: string; slug: string };
}

export interface ProductCardProps {
  product: ProductCardData;
  currency?: string;
  className?: string;
}

export function ProductCard({
  product,
  currency = "CAD",
  className,
}: ProductCardProps) {
  const effectivePrice = getEffectivePrice(product);
  const onSale =
    product.salePrice != null &&
    product.salePrice > 0 &&
    product.salePrice < product.price;
  const primaryImage = [...(product.images ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )[0];
  const isOutOfStock = product.stockStatus === "out_of_stock";

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-accent"
      >
        {onSale && (
          <Badge variant="sale" className="absolute left-3 top-3 z-10">
            Sale
          </Badge>
        )}
        {isOutOfStock && (
          <Badge
            variant="outline"
            className="absolute right-3 top-3 z-10 border-white/30 bg-surface/90"
          >
            Sold Out
          </Badge>
        )}
        <MediaImage
          src={primaryImage?.mediaId}
          alt={primaryImage?.alt || product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1.5 line-clamp-2 font-heading text-lg font-semibold text-text transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        {product.shortDescription && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-4">
          <span className="text-lg font-semibold text-primary">
            {formatPrice(effectivePrice, currency)}
          </span>
          {onSale && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(product.price, currency)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
