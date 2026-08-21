"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
  onSubmit?: () => void;
}

export function SearchBar({
  placeholder = "Search plants, pots, and more…",
  defaultValue = "",
  autoFocus = false,
  className,
  onSubmit,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/shop");
    }
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center", className)}
      role="search"
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 size-4 text-text-muted"
        aria-hidden="true"
      />
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-10 w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-24 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <Button
        type="submit"
        size="sm"
        className="absolute right-1.5"
      >
        Search
      </Button>
    </form>
  );
}
