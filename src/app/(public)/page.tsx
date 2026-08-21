import type { Metadata } from "next";
import {
  getSiteSettings,
  getFeaturedProducts,
  getActiveCategories,
  getActiveTestimonials,
  getActiveFAQs,
  getPageBySlug,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import type { PageSection } from "@/types";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ImageContentSection } from "@/components/home/ImageContentSection";
import { CTABanner } from "@/components/home/CTABanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQPreview } from "@/components/home/FAQPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata(settings);
}

function getSectionImageAlt(section: PageSection): string | undefined {
  const alt = section.data?.imageAlt;
  return typeof alt === "string" ? alt : undefined;
}

function findSection(sections: PageSection[], key: string) {
  return sections.find((s) => s.key === key && s.visible !== false);
}

export default async function HomePage() {
  const [settings, homePage, featuredProducts, categories, testimonials, faqs] =
    await Promise.all([
      getSiteSettings(),
      getPageBySlug("home"),
      getFeaturedProducts(8),
      getActiveCategories(),
      getActiveTestimonials(),
      getActiveFAQs(),
    ]);

  const sections = (homePage?.sections || []) as PageSection[];
  const hero = findSection(sections, "hero");
  const brandStory = findSection(sections, "brand_story");
  const categoriesSection = findSection(sections, "categories");
  const featuredSection = findSection(sections, "featured");
  const plantStyling = findSection(sections, "plant_styling");
  const education = findSection(sections, "education");
  const testimonialsSection = findSection(sections, "testimonials");
  const faqSection = findSection(sections, "faq");
  const ctaSection = findSection(sections, "cta");
  const newsletterSection = findSection(sections, "newsletter");

  return (
    <>
      <HeroSection
        heading={
          hero?.title ||
          settings.tagline ||
          "Incorporating plants and interior design at home"
        }
        subtitle={hero?.subtitle || settings.tagline}
        primaryCta={{
          text: hero?.ctaText || "Shop Plants",
          href: hero?.ctaUrl || "/shop",
        }}
        secondaryCta={{ text: "Explore Our Services", href: "/services" }}
        backgroundImage={hero?.image}
        imageAlt={getSectionImageAlt(hero || { key: "", type: "" })}
        className="mx-0"
      />

      {brandStory && (
        <BrandStory
          title={brandStory.title}
          content={brandStory.content || ""}
          image={brandStory.image}
          imageAlt={getSectionImageAlt(brandStory)}
          ctaText={brandStory.ctaText}
          ctaUrl={brandStory.ctaUrl}
        />
      )}

      {categoriesSection !== undefined && (
        <CategoryGrid
          title={categoriesSection?.title}
          subtitle={categoriesSection?.subtitle}
          categories={categories}
        />
      )}

      {featuredSection !== undefined && (
        <FeaturedProducts
          title={featuredSection?.title}
          subtitle={featuredSection?.subtitle}
          products={featuredProducts}
          currency={settings.currency}
        />
      )}

      {plantStyling && (
        <ImageContentSection
          title={plantStyling.title || ""}
          subtitle={plantStyling.subtitle}
          content={plantStyling.content}
          image={plantStyling.image}
          imageAlt={getSectionImageAlt(plantStyling)}
          imagePosition={
            plantStyling.data?.imagePosition === "left" ? "left" : "right"
          }
          ctaText={plantStyling.ctaText}
          ctaUrl={plantStyling.ctaUrl}
        />
      )}

      {education && (
        <ImageContentSection
          title={education.title || ""}
          subtitle={education.subtitle}
          content={education.content}
          image={education.image}
          imageAlt={getSectionImageAlt(education)}
          imagePosition={
            education.data?.imagePosition === "left" ? "left" : "right"
          }
          ctaText={education.ctaText}
          ctaUrl={education.ctaUrl}
        />
      )}

      {testimonialsSection !== undefined && (
        <TestimonialsSection
          title={testimonialsSection?.title}
          testimonials={testimonials}
        />
      )}

      {faqSection !== undefined && (
        <FAQPreview title={faqSection?.title} faqs={faqs} />
      )}

      {ctaSection && (
        <CTABanner
          title={ctaSection.title || ""}
          content={ctaSection.content}
          image={ctaSection.image}
          imageAlt={getSectionImageAlt(ctaSection)}
          ctaText={ctaSection.ctaText}
          ctaUrl={ctaSection.ctaUrl}
        />
      )}

      {newsletterSection !== undefined && (
        <NewsletterSection
          title={newsletterSection?.title}
          subtitle={newsletterSection?.subtitle}
        />
      )}
    </>
  );
}
