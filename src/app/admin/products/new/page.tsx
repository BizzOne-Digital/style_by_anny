"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductForm, type ProductFormData } from "@/components/admin/ProductForm";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Category {
  _id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const toast = useAdminToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Product created successfully");
      router.push(`/admin/products/${json.data._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="New Product" subtitle="Add a new product to your catalog" />
      <main className="flex-1 p-4 lg:p-8">
        <ProductForm
          categories={categories}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Product"
        />
      </main>
    </>
  );
}
