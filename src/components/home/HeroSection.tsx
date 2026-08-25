import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/MediaImage";

export interface HeroSectionProps {
  heading: string;
  subtitle?: string;
  primaryCta?: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  backgroundImage?: string;
  imageAlt?: string;
  className?: string;
}

export function HeroSection({
  heading,
  subtitle,
  primaryCta,
  secondaryCta,
  backgroundImage,
  imageAlt = "Featured hoya plant",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-white",
        className
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="animate-fade-up">
          <p className="section-eyebrow mb-5">Hoyas &amp; Indoor Plants</p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button size="lg">{primaryCta.text}</Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button variant="outline" size="lg">
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent to-primary/5" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-accent shadow-elevated sm:aspect-square lg:aspect-[4/5]">
            {backgroundImage ? (
              <MediaImage
                src={backgroundImage}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent-warm/10" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
