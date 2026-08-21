import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderLookupForm } from "@/components/forms/OrderLookupForm";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Order Lookup",
    description: "Look up your order status using your order number and email.",
    path: "/order-lookup",
    noIndex: true,
  });
}

export default async function OrderLookupPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        title="Order Lookup"
        subtitle="Enter your order number and email to check your order status."
      />
      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <OrderLookupForm currency={settings.currency} />
      </div>
    </>
  );
}
