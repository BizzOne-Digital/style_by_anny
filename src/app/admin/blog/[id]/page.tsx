"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useAdminToast } from "@/components/admin/AdminToast";

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useAdminToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    author: "Anne",
    category: "",
    tags: "",
    published: false,
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          const p = json.data;
          setForm({
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt || "",
            content: p.content || "",
            featuredImage: p.featuredImage || "",
            author: p.author || "Anne",
            category: p.category || "",
            tags: (p.tags || []).join(", "),
            published: p.published || false,
            seoTitle: p.seoTitle || "",
            seoDescription: p.seoDescription || "",
          });
        } else {
          toast.error("Post not found");
        }
      })
      .catch(() => toast.error("Failed to load post"))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#4A2C6E] focus:outline-none";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Post updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4A2C6E] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader title="Edit Blog Post" subtitle={form.title} />
      <main className="flex-1 p-4 lg:p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-xl border border-[#E8E0F0] bg-white p-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Excerpt</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Content</label>
              <textarea
                rows={12}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className={inputClass}
              />
            </div>
            <ImageUpload
              value={form.featuredImage}
              onChange={(id) => setForm({ ...form, featuredImage: id })}
              label="Featured Image"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Author</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tags</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published
            </label>
          </div>

          <div className="rounded-xl border border-[#E8E0F0] bg-white p-6 space-y-4">
            <h2 className="font-semibold">SEO</h2>
            <div>
              <label className="mb-1 block text-sm font-medium">SEO Title</label>
              <input
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SEO Description</label>
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) =>
                  setForm({ ...form, seoDescription: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#4A2C6E] px-8 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Post"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
