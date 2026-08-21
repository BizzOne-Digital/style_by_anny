import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartPageContent } from "@/components/cart/CartPageContent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Cart",
    description: "Review your cart and proceed to checkout.",
    path: "/cart",
    noIndex: true,
  });
}

export default async function CartPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader title="Shopping Cart" subtitle="Review your items before checkout." />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CartPageContent currency={settings.currency} />
      </div>
    </>
  );
}
