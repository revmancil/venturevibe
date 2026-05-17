/**
 * Recolor "Venture" wordmark from white to brand blue sampled from the logo icon.
 * Run: npx tsx scripts/recolor-logo-venture.ts
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";

const LOGO_PATH = path.join(process.cwd(), "public", "logo.png");
const SOURCE_PATH =
  process.env.LOGO_SOURCE_PATH || path.join(process.cwd(), "public", "logo-source.png");

const FALLBACK_BLUE = { r: 11, g: 58, b: 156 };

function isBackground(r: number, g: number, b: number, a: number) {
  if (a < 40) return true;
  return (r + g + b) / 3 < 35;
}

function isOrange(r: number, g: number, b: number) {
  return r > 150 && g > 70 && b < 160 && r > b + 20;
}

function isVentureInk(r: number, g: number, b: number, a: number) {
  if (isBackground(r, g, b, a) || isOrange(r, g, b)) return false;
  const lum = (r + g + b) / 3;
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return lum > 100 && chroma < 100;
}

function sampleBrandBlue(
  data: Buffer,
  width: number,
  height: number,
  channels: number
) {
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
  return blue;
}

function setBlue(
  data: Buffer,
  i: number,
  blue: { r: number; g: number; b: number }
) {
  data[i] = blue.r;
  data[i + 1] = blue.g;
  data[i + 2] = blue.b;
  if (data[i + 3] > 0) data[i + 3] = 255;
}

function recolorVenture(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  blue: { r: number; g: number; b: number }
) {
  const textTop = Math.floor(height * 0.6);
  const textBottom = height;
  const maxVentureX = Math.floor(width * 0.615);

  for (let y = textTop; y < textBottom; y++) {
    for (let x = 0; x < maxVentureX; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (isVentureInk(r, g, b, a)) {
        setBlue(data, i, blue);
      }
    }
  }

  // Second pass: catch bright neutral anti-alias on "e" (still white in source)
  for (let y = textTop; y < textBottom; y++) {
    for (let x = Math.floor(width * 0.4); x < maxVentureX; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (isBackground(r, g, b, a) || isOrange(r, g, b)) continue;

      const lum = (r + g + b) / 3;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const isBrightNeutral = lum > 155 && maxC - minC < 70;

      if (isBrightNeutral) {
        setBlue(data, i, blue);
      }
    }
  }

  const isClearlyBlue = (r: number, g: number, b: number) =>
    b > r + 12 && b > g - 5;

  // Orange pixels on the final "e" are anti-alias from "Vibe" — blue them if left of "V"
  const vibeLetterStartX = Math.floor(width * 0.612);
  for (let y = textTop; y < textBottom; y++) {
    for (let x = Math.floor(width * 0.42); x < vibeLetterStartX; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (isBackground(r, g, b, a) || isClearlyBlue(r, g, b)) continue;

      const isOrangeFringe = r > 100 && r > b && g < r + 40;
      if (isOrangeFringe) {
        setBlue(data, i, blue);
      }
    }
  }

  const isStrongVibeOrange = (r: number, g: number, b: number) =>
    r > 195 && g > 95 && b < 120 && r > b + 45;

  // Per-row fill for final "e" — extends to the true start of "Vibe" on each scanline
  // Final "e" tail: paint every non-background pixel blue (includes orange anti-alias)
  const eTailLeft = Math.floor(width * 0.465);
  const eTailRight = Math.floor(width * 0.604);
  const vibeVStartX = Math.floor(width * 0.598);
  for (let y = textTop; y < textBottom; y++) {
    for (let x = eTailLeft; x < eTailRight; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (isBackground(r, g, b, a)) continue;
      if (x >= vibeVStartX && isStrongVibeOrange(r, g, b)) continue;
      const lum = (r + g + b) / 3;
      if (lum > 70) {
        setBlue(data, i, blue);
      }
    }
  }
}

async function main() {
  const inputPath = fs.existsSync(SOURCE_PATH) ? SOURCE_PATH : LOGO_PATH;
  const img = sharp(inputPath);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const blue = sampleBrandBlue(data, width, height, channels);
  console.log("Using brand blue:", blue, "| source:", inputPath);

  recolorVenture(data, width, height, channels, blue);

  await sharp(data, { raw: { width, height, channels } }).png().toFile(LOGO_PATH);
  console.log("Wrote", LOGO_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
