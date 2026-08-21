"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Testimonial {
  _id: string;
  customerName: string;
  text: string;
  image: string;
  rating?: number;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  customerName: "",
  text: "",
  image: "",
  rating: 5,
  displayOrder: 0,
  active: true,
};

export default function AdminTestimonialsPage() {
  const toast = useAdminToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials?all=true");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      customerName: t.customerName,
      text: t.text,
      image: t.image || "",
      rating: t.rating || 5,
      displayOrder: t.displayOrder,
      active: t.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing
        ? `/api/testimonials/${editing._id}`
        : "/api/testimonials";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success(editing ? "Testimonial updated" : "Testimonial created");
      setShowForm(false);
      fetchItems();
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
      const res = await fetch(`/api/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Testimonial deleted");
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Testimonial>[] = [
    { key: "customerName", header: "Customer" },
    {
      key: "text",
      header: "Review",
      render: (t) => <span className="line-clamp-2 max-w-md">{t.text}</span>,
    },
    {
      key: "rating",
      header: "Rating",
      render: (t) => (t.rating ? `${t.rating}/5` : "—"),
    },
    {
      key: "active",
      header: "Active",
      render: (t) => (t.active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (t) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(t)} className="text-[#4A2C6E]">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeleteId(t._id)} className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none";

  return (
    <>
      <AdminHeader title="Testimonials" subtitle="Manage customer reviews" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={items}
          keyField="_id"
          loading={loading}
          searchKeys={["customerName", "text"]}
          emptyMessage="No testimonials yet"
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" /> Add Testimonial
            </button>
          }
        />

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <form
              onSubmit={handleSave}
              className="relative w-full max-w-lg rounded-xl bg-white p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Customer Name</label>
                  <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Review</label>
                  <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className={inputClass} />
                </div>
                <ImageUpload value={form.image} onChange={(id) => setForm({ ...form, image: id })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Rating (1-5)</label>
                    <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Display Order</label>
                    <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className={inputClass} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
