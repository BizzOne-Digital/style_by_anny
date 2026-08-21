import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getActiveServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceCards } from "@/components/services/ServiceCards";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Services",
    description:
      "Professional plant styling, interior design consultation, and plant care services.",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <>
      <PageHeader
        eyebrow="What We Offer"
        title="Our Services"
        subtitle="From plant styling to full interior design consultations, we help you create spaces that feel alive."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {services.length > 0 ? (
          <ServiceCards services={services} />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Services coming soon"
            description="We're preparing our service offerings. In the meantime, feel free to reach out."
            actionHref="/contact"
            actionLabel="Contact Us"
          />
        )}
      </div>
    </>
  );
}
