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
  imageAlt = "Hero background",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[520px] overflow-hidden bg-primary text-white lg:min-h-[600px]",
        className
      )}
    >
      {backgroundImage ? (
        <div className="absolute inset-0">
          <MediaImage
            src={backgroundImage}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/85 to-primary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-light opacity-100" />
      )}

      {/* Decorative accent */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-accent-warm/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20 sm:px-8 lg:min-h-[600px] lg:py-28">
        <div className="max-w-2xl animate-fade-up">
          <p className="section-eyebrow section-eyebrow-light mb-5">
            Plant &amp; Interior Design
          </p>
          <h1 className="text-on-dark font-heading text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {subtitle && (
            <p className="text-on-dark mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap gap-3">
              {primaryCta && (
                <Link href={primaryCta.href}>
                  <Button
                    size="lg"
                    className="bg-white text-primary shadow-elevated hover:bg-accent hover:text-primary-dark"
                  >
                    {primaryCta.text}
                  </Button>
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/50 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
                  >
                    {secondaryCta.text}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
