"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface OrderLookupFormProps {
  currency?: string;
}

interface OrderResult {
  orderNumber: string;
  email: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variantName?: string;
  }>;
}

export function OrderLookupForm({ currency = "CAD" }: OrderLookupFormProps) {
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        setOrder(result.data);
      } else {
        toast(result.error || "Order not found", "error");
      }
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Order Number"
          placeholder="e.g. PSA-XXXX-XXXX"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up…" : "Find Order"}
        </Button>
      </form>

      {order && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-text-muted">Order</p>
              <p className="font-heading text-xl text-text">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-text-muted">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <Badge>{order.orderStatus}</Badge>
          </div>
          <ul className="mt-6 space-y-3 border-t border-border pt-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-text-muted">
                  {item.name}
                  {item.variantName && ` (${item.variantName})`} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total, currency)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
