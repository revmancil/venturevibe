/**
 * One-off: recolor "Venture" wordmark from white to brand blue sampled from the logo icon.
 * Run: npx tsx scripts/recolor-logo-venture.ts
 */
import sharp from "sharp";
import path from "path";

const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");

// Fallback matches the circular arc / chart blue in the mark
const FALLBACK_BLUE = { r: 37, g: 99, b: 235 };

async function main() {
  const img = sharp(LOGO_PATH);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let blue = { ...FALLBACK_BLUE };
  let bestBlueScore = 0;
  const iconBottom = Math.floor(height * 0.62);
  for (let y = Math.floor(height * 0.2); y < iconBottom; y++) {
    for (let x = 0; x < Math.floor(width * 0.45); x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const score = b - Math.max(r, g);
      if (score > bestBlueScore && b > 100 && b < 250 && r < 120 && g < 200) {
        bestBlueScore = score;
        blue = { r, g, b };
      }
    }
  }

  console.log("Using brand blue:", blue);

  const textTop = Math.floor(height * 0.64);
  const ventureRight = Math.floor(width * 0.6);

  for (let y = textTop; y < height; y++) {
    for (let x = 0; x < ventureRight; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 80) continue;

      const lum = (r + g + b) / 3;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const isOrange = r > 180 && g > 90 && b < 140 && r > b + 30;
      const isWhiteOrLightGray =
        !isOrange && lum > 120 && chroma < 75 && r > 95 && g > 95 && b > 95;

      if (isWhiteOrLightGray) {
        data[i] = blue.r;
        data[i + 1] = blue.g;
        data[i + 2] = blue.b;
      }
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(LOGO_PATH);
  console.log("Updated", LOGO_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
