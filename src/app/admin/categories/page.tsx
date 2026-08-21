"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";
import { slugify } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  displayOrder: 0,
  active: true,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminCategoriesPage() {
  const toast = useAdminToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      displayOrder: cat.displayOrder,
      active: cat.active,
      seoTitle: "",
      seoDescription: "",
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/categories/${editing._id}` : "/api/categories";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success(editing ? "Category updated" : "Category created");
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Category>[] = [
    { key: "name", header: "Name" },
    { key: "slug", header: "Slug" },
    { key: "displayOrder", header: "Order" },
    {
      key: "active",
      header: "Active",
      render: (c) => (c.active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(c)}
            className="rounded p-1 text-[#4A2C6E] hover:bg-[#E8E0F0]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(c._id)}
            className="rounded p-1 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none focus:ring-1 focus:ring-[#4A2C6E]";

  return (
    <>
      <AdminHeader title="Categories" subtitle="Organize your products" />
      <main className="flex-1 space-y-6 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={categories}
          keyField="_id"
          loading={loading}
          searchable={false}
          emptyMessage="No categories yet"
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          }
        />

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <form
              onSubmit={handleSave}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            >
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Edit Category" : "New Category"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: editing ? form.slug : slugify(e.target.value),
                      })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Slug</label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <ImageUpload
                  value={form.image}
                  onChange={(id) => setForm({ ...form, image: id })}
                  label="Category Image"
                />
                <div>
                  <label className="mb-1 block text-sm font-medium">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({ ...form, displayOrder: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category"
        message="Are you sure? Products in this category will not be deleted."
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
