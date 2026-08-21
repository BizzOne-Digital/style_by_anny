"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/admin/StatCard";
import { formatDate, formatPrice } from "@/lib/utils";
import { useAdminToast } from "@/components/admin/AdminToast";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  revenue: number;
  blogPosts: number;
  testimonials: number;
  unreadContacts: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    email: string;
    total: number;
    orderStatus: string;
    createdAt: string;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    price: number;
    active: boolean;
    createdAt: string;
  }>;
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

export default function AdminDashboardPage() {
  const toast = useAdminToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const loadDemoContent = async () => {
    setLoadingDemo(true);
    try {
      const res = await fetch("/api/admin/seed/demo-content", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to load demo content");
      toast.success("Temporary images and demo catalog loaded");
      const dash = await fetch("/api/admin/dashboard");
      const dashJson = await dash.json();
      if (dashJson.success) setStats(dashJson.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load demo content");
    } finally {
      setLoadingDemo(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStats(json.data);
        } else {
          toast.error(json.error || "Failed to load dashboard");
        }
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Overview of your store" />
      <main className="flex-1 p-4 lg:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
          </div>
        ) : stats ? (
          <div className="space-y-8">
            {stats.totalProducts === 0 && (
              <div className="rounded-xl border border-[#E8E0F0] bg-[#FAF8F5] p-6">
                <h2 className="font-semibold text-[#2D2D2D]">
                  Load temporary demo content
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-600">
                  Add beautiful temporary plant imagery, homepage photos, categories,
                  and demo products. All content is CMS-managed and replaceable from
                  admin — no code changes required.
                </p>
                <button
                  type="button"
                  onClick={loadDemoContent}
                  disabled={loadingDemo}
                  className="mt-4 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm font-medium text-white hover:bg-[#3A2258] disabled:opacity-60"
                >
                  {loadingDemo ? "Loading..." : "Load Demo Images & Products"}
                </button>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value={formatPrice(stats.revenue)}
                icon={DollarSign}
                description="From paid orders"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                icon={ShoppingCart}
                description={`${stats.pendingOrders} pending`}
              />
              <StatCard
                title="Products"
                value={stats.activeProducts}
                icon={Package}
                description={`${stats.totalProducts} total`}
              />
              <StatCard
                title="Low Stock"
                value={stats.lowStockProducts}
                icon={AlertTriangle}
                description="Needs attention"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-[#E8E0F0] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8E0F0] px-6 py-4">
                  <h2 className="font-semibold text-[#2D2D2D]">Recent Orders</h2>
                  <Link
                    href="/admin/orders"
                    className="text-sm text-[#4A2C6E] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {stats.recentOrders.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-gray-500">
                    No orders yet
                  </p>
                ) : (
                  <div className="divide-y divide-[#E8E0F0]">
                    {stats.recentOrders.map((order) => (
                      <Link
                        key={order._id}
                        href={`/admin/orders/${order._id}`}
                        className="flex items-center justify-between px-6 py-3 hover:bg-[#FAF8F5]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#2D2D2D]">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(order.total)}
                          </p>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              statusColors[order.orderStatus] || "bg-gray-100"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E8E0F0] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#E8E0F0] px-6 py-4">
                  <h2 className="font-semibold text-[#2D2D2D]">
                    Recent Products
                  </h2>
                  <Link
                    href="/admin/products"
                    className="text-sm text-[#4A2C6E] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {stats.recentProducts.length === 0 ? (
                  <p className="px-6 py-8 text-center text-sm text-gray-500">
                    No products yet
                  </p>
                ) : (
                  <div className="divide-y divide-[#E8E0F0]">
                    {stats.recentProducts.map((product) => (
                      <Link
                        key={product._id}
                        href={`/admin/products/${product._id}`}
                        className="flex items-center justify-between px-6 py-3 hover:bg-[#FAF8F5]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#2D2D2D]">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(product.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {formatPrice(product.price)}
                          </p>
                          <span
                            className={`text-xs ${
                              product.active ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {product.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                title="Blog Posts"
                value={stats.blogPosts}
                icon={Package}
              />
              <StatCard
                title="Testimonials"
                value={stats.testimonials}
                icon={Package}
              />
              <StatCard
                title="Unread Contacts"
                value={stats.unreadContacts}
                icon={Mail}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Unable to load dashboard data</p>
        )}
      </main>
    </>
  );
}
