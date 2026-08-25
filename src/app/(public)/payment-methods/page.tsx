import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PolicyLayout } from "@/components/layout/PolicyLayout";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Payment Methods",
    description:
      "Secure payment options accepted at Plant Style by Anne.",
    path: "/payment-methods",
  });
}

export default function PaymentMethodsPage() {
  return (
    <PolicyLayout
      eyebrow="Policies"
      title="Payment Methods"
      subtitle="Safe, secure checkout for all your plant orders."
    >
      <section>
        <h2>Accepted payment methods</h2>
        <p>
          We accept major credit and debit cards through our secure Stripe
          checkout, including:
        </p>
        <ul>
          <li>Visa</li>
          <li>Mastercard</li>
          <li>American Express</li>
          <li>Other cards supported by Stripe at checkout</li>
        </ul>
        <p>
          All prices are listed in Canadian dollars (CAD) unless otherwise noted.
        </p>
      </section>

      <section>
        <h2>Secure checkout</h2>
        <p>
          Payments are processed securely through Stripe. We do not store your
          full card details on our servers. Your payment information is
          encrypted and handled according to industry security standards.
        </p>
      </section>

      <section>
        <h2>Order confirmation</h2>
        <p>
          After placing an order, you will receive an email confirmation with
          your order number and details. If payment fails, your order will not
          be processed and you may retry checkout or use a different payment
          method.
        </p>
      </section>

      <section>
        <h2>Pending payments</h2>
        <p>
          In some cases, orders may be placed while payment is still processing.
          You will be notified by email once payment is confirmed. Orders with
          failed payments will be marked as pending and may be cancelled if not
          resolved within a reasonable time.
        </p>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Approved refunds are returned to the original payment method. Please
          allow 5–10 business days for the refund to appear on your statement,
          depending on your bank or card issuer.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          For billing questions or payment issues, contact us at{" "}
          <a href="mailto:plantstyleinc@gmail.com">plantstyleinc@gmail.com</a>{" "}
          with your order number.
        </p>
      </section>
    </PolicyLayout>
  );
}
