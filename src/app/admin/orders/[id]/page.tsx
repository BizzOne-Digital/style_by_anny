"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import type { Address } from "@/types";

interface OrderItem {
  name: string;
  sku?: string;
  variantName?: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  _id: string;
  orderNumber: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes: string;
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useAdminToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setOrder(json.data);
          setOrderStatus(json.data.orderStatus);
          setPaymentStatus(json.data.paymentStatus);
        } else {
          toast.error("Order not found");
        }
      })
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setOrder(json.data);
      toast.success("Order updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const renderAddress = (addr: Address) => (
    <div className="text-sm text-gray-600">
      <p>
        {addr.firstName} {addr.lastName}
      </p>
      <p>{addr.address1}</p>
      {addr.address2 && <p>{addr.address2}</p>}
      <p>
        {addr.city}, {addr.province} {addr.postalCode}
      </p>
      <p>{addr.country}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="flex-1 p-8 text-center text-gray-500">Order not found</main>
    );
  }

  const selectClass =
    "rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none";

  return (
    <>
      <AdminHeader
        title={`Order ${order.orderNumber}`}
        subtitle={formatDate(order.createdAt)}
        actions={
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-sm text-[#4A2C6E] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        }
      />
      <main className="flex-1 p-4 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
              <h2 className="mb-4 font-semibold">Order Items</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} className="border-b border-[#E8E0F0]">
                      <td className="py-3">
                        <p className="font-medium">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-gray-500">{item.variantName}</p>
                        )}
                      </td>
                      <td className="py-3">{item.quantity}</td>
                      <td className="py-3 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 space-y-1 text-sm text-right">
                <p>Subtotal: {formatPrice(order.subtotal)}</p>
                <p>Shipping: {formatPrice(order.shipping)}</p>
                <p>Tax: {formatPrice(order.tax)}</p>
                {order.discount > 0 && (
                  <p>Discount: -{formatPrice(order.discount)}</p>
                )}
                <p className="text-lg font-bold">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
                <h2 className="mb-2 font-semibold">Notes</h2>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
              <h2 className="mb-4 font-semibold">Customer</h2>
              <p className="text-sm">{order.email}</p>
              {order.phone && (
                <p className="text-sm text-gray-500">{order.phone}</p>
              )}
            </div>

            <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
              <h2 className="mb-4 font-semibold">Update Status</h2>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className={selectClass + " w-full"}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className={selectClass + " w-full"}
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={saving}
                  className="w-full rounded-lg bg-[#4A2C6E] py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Update Order"}
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
              <h2 className="mb-2 font-semibold">Shipping Address</h2>
              {renderAddress(order.shippingAddress)}
            </div>

            {order.billingAddress && (
              <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
                <h2 className="mb-2 font-semibold">Billing Address</h2>
                {renderAddress(order.billingAddress)}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
