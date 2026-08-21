"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  stockStatus: string;
  active: boolean;
  featured: boolean;
}

export default function AdminProductsPage() {
  const toast = useAdminToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/products?${params}`);
      const json = await res.json();
      if (json.success) {
        setProducts(json.data.items);
        setTotalPages(json.data.totalPages);
      } else {
        toast.error(json.error || "Failed to load products");
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Product deleted");
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Product>[] = [
    { key: "name", header: "Name" },
    { key: "sku", header: "SKU" },
    {
      key: "price",
      header: "Price",
      render: (p) => formatPrice(p.price),
    },
    { key: "stockQuantity", header: "Stock" },
    {
      key: "stockStatus",
      header: "Status",
      render: (p) => (
        <span className="capitalize">{p.stockStatus.replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "active",
      header: "Active",
      render: (p) => (
        <span className={p.active ? "text-green-600" : "text-gray-400"}>
          {p.active ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${p._id}`}
            className="rounded p-1 text-[#4A2C6E] hover:bg-[#E8E0F0]"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(p._id)}
            className="rounded p-1 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Products" subtitle="Manage your product catalog" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={products}
          keyField="_id"
          loading={loading}
          serverSide
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSearch={(q) => {
            setSearch(q);
            setPage(1);
          }}
          searchKeys={["name", "sku"]}
          emptyMessage="No products found. Create your first product!"
          actions={
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm font-medium text-white hover:bg-[#3d2459]"
            >
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          }
        />
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
