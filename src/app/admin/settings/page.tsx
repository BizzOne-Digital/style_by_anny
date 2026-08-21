"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { SiteSettingsData, SocialLink } from "@/types";

export default function AdminSettingsPage() {
  const toast = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsData>({
    brandName: "",
    tagline: "",
    email: "",
    phone: "",
    currency: "CAD",
    lowStockThreshold: 5,
    defaultSeoTitle: "",
    defaultSeoDescription: "",
    footerText: "",
    socialLinks: [],
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setSettings(json.data);
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [toast]);

  const update = <K extends keyof SiteSettingsData>(
    key: K,
    value: SiteSettingsData[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  const addSocialLink = () => {
    update("socialLinks", [
      ...settings.socialLinks,
      { platform: "", url: "", active: true, order: settings.socialLinks.length },
    ]);
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string | boolean | number
  ) => {
    const links = settings.socialLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    update("socialLinks", links);
  };

  const removeSocialLink = (index: number) => {
    update(
      "socialLinks",
      settings.socialLinks.filter((_, i) => i !== index)
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none";
  const labelClass = "mb-1 block text-sm font-medium text-[#2D2D2D]";

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Settings" subtitle="Site configuration" />
      <main className="flex-1 p-4 lg:p-8">
        <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-6">
          {/* Brand */}
          <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Brand</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Brand Name</label>
                <input
                  value={settings.brandName}
                  onChange={(e) => update("brandName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Tagline</label>
                <input
                  value={settings.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  className={inputClass}
                />
              </div>
              <ImageUpload
                value={settings.logo}
                onChange={(id) => update("logo", id)}
                label="Logo"
              />
              <ImageUpload
                value={settings.favicon}
                onChange={(id) => update("favicon", id)}
                label="Favicon"
              />
              <div>
                <label className={labelClass}>Primary Color</label>
                <input
                  type="color"
                  value={settings.primaryColor || "#4A2C6E"}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg border"
                />
              </div>
              <div>
                <label className={labelClass}>Accent Color</label>
                <input
                  type="color"
                  value={settings.accentColor || "#E8E0F0"}
                  onChange={(e) => update("accentColor", e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-lg border"
                />
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Contact Info</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  value={settings.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Footer Text</label>
                <textarea
                  rows={2}
                  value={settings.footerText}
                  onChange={(e) => update("footerText", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Social Links</h2>
              <button
                type="button"
                onClick={addSocialLink}
                className="flex items-center gap-1 rounded-lg bg-[#E8E0F0] px-3 py-1.5 text-sm text-[#4A2C6E]"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            {settings.socialLinks.length === 0 ? (
              <p className="text-sm text-gray-500">No social links configured</p>
            ) : (
              <div className="space-y-3">
                {settings.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-lg border border-[#E8E0F0] p-4 sm:grid-cols-4"
                  >
                    <input
                      placeholder="Platform"
                      value={link.platform}
                      onChange={(e) =>
                        updateSocialLink(index, "platform", e.target.value)
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      className={`${inputClass} sm:col-span-2`}
                    />
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={link.active}
                          onChange={(e) =>
                            updateSocialLink(index, "active", e.target.checked)
                          }
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Commerce */}
          <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Commerce</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Currency</label>
                <input
                  value={settings.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Shipping Flat Rate (CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.shippingFlatRate ?? ""}
                  onChange={(e) =>
                    update(
                      "shippingFlatRate",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={settings.taxRate ?? ""}
                  onChange={(e) =>
                    update(
                      "taxRate",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Low Stock Threshold</label>
                <input
                  type="number"
                  min="0"
                  value={settings.lowStockThreshold}
                  onChange={(e) =>
                    update("lowStockThreshold", Number(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-xl border border-[#E8E0F0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Default SEO</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Default SEO Title</label>
                <input
                  value={settings.defaultSeoTitle}
                  onChange={(e) => update("defaultSeoTitle", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Default SEO Description</label>
                <textarea
                  rows={3}
                  value={settings.defaultSeoDescription}
                  onChange={(e) =>
                    update("defaultSeoDescription", e.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#4A2C6E] px-8 py-2.5 text-sm font-semibold text-white hover:bg-[#3d2459] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
