import type { Metadata } from "next";
import { getPageBySlug, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { MediaImage } from "@/components/MediaImage";
import type { PageSection } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageBySlug("about"),
  ]);
  if (!page) return buildMetadata(settings, { title: "About" });
  return buildMetadata(settings, {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    path: "/about",
  });
}

function getSectionImageAlt(section: PageSection): string {
  const alt = section.data?.imageAlt;
  return typeof alt === "string" ? alt : section.title || "About section image";
}

export default async function AboutPage() {
  const page = await getPageBySlug("about");

  if (!page) {
    return (
      <>
        <PageHeader
          eyebrow="Our Story"
          title="About Anne"
          subtitle="Bringing plants and interior design together for over 6 years."
        />
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose-content">
            <p>
              Plant & Style by Anne has been in the business for over 6 years.
              Anne has incorporated her love for interior design with her love of
              plants.
            </p>
          </div>
        </div>
      </>
    );
  }

  const visibleSections = (page.sections || [])
    .filter((s: PageSection) => s.visible !== false)
    .sort(
      (a: PageSection, b: PageSection) => (a.order || 0) - (b.order || 0)
    );

  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={page.title}
        subtitle={
          visibleSections[0]?.subtitle ||
          "Bringing plants and interior design together."
        }
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {visibleSections.length > 0 ? (
          <div className="space-y-20">
            {visibleSections.map((section: PageSection, index: number) => (
              <div
                key={section.key}
                className={`grid items-center gap-12 lg:grid-cols-2 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {section.image && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-accent">
                    <MediaImage
                      src={section.image}
                      alt={getSectionImageAlt(section)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div
                  className={
                    !section.image ? "lg:col-span-2 max-w-3xl mx-auto" : ""
                  }
                >
                  {section.title && (
                    <h2 className="font-heading text-3xl text-text sm:text-4xl">
                      {section.title}
                    </h2>
                  )}
                  {section.subtitle && (
                    <p className="mt-3 text-lg text-primary">
                      {section.subtitle}
                    </p>
                  )}
                  {section.content && (
                    <div className="prose-content mt-6">
                      {section.content.split("\n\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="prose-content max-w-3xl mx-auto">
            <p>Content coming soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
