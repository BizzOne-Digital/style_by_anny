"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";

interface ProductImage {
  mediaId: string;
  alt?: string;
  order: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-accent text-text-muted">
        No image available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-accent shadow-card">
        <MediaImage
          src={active.mediaId}
          alt={active.alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, index) => (
            <button
              key={`${img.mediaId}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                index === activeIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              )}
            >
              <MediaImage
                src={img.mediaId}
                alt={img.alt || `${productName} ${index + 1}`}
                fill
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
