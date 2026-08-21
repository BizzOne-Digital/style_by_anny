"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  question: "",
  answer: "",
  category: "General",
  displayOrder: 0,
  active: true,
};

export default function AdminFAQsPage() {
  const toast = useAdminToast();
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs?all=true");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      toast.error("Failed to load FAQs");
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

  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer,
      category: f.category || "General",
      displayOrder: f.displayOrder,
      active: f.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/faqs/${editing._id}` : "/api/faqs";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success(editing ? "FAQ updated" : "FAQ created");
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
      const res = await fetch(`/api/faqs/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("FAQ deleted");
      setDeleteId(null);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<FAQ>[] = [
    { key: "question", header: "Question" },
    {
      key: "answer",
      header: "Answer",
      render: (f) => <span className="line-clamp-2 max-w-md">{f.answer}</span>,
    },
    { key: "category", header: "Category" },
    {
      key: "active",
      header: "Active",
      render: (f) => (f.active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (f) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(f)} className="text-[#4A2C6E]">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeleteId(f._id)} className="text-red-500">
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
      <AdminHeader title="FAQs" subtitle="Manage frequently asked questions" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={items}
          keyField="_id"
          loading={loading}
          searchKeys={["question", "answer", "category"]}
          emptyMessage="No FAQs yet"
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" /> Add FAQ
            </button>
          }
        />

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <form onSubmit={handleSave} className="relative w-full max-w-lg rounded-xl bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Edit FAQ" : "New FAQ"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Question</label>
                  <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Answer</label>
                  <textarea required rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
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
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
