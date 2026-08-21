import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export interface Testimonial {
  _id: string;
  customerName: string;
  text: string;
  rating?: number;
  image?: string;
}

export interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

export function TestimonialsSection({
  title = "What Our Clients Say",
  subtitle = "Real stories from homes we've helped transform",
  testimonials,
  className,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Testimonials"
          title={title}
          subtitle={subtitle}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial._id}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card"
            >
              {testimonial.rating != null && testimonial.rating > 0 && (
                <div
                  className="mb-4 flex gap-0.5"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-4",
                        i < testimonial.rating!
                          ? "fill-accent-warm text-accent-warm"
                          : "text-border"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              )}

              <p className="flex-1 text-sm leading-relaxed text-text">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <footer className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                {testimonial.image && (
                  <div className="relative size-10 overflow-hidden rounded-full bg-accent ring-2 ring-accent-warm/30">
                    <MediaImage
                      src={testimonial.image}
                      alt={testimonial.customerName}
                      fill
                      sizes="40px"
                    />
                  </div>
                )}
                <cite className="text-sm font-semibold not-italic text-primary">
                  {testimonial.customerName}
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
