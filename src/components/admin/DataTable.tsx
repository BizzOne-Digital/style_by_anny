"use client";

import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T & string | ((item: T) => string);
  loading?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T & string)[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  serverSide?: boolean;
  actions?: React.ReactNode;
}

export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage = "No items found",
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
  serverSide = false,
  actions,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState("");

  const filteredData = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    if (serverSide || !localSearch.trim()) return rows;
    const q = localSearch.toLowerCase();
    return rows.filter((item) =>
      searchKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [data, localSearch, searchKeys, serverSide]);

  const getKey = (item: T): string => {
    if (typeof keyField === "function") return keyField(item);
    return String(item[keyField]);
  };

  const handleSearch = (value: string) => {
    setLocalSearch(value);
    onSearch?.(value);
  };

  return (
    <div className="rounded-xl border border-[#E8E0F0] bg-white shadow-sm">
      {(searchable || actions) && (
        <div className="flex flex-col gap-3 border-b border-[#E8E0F0] p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder={searchPlaceholder}
                value={localSearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-[#4A2C6E] focus:outline-none focus:ring-1 focus:ring-[#4A2C6E]"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E8E0F0] bg-[#FAF8F5]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-semibold text-[#2D2D2D]",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#4A2C6E] border-t-transparent" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr
                  key={getKey(item)}
                  className="border-b border-[#E8E0F0] hover:bg-[#FAF8F5]/50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-gray-700", col.className)}
                    >
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between border-t border-[#E8E0F0] px-4 py-3">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
