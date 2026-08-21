"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Category {
  _id: string;
  name: string;
}

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useAdminToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Partial<ProductFormData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/products/${id}`).then((r) => r.json()),
    ])
      .then(([catJson, prodJson]) => {
        if (catJson.success) setCategories(catJson.data);
        if (prodJson.success) {
          const p = prodJson.data;
          setProduct({
            ...p,
            category: p.category?._id || p.category || "",
            specifications:
              p.specifications instanceof Map
                ? Object.fromEntries(p.specifications)
                : p.specifications || {},
          });
        } else {
          toast.error("Product not found");
          router.push("/admin/products");
        }
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setFetching(false));
  }, [id, router, toast]);

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Edit Product" subtitle={product?.name || ""} />
      <main className="flex-1 p-4 lg:p-8">
        {product && (
          <ProductForm
            initialData={product}
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Update Product"
          />
        )}
      </main>
    </>
  );
}
