"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveMediaSrc } from "@/lib/media-url";

export interface MediaImageProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
}

function ImageFallback({
  alt,
  fill,
  className,
}: {
  alt: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-accent via-background to-primary/5",
        fill ? "absolute inset-0" : "aspect-square w-full",
        className
      )}
      role="img"
      aria-label={alt}
    >
      <Leaf
        className="size-10 text-primary/30"
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </div>
  );
}

export function MediaImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  objectFit = "cover",
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveMediaSrc(src);

  if (!resolvedSrc || failed) {
    return <ImageFallback alt={alt} fill={fill} className={className} />;
  }

  const objectFitClass =
    objectFit === "cover"
      ? "object-cover"
      : objectFit === "contain"
        ? "object-contain"
        : objectFit === "fill"
          ? "object-fill"
          : "object-none";

  // Native img is most reliable on Vercel (no optimizer issues with /api/media or static files)
  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", objectFitClass, className)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      className={cn(objectFitClass, className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
