"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface CartPageContentProps {
  currency?: string;
}

export function CartPageContent({ currency = "CAD" }: CartPageContentProps) {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Browse our collection and find the perfect plants for your space."
        action={
          <Link href="/shop">
            <Button>
              Shop Plants
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId || ""}`}
            className="flex gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card"
          >
            <Link
              href={`/products/${item.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-accent"
            >
              <MediaImage
                src={item.image}
                alt={item.name}
                fill
                sizes="96px"
              />
            </Link>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <div>
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-semibold text-text hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <p className="text-sm text-text-muted">{item.variantName}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-text-muted hover:text-red-600"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1,
                        item.variantId
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text hover:border-primary hover:text-primary"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-text">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1,
                        item.variantId
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text hover:border-primary hover:text-primary disabled:opacity-40"
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <span className="font-semibold text-primary">
                  {formatPrice(item.price * item.quantity, currency)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-text-muted hover:text-red-600"
        >
          Clear cart
        </button>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <h2 className="font-heading text-xl font-semibold text-text">
            Order Summary
          </h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-text-muted">Subtotal</span>
            <span className="font-semibold text-text">
              {formatPrice(subtotal, currency)}
            </span>
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Shipping and taxes calculated at checkout.
          </p>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
