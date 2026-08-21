"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Variant {
  _id?: string;
  name: string;
  price?: number;
  stock: number;
  image?: string;
}

interface ProductInfoProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number | null;
    shortDescription?: string;
    fullDescription?: string;
    stockQuantity: number;
    stockStatus: string;
    variants?: Variant[];
    images?: Array<{ mediaId: string; alt?: string }>;
    sku?: string;
    category?: { name: string; slug: string };
  };
  currency?: string;
}

export function ProductInfo({ product, currency = "CAD" }: ProductInfoProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const hasVariants = product.variants && product.variants.length > 0;
  const effectivePrice = selectedVariant?.price ?? getEffectivePrice(product);
  const maxStock = hasVariants
    ? selectedVariant?.stock ?? 0
    : product.stockQuantity;
  const isOutOfStock =
    product.stockStatus === "out_of_stock" || maxStock <= 0;
  const onSale =
    product.salePrice &&
    product.salePrice > 0 &&
    product.salePrice < product.price &&
    !selectedVariant?.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const image = selectedVariant?.image || product.images?.[0]?.mediaId;

    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      slug: product.slug,
      price: effectivePrice,
      quantity,
      image,
      variantName: selectedVariant?.name,
      maxStock,
    });

    toast(`${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <div>
      {product.category && (
        <p className="text-sm uppercase tracking-wider text-primary">
          {product.category.name}
        </p>
      )}
      <h1 className="mt-1 font-heading text-4xl text-text">{product.name}</h1>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-heading text-3xl text-text">
          {formatPrice(effectivePrice, currency)}
        </span>
        {onSale && (
          <>
            <span className="text-lg text-text-muted line-through">
              {formatPrice(product.price, currency)}
            </span>
            <Badge variant="sale">Sale</Badge>
          </>
        )}
      </div>

      {product.shortDescription && (
        <p className="mt-4 text-text-muted leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      {hasVariants && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium text-text">Options</p>
          <div className="flex flex-wrap gap-2">
            {product.variants!.map((variant) => (
              <button
                key={variant._id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock <= 0}
                className={cn(
                  "rounded-md border px-4 py-2 text-sm transition-colors",
                  selectedVariant?._id === variant._id
                    ? "border-primary bg-accent text-primary"
                    : "border-border hover:border-primary",
                  variant.stock <= 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center rounded-md border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center hover:bg-accent"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center hover:bg-accent"
            aria-label="Increase quantity"
            disabled={quantity >= maxStock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1"
          size="lg"
        >
          <ShoppingBag className="h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </div>

      {product.stockStatus === "low_stock" && !isOutOfStock && (
        <p className="mt-3 text-sm text-amber-700">Only a few left in stock</p>
      )}

      {product.fullDescription && (
        <div className="mt-8 border-t border-border pt-8">
          <h2 className="font-heading text-xl text-text">Description</h2>
          <div
            className="prose-content mt-3"
            dangerouslySetInnerHTML={{ __html: product.fullDescription }}
          />
        </div>
      )}
    </div>
  );
}
