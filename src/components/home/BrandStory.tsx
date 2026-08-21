import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/MediaImage";

export interface BrandStoryProps {
  title?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export function BrandStory({
  title = "Our Story",
  content,
  image,
  imageAlt,
  ctaText,
  ctaUrl,
  className,
}: BrandStoryProps) {
  return (
    <section className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {image && (
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent to-primary/10" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-elevated">
              <MediaImage
                src={image}
                alt={imageAlt || title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        )}

        <div className={cn(!image && "lg:col-span-2 lg:max-w-3xl")}>
          <p className="section-eyebrow mb-4">About Us</p>
          <h2 className="section-title">{title}</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-text-muted">
            {content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {ctaText && ctaUrl && (
            <div className="mt-8">
              <Link href={ctaUrl}>
                <Button variant="primary">{ctaText}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
