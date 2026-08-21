"use client";

import { useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminToast } from "@/components/admin/AdminToast";

interface MediaItem {
  id: string;
  filename: string;
  uploadedAt: string;
}

export default function AdminMediaPage() {
  const toast = useAdminToast();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error);

        setMedia((prev) => [
          {
            id: json.data.id,
            filename: json.data.filename || file.name,
            uploadedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      toast.success("Upload complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error);
      setMedia((prev) => prev.filter((m) => m.id !== deleteId));
      toast.success("Media deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const copyUrl = (id: string) => {
    navigator.clipboard.writeText(`/api/media/${id}`);
    toast.success("URL copied to clipboard");
  };

  return (
    <>
      <AdminHeader title="Media Library" subtitle="Upload and manage images" />
      <main className="flex-1 p-4 lg:p-8">
        <div className="mb-6">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#4A2C6E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3d2459]">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload Images"}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {media.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E8E0F0] bg-white py-16 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No media uploaded yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Upload images to use across your site
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {media.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-[#E8E0F0] bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/media/${item.id}`}
                  alt={item.filename}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{item.filename}</p>
                  <p className="truncate text-xs text-gray-400">{item.id}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => copyUrl(item.id)}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium"
                  >
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-lg bg-red-500 p-2 text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Media"
        message="Are you sure? This image may be used on your site."
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
