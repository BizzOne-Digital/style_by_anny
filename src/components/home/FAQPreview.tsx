import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

export interface FAQPreviewProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  viewAllHref?: string;
  className?: string;
}

export function FAQPreview({
  title = "Frequently Asked Questions",
  subtitle = "Quick answers to common questions",
  faqs,
  viewAllHref = "/faq",
  className,
}: FAQPreviewProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={cn("bg-accent/20 py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title={title}
          subtitle={subtitle}
        />

        <FAQAccordion items={faqs} />

        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            View all FAQs
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
