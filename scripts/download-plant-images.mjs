/**
 * Downloads unique plant-only images. Preserves Anne's hoya photos (hero, brand-story, etc.).
 * Run: node scripts/download-plant-images.mjs
 */
import {
  createWriteStream,
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
} from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/images/demo");

const pex = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;
const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=85`;

mkdirSync(OUT, { recursive: true });

const SOURCES = [
  unsplash("1463936575829-25148e1db1b8"),
  unsplash("1416879595882-3373a0480b5b"),
  unsplash("1614594975525-e45190c55d0b"),
  unsplash("1509042239860-f550ce710b93"),
  pex(1084199),
  pex(931162),
  pex(1454843),
  pex(3828853),
  ...Array.from({ length: 14 }, (_, i) => pex(6208086 + i)),
];

const TARGETS = [
  "cta.jpg",
  "about-1.jpg",
  "about-2.jpg",
  "about-3.jpg",
  "cat-philodendrons.jpg",
  "cat-pothos.jpg",
  "cat-tropical.jpg",
  "cat-succulents.jpg",
  "cat-beginner.jpg",
  "prod-hoya-carnosa.jpg",
  "prod-hoya-kerrii.jpg",
  "prod-hoya-australis.jpg",
  "prod-hoya-linearis.jpg",
  "prod-hoya-obovata.jpg",
  "prod-hoya-pubicalyx.jpg",
  "prod-hoya-compacta.jpg",
  "prod-monstera.jpg",
  "prod-golden-pothos.jpg",
  "prod-philodendron.jpg",
  "prod-snake-plant.jpg",
  "prod-zz-plant.jpg",
  "prod-peace-lily.jpg",
  "service-consultation.jpg",
  "service-selection.jpg",
  "service-care.jpg",
];

async function download(name, url) {
  const dest = join(OUT, name);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8_000) throw new Error("too small");
  await pipeline(Readable.from(buf), createWriteStream(dest));
}

for (let i = 0; i < TARGETS.length; i++) {
  try {
    await download(TARGETS[i], SOURCES[i]);
    console.log(`✓ ${TARGETS[i]}`);
  } catch (e) {
    console.error(`✗ ${TARGETS[i]}: ${e.message}`);
  }
}

if (existsSync(join(OUT, "brand-story.jpg"))) {
  copyFileSync(join(OUT, "brand-story.jpg"), join(OUT, "cat-hoyas.jpg"));
  console.log("✓ cat-hoyas.jpg (Anne's hoya photo)");
}

const OBSOLETE = [
  "category-care.jpg",
  "category-decor.jpg",
  "category-planters.jpg",
  "category-statement.jpg",
  "category-indoor.jpg",
  "category-beginner.jpg",
  "product-1.jpg",
  "product-2.jpg",
  "product-3.jpg",
  "product-4.jpg",
  "product-5.jpg",
  "product-6.jpg",
  "product-7.jpg",
  "product-8.jpg",
  "product-9.jpg",
  "product-10.jpg",
  "service-1.jpg",
  "service-2.jpg",
  "service-3.jpg",
];

for (const f of OBSOLETE) {
  const p = join(OUT, f);
  if (existsSync(p)) {
    unlinkSync(p);
    console.log(`removed ${f}`);
  }
}

console.log("Finished.");
