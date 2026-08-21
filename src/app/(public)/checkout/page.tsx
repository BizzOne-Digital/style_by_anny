import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutForm } from "@/components/forms/CheckoutForm";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Checkout",
    description: "Complete your order.",
    path: "/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader title="Checkout" subtitle="Complete your order details below." />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CheckoutForm
          currency={settings.currency}
          shippingRate={settings.shippingFlatRate ?? 0}
          taxRate={settings.taxRate ?? 0}
        />
      </div>
    </>
  );
}
