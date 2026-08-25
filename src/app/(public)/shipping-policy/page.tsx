import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PolicyLayout } from "@/components/layout/PolicyLayout";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Shipping Policy",
    description:
      "Learn how Plant Style by Anne ships live plants safely across Canada.",
    path: "/shipping-policy",
  });
}

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Shipping Policy"
      subtitle="We take great care packaging every plant so it arrives healthy and ready for your home."
    >
      <section>
        <h2>Order processing</h2>
        <p>
          Orders are typically processed within 1–3 business days. During peak
          seasons or high order volume, processing may take slightly longer. You
          will receive a confirmation email when your order is placed and a
          shipping notification with tracking details once your plants are on
          their way.
        </p>
      </section>

      <section>
        <h2>Shipping areas</h2>
        <p>
          We currently ship within Canada. Shipping rates and delivery times vary
          by destination and order size. Rates are calculated at checkout based
          on your location and the items in your cart.
        </p>
      </section>

      <section>
        <h2>Live plant packaging</h2>
        <p>
          Every plant is carefully inspected, watered if needed, and packaged to
          minimize stress during transit. Hoyas and other live plants are
          secured in their pots, cushioned, and shipped in weather-appropriate
          packaging whenever possible.
        </p>
        <ul>
          <li>Plants are shipped Monday–Wednesday when possible to avoid weekend delays.</li>
          <li>Extreme weather may delay shipments to protect plant health.</li>
          <li>We recommend being available to receive your package promptly.</li>
        </ul>
      </section>

      <section>
        <h2>Delivery times</h2>
        <p>
          Estimated delivery times depend on your location and the carrier
          selected at checkout. Most orders arrive within 3–10 business days after
          shipment. Tracking information will be provided by email when
          available.
        </p>
      </section>

      <section>
        <h2>Shipping issues</h2>
        <p>
          If your order is lost, significantly delayed, or arrives with visible
          shipping damage, please contact us within 48 hours of delivery with
          photos of the packaging and plant. We will work with you to resolve the
          issue promptly.
        </p>
      </section>
    </PolicyLayout>
  );
}
