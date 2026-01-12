import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const subjectIds = [
  "art-photography",
  "business-economics",
  "careers-programme",
  "computing-ict",
  "cpshe",
  "design-technology",
  "drama",
  "english",
  "film-studies",
  "geography",
  "gov-politics-citizenship",
  "history",
  "humanities",
  "maths",
  "media-studies",
  "mfl",
  "music",
  "pe",
  "psychology",
  "rs",
  "science",
  "sen",
  "sociology-health-social-care",
];

const root = process.cwd();
const imagesDir = path.join(root, "public", "images");

async function run() {
  for (const id of subjectIds) {
    const inputPath = path.join(imagesDir, `${id}.jpg`);
    const outputPath = path.join(imagesDir, `${id}.webp`);

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  Skipping ${id} – ${path.relative(root, inputPath)} not found`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize(1600, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      console.log(`✅ Created ${path.relative(root, outputPath)}`);
    } catch (err) {
      console.error(`❌ Failed for ${id}: ${err.message}`);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
