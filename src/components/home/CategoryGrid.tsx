import Link from "next/link";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/MediaImage";
import { SectionHeader } from "@/components/ui/SectionHeader";

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface CategoryGridProps {
  title?: string;
  subtitle?: string;
  categories: CategoryItem[];
  className?: string;
}

export function CategoryGrid({
  title = "Shop by Category",
  subtitle = "Find the perfect plants for every room",
  categories,
  className,
}: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className={cn("bg-accent/30 py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Collections"
          title={title}
          subtitle={subtitle}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
            >
              <div className="relative aspect-[4/3]">
                {category.image ? (
                  <MediaImage
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary-light/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-heading text-xl font-semibold text-white">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-white/80">
                    {category.description}
                  </p>
                )}
                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-widest text-accent-warm opacity-0 transition-opacity group-hover:opacity-100">
                  Shop now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
