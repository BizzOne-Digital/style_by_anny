"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { isExternalMedia, resolveMediaSrc } from "@/lib/media-url";

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
  sizes,
  objectFit = "cover",
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveMediaSrc(src);

  if (!resolvedSrc || failed) {
    return <ImageFallback alt={alt} fill={fill} className={className} />;
  }

  const external = isExternalMedia(resolvedSrc);
  const objectFitClass =
    objectFit === "cover"
      ? "object-cover"
      : objectFit === "contain"
        ? "object-contain"
        : objectFit === "fill"
          ? "object-fill"
          : "object-none";

  // Local & external images: native img is most reliable (no optimizer issues)
  if (external || resolvedSrc.startsWith("/images/")) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full", objectFitClass, className)}
          loading={priority ? "eager" : "lazy"}
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
        onError={() => setFailed(true)}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
        className={cn(objectFitClass, className)}
        unoptimized={external}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width ?? 400}
      height={height ?? 400}
      priority={priority}
      sizes={sizes}
      className={cn(objectFitClass, className)}
      unoptimized={external}
      onError={() => setFailed(true)}
    />
  );
}
