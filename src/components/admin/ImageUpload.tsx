"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveMediaSrc } from "@/lib/media-url";
import { useAdminToast } from "./AdminToast";

interface ImageUploadProps {
  value?: string;
  onChange: (mediaId: string) => void;
  onClear?: () => void;
  label?: string;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  label = "Upload Image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useAdminToast();

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Upload failed");
        }

        onChange(json.data.id);
        toast.success("Image uploaded successfully");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange, toast]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-[#2D2D2D]">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveMediaSrc(value) ?? ""}
            alt="Upload preview"
            className="h-32 w-32 rounded-lg border border-[#E8E0F0] object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onClear?.();
              onChange("");
            }}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#E8E0F0] bg-[#FAF8F5] text-gray-500 hover:border-[#4A2C6E] hover:text-[#4A2C6E] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
          <span className="text-sm">
            {uploading ? "Uploading..." : "Click to upload"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

interface MultiImageUploadProps {
  images: Array<{ mediaId: string; alt?: string; order: number }>;
  onChange: (
    images: Array<{ mediaId: string; alt?: string; order: number }>
  ) => void;
}

export function MultiImageUpload({ images, onChange }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useAdminToast();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Upload failed");

      onChange([
        ...images,
        { mediaId: json.data.id, alt: "", order: images.length },
      ]);
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updateAlt = (index: number, alt: string) => {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((img, index) => (
          <div key={img.mediaId} className="space-y-2">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMediaSrc(img.mediaId) ?? ""}
                alt={img.alt || "Product"}
                className="h-24 w-24 rounded-lg border border-[#E8E0F0] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Alt text"
              value={img.alt || ""}
              onChange={(e) => updateAlt(index, e.target.value)}
              className="w-24 rounded border border-gray-300 px-2 py-1 text-xs"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E8E0F0] text-gray-400 hover:border-[#4A2C6E] hover:text-[#4A2C6E] disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
