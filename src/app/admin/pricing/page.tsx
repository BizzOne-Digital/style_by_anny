"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatPrice } from "@/lib/utils";

interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  price?: number;
  billingPeriod: string;
  features: string[];
  featured: boolean;
  displayOrder: number;
  active: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  price: undefined as number | undefined,
  billingPeriod: "one-time",
  features: "",
  ctaText: "Get Started",
  ctaUrl: "",
  featured: false,
  displayOrder: 0,
  active: true,
};

export default function AdminPricingPage() {
  const toast = useAdminToast();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pricing?all=true");
      const json = await res.json();
      if (json.success) setPlans(json.data);
    } catch {
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: PricingPlan) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      billingPeriod: p.billingPeriod || "one-time",
      features: (p.features || []).join("\n"),
      ctaText: "Get Started",
      ctaUrl: "",
      featured: p.featured,
      displayOrder: p.displayOrder,
      active: p.active,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
      };
      const url = editing ? `/api/pricing/${editing._id}` : "/api/pricing";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success(editing ? "Plan updated" : "Plan created");
      setShowForm(false);
      fetchPlans();
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
      const res = await fetch(`/api/pricing/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Plan deleted");
      setDeleteId(null);
      fetchPlans();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<PricingPlan>[] = [
    { key: "name", header: "Plan" },
    {
      key: "price",
      header: "Price",
      render: (p) => (p.price != null ? formatPrice(p.price) : "Custom"),
    },
    { key: "billingPeriod", header: "Billing" },
    {
      key: "featured",
      header: "Featured",
      render: (p) => (p.featured ? "Yes" : "No"),
    },
    {
      key: "active",
      header: "Active",
      render: (p) => (p.active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(p)} className="text-[#4A2C6E]">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeleteId(p._id)} className="text-red-500">
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
      <AdminHeader title="Pricing" subtitle="Manage pricing plans" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={plans}
          keyField="_id"
          loading={loading}
          searchable={false}
          emptyMessage="No pricing plans yet"
          actions={
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" /> Add Plan
            </button>
          }
        />

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
            <form onSubmit={handleSave} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">
                {editing ? "Edit Plan" : "New Plan"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Price (CAD)</label>
                    <input type="number" step="0.01" value={form.price ?? ""} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : undefined })} className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Billing Period</label>
                    <select value={form.billingPeriod} onChange={(e) => setForm({ ...form, billingPeriod: e.target.value })} className={inputClass}>
                      <option value="one-time">One-time</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Features (one per line)</label>
                  <textarea rows={5} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Display Order</label>
                  <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} className={inputClass} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
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
        title="Delete Plan"
        message="Are you sure you want to delete this pricing plan?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
