"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatDate, formatPrice } from "@/lib/utils";
import { ORDER_STATUSES } from "@/lib/constants";

interface Order {
  _id: string;
  orderNumber: string;
  email: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function AdminOrdersPage() {
  const toast = useAdminToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/orders?${params}`);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data.items);
        setTotalPages(json.data.totalPages);
      } else {
        toast.error(json.error || "Failed to load orders");
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: Column<Order>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (o) => (
        <Link
          href={`/admin/orders/${o._id}`}
          className="font-medium text-[#4A2C6E] hover:underline"
        >
          {o.orderNumber}
        </Link>
      ),
    },
    { key: "email", header: "Customer" },
    {
      key: "total",
      header: "Total",
      render: (o) => formatPrice(o.total),
    },
    {
      key: "orderStatus",
      header: "Status",
      render: (o) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            statusColors[o.orderStatus] || "bg-gray-100"
          }`}
        >
          {o.orderStatus}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (o) => (
        <span className="capitalize">{o.paymentStatus}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o) => formatDate(o.createdAt),
    },
  ];

  return (
    <>
      <AdminHeader title="Orders" subtitle="Manage customer orders" />
      <main className="flex-1 p-4 lg:p-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("");
              setPage(1);
            }}
            className={`rounded-full px-3 py-1 text-sm ${
              !statusFilter
                ? "bg-[#4A2C6E] text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            All
          </button>
          {ORDER_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1 text-sm capitalize ${
                statusFilter === status
                  ? "bg-[#4A2C6E] text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <DataTable
          columns={columns}
          data={orders}
          keyField="_id"
          loading={loading}
          searchable={false}
          serverSide
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          emptyMessage="No orders found"
        />
      </main>
    </>
  );
}
