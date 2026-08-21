import {
  TEMPORARY_IMAGES,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  DEMO_SERVICES,
  buildHomepageSections,
  buildAboutSections,
} from "@/lib/temporary-images";
import {
  Category,
  Product,
  Page,
  SiteSettings,
  Service,
} from "@/models";

export interface SeedDemoResults {
  categories: string;
  products: string;
  homepage: string;
  aboutPage: string;
  services: string;
  settings: string;
}

/** Populate or refresh temporary demo content in the database (CMS-driven, not hardcoded in UI). */
export async function seedDemoContent(
  mode: "create" | "refresh" = "refresh"
): Promise<SeedDemoResults> {
  const results: SeedDemoResults = {
    categories: "0 updated",
    products: "0 updated",
    homepage: "skipped",
    aboutPage: "skipped",
    services: "0 updated",
    settings: "skipped",
  };

  // Categories with images
  let categoriesUpdated = 0;
  for (const cat of DEMO_CATEGORIES) {
    const imageData =
      TEMPORARY_IMAGES.categories[
        cat.slug as keyof typeof TEMPORARY_IMAGES.categories
      ];
    const payload = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      active: true,
      image: imageData?.url ?? "",
      seoDescription: cat.description,
    };

    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      if (mode === "refresh") {
        await Category.updateOne({ slug: cat.slug }, { $set: payload });
        categoriesUpdated++;
      } else if (!existing.image) {
        await Category.updateOne({ slug: cat.slug }, { $set: payload });
        categoriesUpdated++;
      }
    } else {
      await Category.create(payload);
      categoriesUpdated++;
    }
  }
  results.categories = `${categoriesUpdated} upserted`;

  // Build category slug → id map
  const categoryDocs = await Category.find({
    slug: { $in: DEMO_CATEGORIES.map((c) => c.slug) },
  });
  const categoryMap = new Map(
    categoryDocs.map((c) => [c.slug, c._id.toString()])
  );

  // Demo products
  let productsUpdated = 0;
  for (const demo of DEMO_PRODUCTS) {
    const imageData = TEMPORARY_IMAGES.products[demo.imageKey];
    const categoryId = categoryMap.get(demo.categorySlug);

    const payload = {
      name: demo.name,
      slug: demo.slug,
      sku: demo.sku,
      shortDescription: demo.shortDescription,
      fullDescription: `${demo.shortDescription}\n\nThis is a temporary demo product for preview purposes. Replace name, images, pricing, and details from the admin panel when your final catalog is ready.`,
      price: demo.price,
      salePrice: "salePrice" in demo ? demo.salePrice : undefined,
      compareAtPrice: "salePrice" in demo ? demo.price : undefined,
      images: [
        {
          mediaId: imageData.url,
          alt: imageData.alt,
          order: 0,
        },
      ],
      category: categoryId,
      tags: ["demo", "temporary"],
      stockQuantity: demo.stockQuantity,
      stockStatus: "in_stock" as const,
      featured: demo.featured,
      active: true,
      isDemo: true,
      careLevel: "careLevel" in demo ? demo.careLevel : "",
      lightRequirements:
        "lightRequirements" in demo ? demo.lightRequirements : "",
      plantSize: "plantSize" in demo ? demo.plantSize : "",
      seoTitle: `${demo.name} | Plant & Style by Anne`,
      seoDescription: demo.shortDescription,
    };

    const existing = await Product.findOne({ slug: demo.slug });
    if (existing) {
      if (mode === "refresh" || existing.isDemo || !existing.images?.length) {
        await Product.updateOne({ slug: demo.slug }, { $set: payload });
        productsUpdated++;
      }
    } else {
      await Product.create(payload);
      productsUpdated++;
    }
  }
  results.products = `${productsUpdated} upserted`;

  // Homepage CMS sections with images
  const homeSections = buildHomepageSections();
  const existingHome = await Page.findOne({ slug: "home" });
  if (existingHome) {
    await Page.updateOne(
      { slug: "home" },
      {
        $set: {
          sections: homeSections,
          seoTitle: "Plant & Style by Anne | Plants & Interior Design",
          seoDescription:
            "Discover beautifully curated plants and styling services that bring nature into your home with elegance.",
        },
      }
    );
    results.homepage = "updated";
  } else {
    await Page.create({
      slug: "home",
      title: "Home",
      seoTitle: "Plant & Style by Anne | Plants & Interior Design",
      seoDescription:
        "Discover beautifully curated plants and styling services that bring nature into your home with elegance.",
      sections: homeSections,
    });
    results.homepage = "created";
  }

  // About page sections with images
  const aboutSections = buildAboutSections();
  const existingAbout = await Page.findOne({ slug: "about" });
  if (existingAbout) {
    await Page.updateOne(
      { slug: "about" },
      {
        $set: {
          title: "About",
          seoTitle: "About | Plant & Style by Anne",
          sections: aboutSections,
        },
      }
    );
    results.aboutPage = "updated";
  } else {
    await Page.create({
      slug: "about",
      title: "About",
      seoTitle: "About | Plant & Style by Anne",
      sections: aboutSections,
    });
    results.aboutPage = "created";
  }

  // Services with images
  let servicesUpdated = 0;
  for (const svc of DEMO_SERVICES) {
    const imageData = TEMPORARY_IMAGES.services[svc.imageKey];
    const payload = {
      title: svc.title,
      description: svc.description,
      image: imageData.url,
      icon: svc.icon,
      ctaText: svc.ctaText,
      ctaUrl: svc.ctaUrl,
      displayOrder: svc.displayOrder,
      active: true,
    };

    const existing = await Service.findOne({ title: svc.title });
    if (existing) {
      if (mode === "refresh") {
        await Service.updateOne({ title: svc.title }, { $set: payload });
        servicesUpdated++;
      } else if (!existing.image) {
        await Service.updateOne({ title: svc.title }, { $set: payload });
        servicesUpdated++;
      }
    } else {
      await Service.create(payload);
      servicesUpdated++;
    }
  }
  results.services = `${servicesUpdated} upserted`;

  // Site settings — refresh logo on demo seed
  const settings = await SiteSettings.findOne();
  if (settings) {
    await SiteSettings.updateOne(
      { _id: settings._id },
      { $set: { logo: TEMPORARY_IMAGES.logo.url } }
    );
    results.settings = "logo updated";
  } else {
    await SiteSettings.create({
      logo: TEMPORARY_IMAGES.logo.url,
    });
    results.settings = "created with logo";
  }

  return results;
}
