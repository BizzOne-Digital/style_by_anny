"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  currency?: string;
}

export function CartDrawer({
  open,
  onClose,
  currency = "CAD",
}: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-xl text-text">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-10 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Browse our collection and add plants you love."
              actionLabel="Shop Plants"
              actionHref="/shop"
            />
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  className="flex gap-4 rounded-xl border border-border bg-background p-3"
                >
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative size-20 shrink-0 overflow-hidden rounded-md bg-accent"
                    onClick={onClose}
                  >
                    <MediaImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 text-sm font-medium text-text hover:text-primary"
                      onClick={onClose}
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="mt-0.5 text-xs text-text-muted">
                        {item.variantName}
                      </p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatPrice(item.price, currency)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">
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
                          disabled={item.quantity >= item.maxStock}
                          className={cn(
                            "inline-flex size-8 items-center justify-center rounded-md border border-border hover:bg-accent",
                            item.quantity >= item.maxStock &&
                              "cursor-not-allowed opacity-50"
                          )}
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="inline-flex size-8 items-center justify-center rounded-md text-text-muted hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-text-muted">Subtotal</span>
              <span className="text-lg font-semibold text-text">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
            <p className="mb-4 text-xs text-text-muted">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout" onClick={onClose}>
                <Button fullWidth size="lg">
                  Checkout
                </Button>
              </Link>
              <Button variant="outline" fullWidth onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
