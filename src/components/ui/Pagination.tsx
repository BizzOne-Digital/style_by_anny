import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  searchParams?: Record<string, string | undefined>;
  onPageChange?: (page: number) => void;
  className?: string;
}

function buildUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "",
  searchParams,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const PageButton = ({
    page,
    children,
    isActive = false,
    ariaLabel,
  }: {
    page: number;
    children: React.ReactNode;
    isActive?: boolean;
    ariaLabel?: string;
  }) => {
    const classNames = cn(
      "inline-flex size-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-white"
        : "border border-border bg-surface text-text hover:border-primary"
    );

    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={() => onPageChange(page)}
          className={classNames}
          aria-label={ariaLabel}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </button>
      );
    }

    return (
      <Link
        href={buildUrl(basePath, page, searchParams)}
        className={classNames}
        aria-label={ariaLabel}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </Link>
    );
  };

  const NavButton = ({
    page,
    disabled,
    children,
    ariaLabel,
  }: {
    page: number;
    disabled: boolean;
    children: React.ReactNode;
    ariaLabel: string;
  }) => {
    const classNames = cn(
      "inline-flex size-9 items-center justify-center rounded-md text-text transition-colors",
      disabled
        ? "pointer-events-none opacity-40"
        : "border border-border bg-surface hover:border-primary"
    );

    if (onPageChange) {
      return (
        <button
          type="button"
          onClick={() => !disabled && onPageChange(page)}
          disabled={disabled}
          className={classNames}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      );
    }

    if (disabled) {
      return (
        <span className={classNames} aria-hidden="true">
          {children}
        </span>
      );
    }

    return (
      <Link
        href={buildUrl(basePath, page, searchParams)}
        className={classNames}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <NavButton
        page={currentPage - 1}
        disabled={currentPage <= 1}
        ariaLabel="Previous page"
      >
        <ChevronLeft className="size-4" />
      </NavButton>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-9 items-center justify-center text-sm text-text-muted"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <PageButton
            key={page}
            page={page}
            isActive={page === currentPage}
            ariaLabel={`Page ${page}`}
          >
            {page}
          </PageButton>
        )
      )}

      <NavButton
        page={currentPage + 1}
        disabled={currentPage >= totalPages}
        ariaLabel="Next page"
      >
        <ChevronRight className="size-4" />
      </NavButton>
    </nav>
  );
}
