const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

function stripLocalhostUrl(value: string): string {
  try {
    const url = new URL(value);
    if (
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    ) {
      return url.pathname + url.search;
    }
  } catch {
    // not a valid URL
  }
  return value;
}

/**
 * Resolve any image reference to a loadable URL.
 * Supports: full URLs, /public paths, MongoDB media IDs.
 */
export function resolveMediaSrc(src?: string | null): string | undefined {
  if (!src?.trim()) return undefined;

  let value = src.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    value = stripLocalhostUrl(value);
    if (value.startsWith("/")) return value;
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (OBJECT_ID_PATTERN.test(value)) {
    return `/api/media/${value}`;
  }

  // Relative media path without leading slash
  if (value.startsWith("images/")) {
    return `/${value}`;
  }

  // Already a relative media path
  if (value.startsWith("api/media/")) {
    return `/${value}`;
  }

  return value;
}

/** @deprecated Use resolveMediaSrc — kept for backwards compatibility */
export function getMediaUrl(id: string): string {
  return resolveMediaSrc(id) ?? "";
}

export function isExternalMedia(src?: string | null): boolean {
  const resolved = resolveMediaSrc(src);
  return Boolean(resolved?.startsWith("http"));
}

export function resolveAbsoluteMediaUrl(
  src?: string | null,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
): string | undefined {
  const resolved = resolveMediaSrc(src);
  if (!resolved) return undefined;
  if (resolved.startsWith("http")) return resolved;
  return `${baseUrl.replace(/\/$/, "")}${resolved}`;
}
