import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings, {
    title: "Contact",
    description: `Get in touch with ${settings.brandName}. We'd love to hear from you.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Have a question about our plants or services? We'd love to hear from you."
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-heading text-2xl text-text">Contact Information</h2>
              <p className="mt-2 text-sm text-text-muted">
                Reach out and we&apos;ll respond within 1–2 business days.
              </p>
            </div>
            <ul className="space-y-5">
              {settings.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text">Email</p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm text-text-muted hover:text-primary"
                    >
                      {settings.email}
                    </a>
                  </div>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text">Phone</p>
                    <a
                      href={`tel:${settings.phone.replace(/\D/g, "")}`}
                      className="text-sm text-text-muted hover:text-primary"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-text">Location</p>
                  <p className="text-sm text-text-muted">Calgary, Alberta, Canada</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
