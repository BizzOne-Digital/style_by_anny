import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/MediaImage";

export interface CTABannerProps {
  title: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export function CTABanner({
  title,
  content,
  image,
  imageAlt,
  ctaText,
  ctaUrl,
  className,
}: CTABannerProps) {
  return (
    <section className={cn("py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary shadow-elevated">
          {image && (
            <div className="absolute inset-0">
              <MediaImage
                src={image}
                alt={imageAlt || title}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/80 to-primary/60" />
            </div>
          )}

          <div className="relative px-8 py-16 text-center sm:px-12 sm:py-20">
            <p className="section-eyebrow section-eyebrow-light mx-auto mb-4">
              Get Started
            </p>
            <h2 className="text-on-dark mx-auto max-w-2xl font-heading text-3xl font-semibold sm:text-4xl">
              {title}
            </h2>
            {content && (
              <p className="text-on-dark mx-auto mt-4 max-w-xl text-base leading-relaxed">
                {content}
              </p>
            )}
            {ctaText && ctaUrl && (
              <div className="mt-8">
                <Link href={ctaUrl}>
                  <Button
                    size="lg"
                    className="bg-white text-primary shadow-elevated hover:bg-accent"
                  >
                    {ctaText}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
