"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/providers/ToastProvider";

export interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function NewsletterSection({
  title = "Join Our Community",
  subtitle = "Get plant care tips, styling inspiration, and exclusive offers delivered to your inbox.",
  className,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      showToast({
        type: "success",
        title: "Subscribed!",
        message: "Thank you for joining our newsletter.",
      });
      setEmail("");
    } catch {
      showToast({
        type: "error",
        title: "Subscription failed",
        message: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-12 shadow-card sm:px-12 sm:py-16">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-warm/10 blur-2xl" />

          <div className="relative mx-auto max-w-xl text-center">
            <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <Mail className="size-6" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-2xl font-semibold text-text sm:text-3xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base">
                {subtitle}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                aria-label="Email address"
              />
              <Button type="submit" loading={loading} className="sm:shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
