"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatDate, formatPrice } from "@/lib/utils";

interface CustomerRow {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const toast = useAdminToast();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?limit=500")
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error);

        const map = new Map<string, CustomerRow>();
        for (const order of json.data.items) {
          const existing = map.get(order.email);
          const name = order.shippingAddress
            ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
            : order.email;

          if (existing) {
            existing.orderCount += 1;
            existing.totalSpent += order.total;
            if (new Date(order.createdAt) > new Date(existing.lastOrder)) {
              existing.lastOrder = order.createdAt;
            }
          } else {
            map.set(order.email, {
              email: order.email,
              name,
              phone: order.phone || "",
              orderCount: 1,
              totalSpent: order.total,
              lastOrder: order.createdAt,
            });
          }
        }

        setCustomers(
          Array.from(map.values()).sort(
            (a, b) =>
              new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
          )
        );
      })
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, [toast]);

  const columns: Column<CustomerRow>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "orderCount", header: "Orders" },
    {
      key: "totalSpent",
      header: "Total Spent",
      render: (c) => formatPrice(c.totalSpent),
    },
    {
      key: "lastOrder",
      header: "Last Order",
      render: (c) => formatDate(c.lastOrder),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Customers"
        subtitle="Customers derived from order history"
      />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={customers}
          keyField="email"
          loading={loading}
          searchKeys={["name", "email", "phone"]}
          emptyMessage="No customers yet"
        />
      </main>
    </>
  );
}
