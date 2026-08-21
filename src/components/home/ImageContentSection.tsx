import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/MediaImage";

export interface ImageContentSectionProps {
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  ctaText?: string;
  ctaUrl?: string;
  className?: string;
}

export function ImageContentSection({
  title,
  subtitle,
  content,
  image,
  imageAlt,
  imagePosition = "right",
  ctaText,
  ctaUrl,
  className,
}: ImageContentSectionProps) {
  const imageBlock = image ? (
    <div className="relative">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent to-primary/10" />
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
        <MediaImage
          src={image}
          alt={imageAlt || title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </div>
  ) : null;

  const textBlock = (
    <div>
      {subtitle && <p className="section-eyebrow mb-4">{subtitle}</p>}
      <h2 className="section-title">{title}</h2>
      {content && (
        <p className="section-subtitle mt-5">{content}</p>
      )}
      {ctaText && ctaUrl && (
        <div className="mt-8">
          <Link href={ctaUrl}>
            <Button variant="primary">{ctaText}</Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <section
      className={cn(
        imagePosition === "left" ? "bg-accent/20" : "",
        "py-16 sm:py-24",
        className
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  );
}
