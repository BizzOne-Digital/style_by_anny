/**
 * Updates MongoDB with local demo image paths.
 * Run: npm run refresh:demo
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const DEMO = "/images/demo";
const IMAGES = {
  hero: `${DEMO}/hero.jpg`,
  brandStory: `${DEMO}/brand-story.jpg`,
  plantStyling: `${DEMO}/plant-styling.jpg`,
  education: `${DEMO}/education.jpg`,
  cta: `${DEMO}/cta.jpg`,
  about1: `${DEMO}/about-1.jpg`,
  about2: `${DEMO}/about-2.jpg`,
  about3: `${DEMO}/about-3.jpg`,
  categories: {
    "indoor-plants": `${DEMO}/category-indoor.jpg`,
    "beginner-friendly-plants": `${DEMO}/category-beginner.jpg`,
    "statement-plants": `${DEMO}/category-statement.jpg`,
    "planters-pots": `${DEMO}/category-planters.jpg`,
    "plant-care": `${DEMO}/category-care.jpg`,
    "home-plant-decor": `${DEMO}/category-decor.jpg`,
  },
  products: {
    "monstera-deliciosa": `${DEMO}/product-1.jpg`,
    "snake-plant": `${DEMO}/product-2.jpg`,
    "golden-pothos": `${DEMO}/product-3.jpg`,
    "fiddle-leaf-fig": `${DEMO}/product-4.jpg`,
    "zz-plant": `${DEMO}/product-5.jpg`,
    "peace-lily": `${DEMO}/product-6.jpg`,
    "rubber-plant": `${DEMO}/product-7.jpg`,
    "heartleaf-philodendron": `${DEMO}/product-8.jpg`,
    "minimalist-ceramic-planter": `${DEMO}/product-9.jpg`,
    "terracotta-planter-set": `${DEMO}/product-10.jpg`,
  },
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in .env.local");
  process.exit(1);
}

await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "plant_style" });

const Category =
  mongoose.models.Category ||
  mongoose.model("Category", new mongoose.Schema({}, { strict: false }));
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
const Page =
  mongoose.models.Page ||
  mongoose.model("Page", new mongoose.Schema({}, { strict: false }));
const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", new mongoose.Schema({}, { strict: false }));

for (const [slug, image] of Object.entries(IMAGES.categories)) {
  await Category.updateOne({ slug }, { $set: { image } });
}

for (const [slug, image] of Object.entries(IMAGES.products)) {
  await Product.updateOne(
    { slug },
    {
      $set: {
        images: [{ mediaId: image, alt: slug, order: 0 }],
        active: true,
        isDemo: true,
      },
    }
  );
}

const home = await Page.findOne({ slug: "home" });
if (home) {
  const sections = home.sections || [];
  for (const s of sections) {
    if (s.key === "hero") s.image = IMAGES.hero;
    if (s.key === "brand_story") s.image = IMAGES.brandStory;
    if (s.key === "plant_styling") s.image = IMAGES.plantStyling;
    if (s.key === "education") s.image = IMAGES.education;
    if (s.key === "cta") s.image = IMAGES.cta;
  }
  await Page.updateOne({ slug: "home" }, { $set: { sections } });
}

const about = await Page.findOne({ slug: "about" });
if (about) {
  const sections = about.sections || [];
  for (const s of sections) {
    if (s.key === "intro") s.image = IMAGES.about1;
    if (s.key === "philosophy") s.image = IMAGES.about2;
    if (s.key === "experience") s.image = IMAGES.about3;
  }
  await Page.updateOne({ slug: "about" }, { $set: { sections } });
}

await SiteSettings.updateOne({}, { $set: { logo: "/logo.svg" } }, { upsert: true });

console.log("All images updated to local /images/demo/ paths.");
console.log("Refresh your browser with Ctrl+Shift+R");

await mongoose.disconnect();
