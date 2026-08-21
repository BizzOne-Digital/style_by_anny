import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { getActiveTestimonials, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Testimonials",
    description: "Read what our clients say about Plant & Style by Anne.",
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const testimonials = await getActiveTestimonials();

  return (
    <>
      <PageHeader
        eyebrow="Kind Words"
        title="Testimonials"
        subtitle="Hear from clients who have transformed their spaces with us."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {testimonials.length > 0 ? (
          <TestimonialsSection testimonials={testimonials} />
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="No testimonials yet"
            description="We're grateful for every client. Check back soon to read their stories."
            actionHref="/contact"
            actionLabel="Work With Us"
          />
        )}
      </div>
    </>
  );
}
