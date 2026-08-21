"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/validation";
import type { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cart";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  currency?: string;
  shippingRate?: number;
  taxRate?: number;
}

export function CheckoutForm({
  currency = "CAD",
  shippingRate = 0,
  taxRate = 0,
}: CheckoutFormProps) {
  const { items, getSubtotal } = useCartStore();
  const { toast } = useToast();
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getSubtotal();
  const shipping = shippingRate;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shipping + tax;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: { country: "CA" },
      sameAsShipping: true,
      items: [],
    },
  });

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center">
        <p className="text-text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sameAsShipping,
          billingAddress: sameAsShipping ? data.shippingAddress : data.billingAddress,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const result = await res.json();
      if (result.success && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else if (result.success && result.data?.orderNumber) {
        window.location.href = `/checkout/success?order=${result.data.orderNumber}`;
      } else {
        toast(result.error || "Checkout failed", "error");
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-8">
        <section>
          <h2 className="font-heading text-2xl text-text">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              required
            />
            <Input label="Phone" type="tel" {...register("phone")} />
          </div>
        </section>

        <section>
          <h2 className="font-heading text-2xl text-text">Shipping Address</h2>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                {...register("shippingAddress.firstName")}
                error={errors.shippingAddress?.firstName?.message}
                required
              />
              <Input
                label="Last Name"
                {...register("shippingAddress.lastName")}
                error={errors.shippingAddress?.lastName?.message}
                required
              />
            </div>
            <Input
              label="Address"
              {...register("shippingAddress.address1")}
              error={errors.shippingAddress?.address1?.message}
              required
            />
            <Input
              label="Apartment, suite, etc. (optional)"
              {...register("shippingAddress.address2")}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="City"
                {...register("shippingAddress.city")}
                error={errors.shippingAddress?.city?.message}
                required
              />
              <Input
                label="Province"
                {...register("shippingAddress.province")}
                error={errors.shippingAddress?.province?.message}
                required
              />
              <Input
                label="Postal Code"
                {...register("shippingAddress.postalCode")}
                error={errors.shippingAddress?.postalCode?.message}
                required
              />
            </div>
          </div>
        </section>

        <section>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            Billing address same as shipping
          </label>
        </section>

        <section>
          <Textarea label="Order notes (optional)" {...register("notes")} rows={3} />
        </section>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-heading text-xl text-text">Order Summary</h2>
          <ul className="mt-4 space-y-3 border-b border-border pb-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId || ""}`}
                className="flex justify-between text-sm"
              >
                <span className="text-text-muted">
                  {item.name}
                  {item.variantName && ` (${item.variantName})`} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Shipping</span>
              <span>
                {shipping > 0 ? formatPrice(shipping, currency) : "Free"}
              </span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-text-muted">Tax ({taxRate}%)</span>
                <span>{formatPrice(tax, currency)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-medium text-base">
              <span>Total</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="mt-6 w-full" size="lg">
            {isSubmitting ? "Processing…" : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}
