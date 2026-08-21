"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";

interface Service {
  _id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  image: "",
  icon: "",
  ctaText: "Learn More",
  ctaUrl: "",
  displayOrder: 0,
  active: true,
};

export default function AdminServicesPage() {
  const toast = useAdminToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services?all=true");
      const json = await res.json();
      if (json.success) setServices(json.data);
    } catch {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      description: s.description || "",
      image: s.image || "",
      icon: "",
      ctaText: s.ctaText || "Learn More",
      ctaUrl: s.ctaUrl || "",
      displayOrder: s.displayOrder,
      active: s.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing._id}` : "/api/services";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success(editing ? "Service updated" : "Service created");
      setShowForm(false);
      fetchServices();
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
      const res = await fetch(`/api/services/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Service deleted");
      setDeleteId(null);
      fetchServices();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Service>[] = [
    { key: "title", header: "Title" },
    {
      key: "description",
      header: "Description",
      render: (s) => (
        <span className="line-clamp-1 max-w-xs">{s.description}</span>
      ),
    },
    { key: "displayOrder", header: "Order" },
    {
      key: "active",
      header: "Active",
      render: (s) => (s.active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(s)} className="text-[#4A2C6E]">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeleteId(s._id)} className="text-red-500">
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
      <AdminHeader title="Services" subtitle="Manage your service offerings" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={services}
          keyField="_id"
          loading={loading}
          searchable={false}
          emptyMessage="No services yet"
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" /> Add Service
            </button>
          }
        />

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <form
              onSubmit={handleSave}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Edit Service" : "New Service"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
                </div>
                <ImageUpload value={form.image} onChange={(id) => setForm({ ...form, image: id })} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA Text</label>
                    <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">CTA URL</label>
                    <input value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Display Order</label>
                  <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className={inputClass} />
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
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
