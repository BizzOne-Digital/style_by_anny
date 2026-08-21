"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";
import type { PageSection } from "@/types";

const PAGE_SLUGS = [
  { slug: "home", label: "Homepage" },
  { slug: "about", label: "About" },
  { slug: "contact", label: "Contact" },
];

interface PageData {
  _id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  sections: PageSection[];
}

export default function AdminPagesPage() {
  const toast = useAdminToast();
  const [activeSlug, setActiveSlug] = useState("homepage");
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPage = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages?slug=${slug}`);
      const json = await res.json();
      if (json.success && json.data) {
        setPage(json.data);
      } else {
        setPage({
          _id: "",
          slug,
          title: slug.charAt(0).toUpperCase() + slug.slice(1),
          seoTitle: "",
          seoDescription: "",
          sections: [],
        });
      }
    } catch {
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPage(activeSlug);
  }, [activeSlug, fetchPage]);

  const updateSection = (index: number, field: keyof PageSection, value: unknown) => {
    if (!page) return;
    const sections = page.sections.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setPage({ ...page, sections });
  };

  const addSection = () => {
    if (!page) return;
    setPage({
      ...page,
      sections: [
        ...page.sections,
        {
          key: `section-${page.sections.length + 1}`,
          type: "text",
          title: "",
          subtitle: "",
          content: "",
          visible: true,
          order: page.sections.length,
        },
      ],
    });
  };

  const removeSection = (index: number) => {
    if (!page) return;
    setPage({
      ...page,
      sections: page.sections.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      if (page._id) {
        const res = await fetch(`/api/pages/${page._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error);
        setPage(json.data);
      } else {
        const res = await fetch("/api/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error);
        setPage(json.data);
      }
      toast.success("Page saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none";

  return (
    <>
      <AdminHeader title="Pages" subtitle="Edit homepage, about, and contact content" />
      <main className="flex-1 p-4 lg:p-8">
        <div className="mb-6 flex gap-2">
          {PAGE_SLUGS.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActiveSlug(p.slug)}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                activeSlug === p.slug
                  ? "bg-[#4A2C6E] text-white"
                  : "bg-white text-gray-600 border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
          </div>
        ) : page ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#E8E0F0] bg-white p-6">
              <h2 className="mb-4 font-semibold">Page Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title</label>
                  <input
                    value={page.title}
                    onChange={(e) => setPage({ ...page, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">SEO Title</label>
                  <input
                    value={page.seoTitle}
                    onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium">SEO Description</label>
                  <textarea
                    rows={2}
                    value={page.seoDescription}
                    onChange={(e) =>
                      setPage({ ...page, seoDescription: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Sections</h2>
              <button
                type="button"
                onClick={addSection}
                className="rounded-lg bg-[#E8E0F0] px-4 py-2 text-sm font-medium text-[#4A2C6E]"
              >
                Add Section
              </button>
            </div>

            {page.sections.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">
                No sections yet. Add a section to get started.
              </p>
            ) : (
              page.sections.map((section, index) => (
                <div
                  key={section.key}
                  className="rounded-xl border border-[#E8E0F0] bg-white p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Section {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Key</label>
                      <input
                        value={section.key}
                        onChange={(e) => updateSection(index, "key", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Type</label>
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(index, "type", e.target.value)}
                        className={inputClass}
                      >
                        <option value="hero">Hero</option>
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                        <option value="cta">CTA</option>
                        <option value="grid">Grid</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Title</label>
                      <input
                        value={section.title || ""}
                        onChange={(e) => updateSection(index, "title", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Subtitle</label>
                      <input
                        value={section.subtitle || ""}
                        onChange={(e) => updateSection(index, "subtitle", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium">Content</label>
                      <textarea
                        rows={4}
                        value={section.content || ""}
                        onChange={(e) => updateSection(index, "content", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <ImageUpload
                        value={section.image || ""}
                        onChange={(id) => updateSection(index, "image", id)}
                        label="Section Image"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">CTA Text</label>
                      <input
                        value={section.ctaText || ""}
                        onChange={(e) => updateSection(index, "ctaText", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">CTA URL</label>
                      <input
                        value={section.ctaUrl || ""}
                        onChange={(e) => updateSection(index, "ctaUrl", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={section.visible !== false}
                        onChange={(e) => updateSection(index, "visible", e.target.checked)}
                      />
                      Visible
                    </label>
                  </div>
                </div>
              ))
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#4A2C6E] px-8 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Page"}
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
}
