import type { Metadata } from "next";
import { getActiveFAQs, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { HelpCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "FAQ",
    description: "Frequently asked questions about our plants, services, and orders.",
    path: "/faq",
  });
}

export default async function FAQPage() {
  const faqs = await getActiveFAQs();

  interface FAQItem {
    _id: string;
    question: string;
    answer: string;
    category?: string;
  }

  const grouped = (faqs as FAQItem[]).reduce<Record<string, FAQItem[]>>(
    (acc, faq) => {
      const cat = faq.category || "General";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(faq);
      return acc;
    },
    {}
  );

  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our plants, services, and orders."
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {faqs.length > 0 ? (
          <div className="space-y-10">
            {Object.entries(grouped).map(([category, categoryFaqs]) => (
              <div key={category}>
                <h3 className="mb-4 font-heading text-2xl text-text">{category}</h3>
                <FAQAccordion items={categoryFaqs} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title="No FAQs yet"
            description="We're compiling answers to common questions. Contact us if you need help."
            actionHref="/contact"
            actionLabel="Contact Us"
          />
        )}
      </div>
    </>
  );
}
