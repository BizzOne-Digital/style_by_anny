import Link from "next/link";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/MediaImage";
import { cn } from "@/lib/utils";

interface Service {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  icon?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface ServiceCardsProps {
  services: Service[];
}

export function ServiceCards({ services }: ServiceCardsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service._id}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
        >
          {service.image && (
            <div className="relative aspect-[16/10] bg-accent">
              <MediaImage
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-heading text-2xl text-text">{service.title}</h3>
            {service.description && (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                {service.description}
              </p>
            )}
            {service.ctaUrl && (
              <Link href={service.ctaUrl} className="mt-6">
                <Button variant="outline" className="w-full">
                  {service.ctaText || "Learn More"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface PricingPlan {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  billingPeriod?: string;
  features?: string[];
  ctaText?: string;
  ctaUrl?: string;
  featured?: boolean;
}

interface PricingCardsProps {
  plans: PricingPlan[];
  currency?: string;
}

export function PricingCards({ plans, currency = "CAD" }: PricingCardsProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className={cn(
            "flex flex-col rounded-xl border p-8",
            plan.featured
              ? "border-primary bg-primary text-white shadow-lg scale-[1.02]"
              : "border-border bg-surface"
          )}
        >
          {plan.featured && (
            <span className="mb-4 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
              Most Popular
            </span>
          )}
          <h3
            className={cn(
              "font-heading text-2xl",
              plan.featured ? "text-white" : "text-text"
            )}
          >
            {plan.name}
          </h3>
          {plan.description && (
            <p
              className={cn(
                "mt-2 text-sm",
                plan.featured ? "text-white/80" : "text-text-muted"
              )}
            >
              {plan.description}
            </p>
          )}
          {plan.price !== undefined && plan.price !== null && (
            <div className="mt-6">
              <span className="font-heading text-4xl">
                {formatPrice(plan.price, currency)}
              </span>
              {plan.billingPeriod && plan.billingPeriod !== "one-time" && (
                <span
                  className={cn(
                    "text-sm",
                    plan.featured ? "text-white/70" : "text-text-muted"
                  )}
                >
                  /{plan.billingPeriod}
                </span>
              )}
            </div>
          )}
          {plan.features && plan.features.length > 0 && (
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      plan.featured ? "text-white" : "text-primary"
                    )}
                  />
                  <span className={plan.featured ? "text-white/90" : "text-text-muted"}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {plan.ctaUrl && (
            <Link href={plan.ctaUrl} className="mt-8 block">
              <Button
                variant={plan.featured ? "secondary" : "primary"}
                className="w-full"
              >
                {plan.ctaText || "Get Started"}
              </Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
