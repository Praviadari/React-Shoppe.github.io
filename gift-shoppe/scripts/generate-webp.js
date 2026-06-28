const fs = require('fs');
const path = require('path');

const IMAGE_DIRS = [
  path.join(__dirname, '../public/img/Products'),
  path.join(__dirname, '../public/img/Items'),
];

const QUALITY = 82;

function collectJpegFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJpegFiles(fullPath, files);
    } else if (/\.jpe?g$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

async function generateWebp(sharp, inputPath) {
  const outputPath = inputPath.replace(/\.jpe?g$/i, '.webp');
  await sharp(inputPath)
    .webp({ quality: QUALITY })
    .toFile(outputPath);
  return outputPath;
}

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.warn('[generate-webp] sharp is not installed — skipping WebP generation.');
    process.exit(0);
  }

  const jpegFiles = IMAGE_DIRS.flatMap((dir) => collectJpegFiles(dir));
  if (jpegFiles.length === 0) {
    console.warn('[generate-webp] No JPEG product images found.');
    process.exit(0);
  }

  let created = 0;
  let skipped = 0;

  for (const inputPath of jpegFiles) {
    const outputPath = inputPath.replace(/\.jpe?g$/i, '.webp');
    const inputStat = fs.statSync(inputPath);
    if (fs.existsSync(outputPath)) {
      const outputStat = fs.statSync(outputPath);
      if (outputStat.mtimeMs >= inputStat.mtimeMs) {
        skipped += 1;
        continue;
      }
    }

    await generateWebp(sharp, inputPath);
    created += 1;
  }

  console.log(`[generate-webp] ${created} created, ${skipped} up to date (${jpegFiles.length} JPEG sources)`);
}

main().catch((error) => {
  console.error('[generate-webp] Failed:', error);
  process.exit(1);
});
