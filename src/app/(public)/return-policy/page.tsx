import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PolicyLayout } from "@/components/layout/PolicyLayout";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Return Policy",
    description:
      "Return and exchange policy for live plants purchased from Plant Style by Anne.",
    path: "/return-policy",
  });
}

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Return Policy"
      subtitle="We want you to love every plant you bring home. Here's how we handle returns and exchanges."
    >
      <section>
        <h2>Live plants</h2>
        <p>
          Because plants are living products, we cannot accept returns on healthy
          plants that have simply changed your mind. We do stand behind the
          quality of every plant we send and will make it right if something
          arrives damaged or in poor condition.
        </p>
      </section>

      <section>
        <h2>Damaged or unhealthy on arrival</h2>
        <p>
          If your plant arrives damaged, wilted beyond normal shipping stress, or
          clearly unhealthy, please contact us within 48 hours of delivery.
          Include your order number and clear photos of:
        </p>
        <ul>
          <li>The plant and any affected leaves or stems</li>
          <li>The packaging as received</li>
          <li>The shipping label (if visible)</li>
        </ul>
        <p>
          After reviewing your photos, we may offer a replacement, store credit,
          or partial refund depending on the situation.
        </p>
      </section>

      <section>
        <h2>Wrong item received</h2>
        <p>
          If you receive the wrong plant or an incorrect quantity, contact us
          within 48 hours. We will arrange for the correct item to be sent or
          provide a full refund for the affected item.
        </p>
      </section>

      <section>
        <h2>Non-plant items</h2>
        <p>
          Planters, accessories, and other non-living items may be returned
          within 14 days if unused and in original packaging. Return shipping
          costs are the responsibility of the customer unless the return is due
          to our error.
        </p>
      </section>

      <section>
        <h2>How to request help</h2>
        <p>
          Email us at{" "}
          <a href="mailto:plantstyleinc@gmail.com">plantstyleinc@gmail.com</a>{" "}
          with your order number and photos. We aim to respond within 1–2 business
          days.
        </p>
      </section>
    </PolicyLayout>
  );
}
