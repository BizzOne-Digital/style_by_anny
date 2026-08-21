"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const toast = useAdminToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog?all=true");
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.items || json.data);
      }
    } catch {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      toast.success("Post deleted");
      setDeleteId(null);
      fetchPosts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      header: "Title",
      render: (p) => (
        <Link
          href={`/admin/blog/${p._id}`}
          className="font-medium text-[#4A2C6E] hover:underline"
        >
          {p.title}
        </Link>
      ),
    },
    { key: "author", header: "Author" },
    {
      key: "published",
      header: "Status",
      render: (p) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            p.published
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {p.published ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (p) => formatDate(p.publishedAt || p.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex gap-2">
          <Link href={`/admin/blog/${p._id}`} className="text-[#4A2C6E]">
            <Pencil className="h-4 w-4" />
          </Link>
          <button type="button" onClick={() => setDeleteId(p._id)} className="text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Blog" subtitle="Manage blog posts" />
      <main className="flex-1 p-4 lg:p-8">
        <DataTable
          columns={columns}
          data={posts}
          keyField="_id"
          loading={loading}
          searchKeys={["title", "author"]}
          emptyMessage="No blog posts yet"
          actions={
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2 text-sm text-white"
            >
              <Plus className="h-4 w-4" /> New Post
            </Link>
          }
        />
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Post"
        message="Are you sure you want to delete this blog post?"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
