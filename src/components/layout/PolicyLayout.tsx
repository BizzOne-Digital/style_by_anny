import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

interface PolicyLayoutProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  eyebrow,
  title,
  subtitle,
  lastUpdated = "August 2026",
  children,
}: PolicyLayoutProps) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="mb-10 text-sm text-text-muted">
          Last updated: {lastUpdated}
        </p>
        <div className="prose-content space-y-8">{children}</div>
        <div className="mt-14 rounded-2xl border border-border bg-accent/50 p-6">
          <p className="text-sm text-text-muted">
            Questions about this policy?{" "}
            <Link
              href="/contact"
              className="font-medium text-primary underline underline-offset-2"
            >
              Contact us
            </Link>{" "}
            and we&apos;ll be happy to help.
          </p>
        </div>
      </div>
    </>
  );
}
