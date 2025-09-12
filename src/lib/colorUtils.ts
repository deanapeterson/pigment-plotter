import chroma from "chroma-js";

export const isValidHex = (hex: string): boolean => {
  return chroma.valid(hex);
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const rgb = chroma(hex).rgb();
  return { r: rgb[0], g: rgb[1], b: rgb[2] };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return chroma(r, g, b).hex();
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const hsl = chroma(hex).hsl();
  // chroma.js hsl returns [h (0-360), s (0-1), l (0-1)]
  // Need to handle NaN for hue for achromatic colors and convert s,l to 0-100
  return {
    h: isNaN(hsl[0]) ? 0 : Math.round(hsl[0]),
    s: Math.round(hsl[1] * 100),
    l: Math.round(hsl[2] * 100),
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  // chroma.js hsl expects s and l as 0-1
  return chroma.hsl(h, s / 100, l / 100).hex();
};

export const getContrastColor = (hex: string): string => {
  // Using luminance for contrast
  return chroma(hex).luminance() > 0.5 ? "#000000" : "#ffffff";
};

export const generateTints = (baseHex: string, count: number): string[] => {
  // Generate a scale from base to white, then get colors. Using 'lch' mode for perceptually uniform steps.
  // We request count + 2 colors to include the base and white, then slice to get 'count' tints excluding the base.
  const tints = chroma.scale([baseHex, '#ffffff']).mode('lch').colors(count + 2);
  return tints.slice(1, count + 1).filter(hex => hex.toLowerCase() !== '#ffffff');
};

export const generateShades = (baseHex: string, count: number): string[] => {
  // Generate a scale from base to black, then get colors. Using 'lch' mode for perceptually uniform steps.
  // We request count + 2 colors to include the base and black, then slice to get 'count' shades excluding the base.
  const shades = chroma.scale([baseHex, '#000000']).mode('lch').colors(count + 2);
  return shades.slice(1, count + 1).filter(hex => hex.toLowerCase() !== '#000000');
};

export const generateAnalogous = (baseHex: string): string[] => {
  // chroma.js analogous returns 3 colors by default, we need 5.
  // Manually adjust hue for 5 colors (30 degrees apart)
  const baseColor = chroma(baseHex);
  const h = baseColor.hsl()[0];
  const s = baseColor.hsl()[1];
  const l = baseColor.hsl()[2];

  const analogous: string[] = [];
  for (let i = -2; i <= 2; i++) {
    const hue = (h + (i * 30) + 360) % 360;
    analogous.push(chroma.hsl(hue, s, l).hex());
  }
  return analogous;
};

export const generateComplementary = (baseHex: string): string[] => {
  // chroma.js complementary returns 2 colors
  return chroma(baseHex).complementary().hex();
};

export const generateTriadic = (baseHex: string): string[] => {
  // chroma.js triad returns 3 colors
  return chroma(baseHex).triad().hex();
};

export const generateSquare = (baseHex: string): string[] => {
  // chroma.js doesn't have a direct square, so we calculate it
  const baseColor = chroma(baseHex);
  const h = baseColor.hsl()[0];
  const s = baseColor.hsl()[1];
  const l = baseColor.hsl()[2];

  const square: string[] = [];
  for (let i = 0; i < 4; i++) {
    const hue = (h + (i * 90)) % 360;
    square.push(chroma.hsl(hue, s, l).hex());
  }
  return square;
};

export const generateTetradic = (baseHex: string): string[] => {
  // chroma.js tetrad returns 4 colors
  return chroma(baseHex).tetrad().hex();
};

export const generateSplitComplementary = (baseHex: string): string[] => {
  // chroma.js splitcomplementary returns 3 colors
  return chroma(baseHex).splitcomplementary().hex();
};

// CIEDE2000 threshold for "just noticeable difference" (JND)
// chroma.js deltaE is based on CIE76, which is less perceptually uniform than CIEDE2000.
// A common CIEDE2000 JND is around 2.3. For CIE76, a slightly higher threshold is often used for "similar enough".
const CIE76_SIMILARITY_THRESHOLD = 2.3; 

export const areColorsSimilarCiede2000 = (hex1: string, hex2: string, threshold: number = CIE76_SIMILARITY_THRESHOLD): boolean => {
  if (!isValidHex(hex1) || !isValidHex(hex2)) {
    return false; // Cannot compare invalid hex codes
  }
  // Calculate CIE76 deltaE difference using chroma.js
  const diff = chroma.deltaE(hex1, hex2);
  return diff < threshold;
};