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
    alt: "Modern living room decorated with indoor plants",
  },
  brandStory: {
    url: `${DEMO}/brand-story.jpg`,
    alt: "Bright minimalist interior with curated indoor plants",
  },
  plantStyling: {
    url: `${DEMO}/plant-styling.jpg`,
    alt: "Plants styled on shelves as part of room design",
  },
  education: {
    url: `${DEMO}/education.jpg`,
    alt: "Close-up of hands caring for an indoor plant",
  },
  cta: {
    url: `${DEMO}/cta.jpg`,
    alt: "Elegant home with natural light and plants",
  },
  aboutIntro: {
    url: `${DEMO}/about-1.jpg`,
    alt: "Lush indoor plant collection in a styled living space",
  },
  aboutPhilosophy: {
    url: `${DEMO}/about-2.jpg`,
    alt: "Statement plant in a minimalist interior",
  },
  aboutGallery: {
    url: `${DEMO}/about-3.jpg`,
    alt: "Dining space styled with natural greenery",
  },
  logo: {
    url: "/logo.svg",
    alt: "Plant & Style by Anne logo",
  },
  categories: {
    "indoor-plants": {
      url: `${DEMO}/category-indoor.jpg`,
      alt: "Indoor plants in a bright modern home",
    },
    "beginner-friendly-plants": {
      url: `${DEMO}/category-beginner.jpg`,
      alt: "Easy-care indoor plants for new plant owners",
    },
    "statement-plants": {
      url: `${DEMO}/category-statement.jpg`,
      alt: "Large statement plant in an elegant living room",
    },
    "planters-pots": {
      url: `${DEMO}/category-planters.jpg`,
      alt: "Minimalist ceramic planters and pots",
    },
    "plant-care": {
      url: `${DEMO}/category-care.jpg`,
      alt: "Plant care tools and supplies",
    },
    "home-plant-decor": {
      url: `${DEMO}/category-decor.jpg`,
      alt: "Home decor styled with plants and natural elements",
    },
  },
  products: {
    "monstera-deliciosa": {
      url: `${DEMO}/product-1.jpg`,
      alt: "Monstera deliciosa indoor plant",
    },
    "snake-plant": {
      url: `${DEMO}/product-2.jpg`,
      alt: "Snake plant in a modern pot",
    },
    "golden-pothos": {
      url: `${DEMO}/product-3.jpg`,
      alt: "Golden pothos trailing plant",
    },
    "fiddle-leaf-fig": {
      url: `${DEMO}/product-4.jpg`,
      alt: "Fiddle leaf fig in a styled interior",
    },
    "zz-plant": {
      url: `${DEMO}/product-5.jpg`,
      alt: "ZZ plant with glossy green leaves",
    },
    "peace-lily": {
      url: `${DEMO}/product-6.jpg`,
      alt: "Peace lily with white blooms",
    },
    "rubber-plant": {
      url: `${DEMO}/product-7.jpg`,
      alt: "Rubber plant with deep green foliage",
    },
    "heartleaf-philodendron": {
      url: `${DEMO}/product-8.jpg`,
      alt: "Heartleaf philodendron in a hanging planter",
    },
    "minimalist-ceramic-planter": {
      url: `${DEMO}/product-9.jpg`,
      alt: "Minimalist white ceramic planter",
    },
    "terracotta-planter-set": {
      url: `${DEMO}/product-10.jpg`,
      alt: "Terracotta planter set for indoor plants",
    },
  },
  services: {
    styling: {
      url: `${DEMO}/service-1.jpg`,
      alt: "Plant styling consultation in a modern home",
    },
    design: {
      url: `${DEMO}/service-2.jpg`,
      alt: "Interior design with integrated plants",
    },
    care: {
      url: `${DEMO}/service-3.jpg`,
      alt: "Plant care and maintenance guidance",
    },
  },
} as const;

export const DEMO_CATEGORIES = [
  {
    name: "Indoor Plants",
    slug: "indoor-plants",
    description: "Beautiful plants curated for indoor living spaces",
    displayOrder: 1,
  },
  {
    name: "Beginner-Friendly Plants",
    slug: "beginner-friendly-plants",
    description: "Easy-care plants perfect for new plant collectors",
    displayOrder: 2,
  },
  {
    name: "Statement Plants",
    slug: "statement-plants",
    description: "Bold focal plants that elevate any room",
    displayOrder: 3,
  },
  {
    name: "Pots & Planters",
    slug: "planters-pots",
    description: "Stylish containers to complement your plants",
    displayOrder: 4,
  },
  {
    name: "Plant Care",
    slug: "plant-care",
    description: "Tools and essentials for healthy plants",
    displayOrder: 5,
  },
  {
    name: "Home & Plant Decor",
    slug: "home-plant-decor",
    description: "Decor and accessories for plant-forward interiors",
    displayOrder: 6,
  },
] as const;

export const DEMO_PRODUCTS = [
  {
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    sku: "DEMO-MON-001",
    shortDescription: "Demo listing — iconic split-leaf plant for statement styling.",
    categorySlug: "indoor-plants",
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
    sku: "DEMO-SNP-002",
    shortDescription: "Demo listing — architectural, low-maintenance greenery.",
    categorySlug: "beginner-friendly-plants",
    price: 42,
    stockQuantity: 20,
    featured: true,
    imageKey: "snake-plant" as const,
    careLevel: "Easy",
    lightRequirements: "Low to bright indirect light",
    plantSize: "Medium",
  },
  {
    name: "Golden Pothos",
    slug: "golden-pothos",
    sku: "DEMO-POT-003",
    shortDescription: "Demo listing — trailing vine ideal for shelves and hangers.",
    categorySlug: "beginner-friendly-plants",
    price: 28,
    stockQuantity: 25,
    featured: true,
    imageKey: "golden-pothos" as const,
    careLevel: "Easy",
    lightRequirements: "Medium indirect light",
    plantSize: "Small",
  },
  {
    name: "Fiddle Leaf Fig",
    slug: "fiddle-leaf-fig",
    sku: "DEMO-FLF-004",
    shortDescription: "Demo listing — tall sculptural plant for modern interiors.",
    categorySlug: "statement-plants",
    price: 95,
    salePrice: 79,
    stockQuantity: 8,
    featured: true,
    imageKey: "fiddle-leaf-fig" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Large",
  },
  {
    name: "ZZ Plant",
    slug: "zz-plant",
    sku: "DEMO-ZZP-005",
    shortDescription: "Demo listing — glossy leaves, forgiving and elegant.",
    categorySlug: "indoor-plants",
    price: 54,
    stockQuantity: 15,
    featured: false,
    imageKey: "zz-plant" as const,
    careLevel: "Easy",
    lightRequirements: "Low to medium light",
    plantSize: "Medium",
  },
  {
    name: "Peace Lily",
    slug: "peace-lily",
    sku: "DEMO-PEL-006",
    shortDescription: "Demo listing — graceful blooms and lush foliage.",
    categorySlug: "indoor-plants",
    price: 38,
    stockQuantity: 18,
    featured: false,
    imageKey: "peace-lily" as const,
    careLevel: "Easy",
    lightRequirements: "Low to medium indirect light",
    plantSize: "Medium",
  },
  {
    name: "Rubber Plant",
    slug: "rubber-plant",
    sku: "DEMO-RBP-007",
    shortDescription: "Demo listing — deep green leaves with a refined presence.",
    categorySlug: "statement-plants",
    price: 62,
    stockQuantity: 10,
    featured: false,
    imageKey: "rubber-plant" as const,
    careLevel: "Moderate",
    lightRequirements: "Bright indirect light",
    plantSize: "Medium",
  },
  {
    name: "Heartleaf Philodendron",
    slug: "heartleaf-philodendron",
    sku: "DEMO-PHI-008",
    shortDescription: "Demo listing — classic trailing plant for any room.",
    categorySlug: "beginner-friendly-plants",
    price: 32,
    stockQuantity: 22,
    featured: false,
    imageKey: "heartleaf-philodendron" as const,
    careLevel: "Easy",
    lightRequirements: "Medium indirect light",
    plantSize: "Small",
  },
  {
    name: "Minimalist Ceramic Planter",
    slug: "minimalist-ceramic-planter",
    sku: "DEMO-PLN-009",
    shortDescription: "Demo listing — clean-lined ceramic pot for modern styling.",
    categorySlug: "planters-pots",
    price: 45,
    stockQuantity: 30,
    featured: true,
    imageKey: "minimalist-ceramic-planter" as const,
  },
  {
    name: "Terracotta Planter Set",
    slug: "terracotta-planter-set",
    sku: "DEMO-PLN-010",
    shortDescription: "Demo listing — warm terracotta pots for grouped displays.",
    categorySlug: "planters-pots",
    price: 58,
    stockQuantity: 16,
    featured: false,
    imageKey: "terracotta-planter-set" as const,
  },
] as const;

export function buildHomepageSections() {
  const img = TEMPORARY_IMAGES;
  return [
    {
      key: "hero",
      type: "hero",
      title: "Incorporating plants and interior design at home",
      subtitle:
        "Beautifully curated plants and styling guidance to help you bring nature into your home with confidence and elegance.",
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
      title: "Plant & Style by Anne",
      content:
        "Plant & Style by Anne has been in business for over 6 years. Anne has incorporated her love for interior design with her love of plants — helping you create spaces that feel alive, balanced, and uniquely yours.",
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
      subtitle: "Find the perfect plants and accessories for every room",
      visible: true,
      order: 3,
    },
    {
      key: "featured",
      type: "featured_products",
      title: "Featured Plants",
      subtitle: "Hand-picked selections for your home",
      visible: true,
      order: 4,
    },
    {
      key: "plant_styling",
      type: "image_content",
      title: "Plants as part of your design",
      subtitle: "Interior styling",
      content:
        "We believe plants belong in the story of your home — on shelves, in corners, and woven into the rooms you live in every day.",
      image: img.plantStyling.url,
      data: { imageAlt: img.plantStyling.alt, imagePosition: "right" },
      ctaText: "Explore Our Services",
      ctaUrl: "/services",
      visible: true,
      order: 5,
    },
    {
      key: "education",
      type: "image_content",
      title: "New to plants?",
      subtitle: "Start with confidence",
      content:
        "Whether you're choosing your first plant or refreshing a room, we're here to help you select, style, and care for greenery that fits your space.",
      image: img.education.url,
      data: { imageAlt: img.education.alt, imagePosition: "left" },
      ctaText: "Shop Beginner-Friendly Plants",
      ctaUrl: "/shop?category=beginner-friendly-plants",
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
      title: "Ready to transform your space?",
      content: "Get in touch for a personalized plant styling consultation.",
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
        "Plant care tips and styling ideas — delivered gently to your inbox.",
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
      title: "About Plant & Style by Anne",
      content:
        "Plant & Style by Anne has been in the business for over 6 years. Anne has incorporated her love for interior design with her love of plants — creating harmonious living spaces where nature and design come together beautifully.",
      image: img.aboutIntro.url,
      data: { imageAlt: img.aboutIntro.alt },
      visible: true,
      order: 1,
    },
    {
      key: "philosophy",
      type: "content",
      title: "Plants + Interior Design",
      subtitle: "Our philosophy",
      content:
        "We see plants not as afterthoughts, but as essential elements of home design — bringing texture, calm, and life to the spaces you love most.",
      image: img.aboutPhilosophy.url,
      data: { imageAlt: img.aboutPhilosophy.alt },
      visible: true,
      order: 2,
    },
    {
      key: "experience",
      type: "content",
      title: "Six years of styling homes",
      content:
        "From thoughtful plant selection to room-by-room styling, Anne helps clients bring greenery into their homes in ways that feel natural, beautiful, and uniquely theirs.",
      image: img.aboutGallery.url,
      data: { imageAlt: img.aboutGallery.alt },
      visible: true,
      order: 3,
    },
  ];
}

export const DEMO_SERVICES = [
  {
    title: "Plant Styling Consultation",
    description:
      "Personalized guidance to select and place plants that complement your interior.",
    imageKey: "styling" as const,
    icon: "Leaf",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 1,
  },
  {
    title: "Interior Plant Design",
    description:
      "Room-by-room styling that integrates plants into your home's design story.",
    imageKey: "design" as const,
    icon: "Home",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 2,
  },
  {
    title: "Plant Care Guidance",
    description:
      "Support for new and experienced plant owners — care plans tailored to your space.",
    imageKey: "care" as const,
    icon: "Heart",
    ctaText: "Learn More",
    ctaUrl: "/contact",
    displayOrder: 3,
  },
] as const;
