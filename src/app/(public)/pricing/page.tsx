import type { Metadata } from "next";
import { Tag } from "lucide-react";
import { getActivePricingPlans, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { PricingCards } from "@/components/services/ServiceCards";
import { EmptyState } from "@/components/ui/EmptyState";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Pricing",
    description: "View our pricing for hoya care consultations and plant services.",
    path: "/pricing",
  });
}

export default async function PricingPage() {
  const [settings, plans] = await Promise.all([
    getSiteSettings(),
    getActivePricingPlans(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Plans"
        title="Pricing"
        subtitle="Transparent pricing for plant care and consultation services."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {plans.length > 0 ? (
          <PricingCards plans={plans} currency={settings.currency} />
        ) : (
          <EmptyState
            icon={Tag}
            title="Pricing not yet configured"
            description="We're finalizing our pricing plans. Contact us for a custom quote in the meantime."
            actionHref="/contact"
            actionLabel="Request a Quote"
          />
        )}
      </div>
    </>
  );
}
