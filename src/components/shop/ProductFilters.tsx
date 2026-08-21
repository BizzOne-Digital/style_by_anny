"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: Category[];
  basePath?: string;
}

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

export function ProductFilters({ categories, basePath }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");

  const path = basePath || pathname;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      router.push(`${path}?${params.toString()}`);
    },
    [router, path, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput || null });
  };

  const currentSort = searchParams.get("sort") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search plants…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <button
        className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters & Sort
        </span>
      </button>

      <div className={cn("space-y-6 lg:block", mobileOpen ? "block" : "hidden lg:block")}>
        <div>
          <label className="mb-2 block text-sm font-medium text-text">Sort by</label>
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value || null })}
            className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {!basePath && categories.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-text">Category</p>
            <div className="space-y-1">
              <button
                onClick={() => router.push("/shop")}
                className={cn(
                  "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                  pathname === "/shop"
                    ? "bg-accent text-primary font-medium"
                    : "text-text-muted hover:bg-accent/50"
                )}
              >
                All Plants
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => router.push(`/shop/${cat.slug}`)}
                  className={cn(
                    "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                    pathname === `/shop/${cat.slug}`
                      ? "bg-accent text-primary font-medium"
                      : "text-text-muted hover:bg-accent/50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-text">Availability</p>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) =>
                updateParams({ inStock: e.target.checked ? "true" : null })
              }
              className="rounded border-border text-primary focus:ring-primary"
            />
            In stock only
          </label>
          <label className="flex items-center gap-2 text-sm text-text-muted">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) =>
                updateParams({ onSale: e.target.checked ? "true" : null })
              }
              className="rounded border-border text-primary focus:ring-primary"
            />
            On sale
          </label>
        </div>
      </div>
    </div>
  );
}
