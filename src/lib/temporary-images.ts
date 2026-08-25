/**
 * Temporary demo imagery — local files in /public/images/demo/
 * Populated into CMS via seed. Replace from admin when final assets are ready.
 */

const DEMO = "/images/demo";

export interface TemporaryImage {
  url: string;
  alt: string;
}

export const TEMPORARY_IMAGES = {
  hero: {
    url: `${DEMO}/hero.jpg`,
    alt: "Burgundy hoya flowers in bloom on a white background",
  },
  brandStory: {
    url: `${DEMO}/brand-story.jpg`,
    alt: "Pink hoya flower cluster",
  },
  plantStyling: {
    url: `${DEMO}/plant-styling.jpg`,
    alt: "Golden yellow hoya flowers on a climbing plant",
  },
  education: {
    url: `${DEMO}/education.jpg`,
    alt: "Cream white hoya flowers with green leaves",
  },
  cta: {
    url: `${DEMO}/cta.jpg`,
    alt: "Beautiful hoya plant in bloom",
  },
  aboutIntro: {
    url: `${DEMO}/about-1.jpg`,
    alt: "Pink hoya flower cluster by Plant Style by Anne",
  },
  aboutPhilosophy: {
    url: `${DEMO}/about-2.jpg`,
    alt: "Golden hoya flowers on a trellis",
  },
  aboutGallery: {
    url: `${DEMO}/about-3.jpg`,
    alt: "White hoya flowers in bloom",
  },
  logo: {
    url: "/logo.svg",
    alt: "Plant Style by Anne logo",
  },
  categories: {
    hoyas: {
      url: `${DEMO}/category-indoor.jpg`,
      alt: "Pink hoya flowers — shop the Hoyas collection",
    },
    others: {
      url: `${DEMO}/category-beginner.jpg`,
      alt: "Other indoor plants",
    },
  },
  products: {
    "hoya-carnosa": {
      url: `${DEMO}/product-1.jpg`,
      alt: "Hoya Carnosa with classic waxy leaves",
    },
    "hoya-kerrii": {
      url: `${DEMO}/product-2.jpg`,
      alt: "Hoya Kerrii heart-shaped leaves",
    },
    "hoya-australis": {
      url: `${DEMO}/product-3.jpg`,
      alt: "Hoya Australis trailing vine",
    },
    "hoya-linearis": {
      url: `${DEMO}/product-4.jpg`,
      alt: "Hoya Linearis with thin cascading foliage",
    },
    "hoya-obovata": {
      url: `${DEMO}/product-5.jpg`,
      alt: "Hoya Obovata with round leaves",
    },
    "hoya-pubicalyx": {
      url: `${DEMO}/product-6.jpg`,
      alt: "Hoya Pubicalyx with speckled leaves",
    },
    "hoya-wayetii": {
      url: `${DEMO}/product-7.jpg`,
      alt: "Hoya Wayetii with narrow pointed leaves",
    },
    "hoya-compacta": {
      url: `${DEMO}/product-8.jpg`,
      alt: "Hoya Compacta Hindu rope plant",
    },
    "monstera-deliciosa": {
      url: `${DEMO}/product-9.jpg`,
      alt: "Monstera deliciosa plant",
    },
    "snake-plant": {
      url: `${DEMO}/product-10.jpg`,
      alt: "Snake plant",
    },
  },
  services: {
    styling: {
      url: `${DEMO}/service-1.jpg`,
      alt: "Hoya flowers in bloom",
    },
    design: {
      url: `${DEMO}/service-2.jpg`,
      alt: "Hoya plant collection",
    },
    care: {
      url: `${DEMO}/service-3.jpg`,
      alt: "Hoya plant care",
    },
  },
} as const;

export const DEMO_CATEGORIES = [
  {
    name: "Hoyas",
    slug: "hoyas",
    description:
      "Waxy-leaved hoyas — from classic Carnosa to rare trailing varieties",
    displayOrder: 1,
  },
  {
    name: "Others",
    slug: "others",
    description: "Other beautiful indoor plants to complement your collection",
    displayOrder: 2,
  },
] as const;

export const DEMO_PRODUCTS = [
  {
    name: "Hoya Carnosa",
    slug: "hoya-carnosa",
    sku: "HOYA-CAR-001",
    shortDescription:
      "Classic hoya with thick, waxy leaves — a timeless favourite for any collection.",
    categorySlug: "hoyas",
    price: 38,
    stockQuantity: 15,
    featured: true,
    imageKey: "hoya-carnosa" as const,
    careLevel: "Easy",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Kerrii",
    slug: "hoya-kerrii",
    sku: "HOYA-KER-002",
    shortDescription:
      "Sweetheart hoya with charming heart-shaped leaves — perfect as a gift plant.",
    categorySlug: "hoyas",
    price: 32,
    stockQuantity: 20,
    featured: true,
    imageKey: "hoya-kerrii" as const,
    careLevel: "Easy",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Australis",
    slug: "hoya-australis",
    sku: "HOYA-AUS-003",
    shortDescription:
      "Fast-growing trailing hoya with round, glossy green leaves.",
    categorySlug: "hoyas",
    price: 42,
    stockQuantity: 12,
    featured: true,
    imageKey: "hoya-australis" as const,
    careLevel: "Easy",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Linearis",
    slug: "hoya-linearis",
    sku: "HOYA-LIN-004",
    shortDescription:
      "Delicate cascading hoya with soft, needle-like foliage.",
    categorySlug: "hoyas",
    price: 48,
    salePrice: 42,
    stockQuantity: 8,
    featured: true,
    imageKey: "hoya-linearis" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Obovata",
    slug: "hoya-obovata",
    sku: "HOYA-OBO-005",
    shortDescription:
      "Stunning hoya with large, round leaves often splashed with silver.",
    categorySlug: "hoyas",
    price: 55,
    stockQuantity: 10,
    featured: false,
    imageKey: "hoya-obovata" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Medium",
  },
  {
    name: "Hoya Pubicalyx",
    slug: "hoya-pubicalyx",
    sku: "HOYA-PUB-006",
    shortDescription:
      "Dark green leaves with silver flecks — a striking addition to any shelf.",
    categorySlug: "hoyas",
    price: 45,
    stockQuantity: 14,
    featured: false,
    imageKey: "hoya-pubicalyx" as const,
    careLevel: "Easy",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Wayetii",
    slug: "hoya-wayetii",
    sku: "HOYA-WAY-007",
    shortDescription:
      "Narrow, pointed leaves with a bronze edge — compact and elegant.",
    categorySlug: "hoyas",
    price: 40,
    stockQuantity: 11,
    featured: false,
    imageKey: "hoya-wayetii" as const,
    careLevel: "Easy",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Hoya Compacta",
    slug: "hoya-compacta",
    sku: "HOYA-COM-008",
    shortDescription:
      "Hindu rope hoya with tightly curled, rope-like foliage.",
    categorySlug: "hoyas",
    price: 52,
    stockQuantity: 9,
    featured: false,
    imageKey: "hoya-compacta" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Small",
  },
  {
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    sku: "OTH-MON-009",
    shortDescription:
      "Iconic split-leaf plant — a bold companion to your hoya collection.",
    categorySlug: "others",
    price: 68,
    stockQuantity: 12,
    featured: true,
    imageKey: "monstera-deliciosa" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Medium",
  },
  {
    name: "Snake Plant",
    slug: "snake-plant",
    sku: "OTH-SNP-010",
    shortDescription:
      "Architectural, low-maintenance greenery for any light level.",
    categorySlug: "others",
    price: 42,
    stockQuantity: 18,
    featured: false,
    imageKey: "snake-plant" as const,
    careLevel: "Easy",
    lightRequirements: "Low to bright indirect light",
    plantSize: "Medium",
  },
] as const;

export function buildHomepageSections() {
  const img = TEMPORARY_IMAGES;
  return [
    {
      key: "hero",
      type: "hero",
      title: "Beautiful hoyas and plants for your home",
      subtitle:
        "Hand-selected hoyas and curated plants, grown with care and shipped ready to thrive in your space.",
      image: img.hero.url,
      data: { imageAlt: img.hero.alt },
      ctaText: "Shop Plants",
      ctaUrl: "/shop",
      visible: true,
      order: 1,
    },
    {
      key: "brand_story",
      type: "brand_story",
      title: "Plant Style by Anne",
      content:
        "Plant Style by Anne has been sharing a love of plants for over 6 years. Anne specializes in hoyas and carefully selected indoor plants — helping you build a collection you will love and care for with confidence.",
      image: img.brandStory.url,
      data: { imageAlt: img.brandStory.alt },
      ctaText: "Learn more about Anne",
      ctaUrl: "/about",
      visible: true,
      order: 2,
    },
    {
      key: "categories",
      type: "categories",
      title: "Shop by Category",
      subtitle: "Hoyas & more",
      visible: true,
      order: 3,
    },
    {
      key: "featured",
      type: "featured_products",
      title: "Featured Hoyas",
      subtitle: "Hand-picked favourites from our collection",
      visible: true,
      order: 4,
    },
    {
      key: "plant_styling",
      type: "image_content",
      title: "Why we love hoyas",
      subtitle: "Plant passion",
      content:
        "Hoyas are treasured for their waxy leaves, sweet fragrance, and rewarding growth. Whether you are starting your first hoya or adding a rare variety, we are here to help you succeed.",
      image: img.plantStyling.url,
      data: { imageAlt: img.plantStyling.alt, imagePosition: "right" },
      ctaText: "Shop Hoyas",
      ctaUrl: "/shop?category=hoyas",
      visible: true,
      order: 5,
    },
    {
      key: "education",
      type: "image_content",
      title: "New to hoyas?",
      subtitle: "Start with confidence",
      content:
        "Hoyas are wonderfully forgiving once you understand their needs — bright light, well-draining soil, and a light hand with watering. We are happy to guide you every step of the way.",
      image: img.education.url,
      data: { imageAlt: img.education.alt, imagePosition: "left" },
      ctaText: "Shop Hoyas",
      ctaUrl: "/shop?category=hoyas",
      visible: true,
      order: 6,
    },
    {
      key: "testimonials",
      type: "testimonials",
      title: "What Our Clients Say",
      visible: true,
      order: 7,
    },
    {
      key: "faq",
      type: "faq",
      title: "Common Questions",
      visible: true,
      order: 8,
    },
    {
      key: "cta",
      type: "cta_banner",
      title: "Ready to grow your collection?",
      content: "Browse our hoyas or get in touch for plant care advice.",
      image: img.cta.url,
      data: { imageAlt: img.cta.alt },
      ctaText: "Contact Us",
      ctaUrl: "/contact",
      visible: true,
      order: 9,
    },
    {
      key: "newsletter",
      type: "newsletter",
      title: "Stay inspired",
      subtitle:
        "Hoya care tips and new arrivals — delivered gently to your inbox.",
      visible: true,
      order: 10,
    },
  ];
}

export function buildAboutSections() {
  const img = TEMPORARY_IMAGES;
  return [
    {
      key: "intro",
      type: "content",
      title: "About Plant Style by Anne",
      content:
        "Plant Style by Anne has been in the plant business for over 6 years. Anne's passion for hoyas and indoor plants drives everything we do — from careful selection to thoughtful care guidance for every customer.",
      image: img.aboutIntro.url,
      data: { imageAlt: img.aboutIntro.alt },
      visible: true,
      order: 1,
    },
    {
      key: "philosophy",
      type: "content",
      title: "Our love for hoyas",
      subtitle: "Our philosophy",
      content:
        "Hoyas hold a special place in our collection. Their waxy leaves, fragrant blooms, and diverse forms make them endlessly rewarding for collectors at every level.",
      image: img.aboutPhilosophy.url,
      data: { imageAlt: img.aboutPhilosophy.alt },
      visible: true,
      order: 2,
    },
    {
      key: "experience",
      type: "content",
      title: "Six years of plant passion",
      content:
        "From rare hoya varieties to beloved classics, Anne helps plant lovers find the right additions to their collection — with honest advice and plants shipped with care.",
      image: img.aboutGallery.url,
      data: { imageAlt: img.aboutGallery.alt },
      visible: true,
      order: 3,
    },
  ];
}

export const DEMO_SERVICES = [
  {
    title: "Hoya Care Consultation",
    description:
      "Personalized guidance on watering, light, and care for your hoya collection.",
    imageKey: "styling" as const,
    icon: "Leaf",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 1,
  },
  {
    title: "Plant Selection Guidance",
    description:
      "Help choosing the right hoyas and plants for your home and experience level.",
    imageKey: "design" as const,
    icon: "Home",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 2,
  },
  {
    title: "Plant Care Support",
    description:
      "Ongoing support for new and experienced plant owners — tailored to your plants.",
    imageKey: "care" as const,
    icon: "Heart",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 3,
  },
] as const;
