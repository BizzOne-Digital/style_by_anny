import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { getOrderByNumber, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Order Confirmed",
    description: "Your order has been placed successfully.",
    path: "/checkout/success",
    noIndex: true,
  });
}

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order;

  const [settings, order] = await Promise.all([
    getSiteSettings(),
    orderNumber ? getOrderByNumber(orderNumber) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 font-heading text-4xl text-text">Thank You!</h1>
      <p className="mt-3 text-lg text-text-muted">
        Your order has been placed successfully.
      </p>

      {order && (
        <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-left">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-text-muted">Order Number</p>
              <p className="font-medium text-text">{order.orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Date</p>
              <p className="text-sm text-text">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <ul className="space-y-2">
              {order.items.map(
                (
                  item: {
                    name: string;
                    quantity: number;
                    price: number;
                    variantName?: string;
                  },
                  i: number
                ) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-text-muted">
                      {item.name}
                      {item.variantName && ` (${item.variantName})`} ×{" "}
                      {item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.price * item.quantity, settings.currency)}
                    </span>
                  </li>
                )
              )}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total, settings.currency)}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            A confirmation email has been sent to {order.email}.
          </p>
        </div>
      )}

      {orderNumber && !order && (
        <p className="mt-4 text-sm text-text-muted">
          Order reference: <strong>{orderNumber}</strong>
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
        <Link href="/order-lookup">
          <Button variant="outline">Track Order</Button>
        </Link>
      </div>
    </div>
  );
}
