// Color utility functions for the palette builder

export const isValidHex = (hex: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / diff + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / diff + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

export const hslToHex = (h: number, s: number, l: number): string => {
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
};

export const getContrastColor = (hex: string): string => {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};

export const generateTints = (baseHex: string, count: number): string[] => {
  const { h, s, l } = hexToHsl(baseHex);
  const tints: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const lightness = l + ((100 - l) * (i / (count - 1)));
    tints.push(hslToHex(h, s, Math.min(100, lightness)));
  }
  
  return tints;
};

export const generateShades = (baseHex: string, count: number): string[] => {
  const { h, s, l } = hexToHsl(baseHex);
  const shades: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const lightness = l - (l * (i / (count - 1)));
    shades.push(hslToHex(h, s, Math.max(0, lightness)));
  }
  
  return shades;
};

export const generateAnalogous = (baseHex: string): string[] => {
  const { h, s, l } = hexToHsl(baseHex);
  const analogous: string[] = [];
  
  // Generate 5 analogous colors (30 degrees apart)
  for (let i = -2; i <= 2; i++) {
    const hue = (h + (i * 30) + 360) % 360;
    analogous.push(hslToHex(hue, s, l));
  }
  
  return analogous;
};

export const generateComplementary = (baseHex: string): string[] => {
  const { h, s, l } = hexToHsl(baseHex);
  const complementary: string[] = [];
  
  // Base color
  complementary.push(baseHex);
  
  // Complementary color (180 degrees opposite)
  const compHue = (h + 180) % 360;
  complementary.push(hslToHex(compHue, s, l));
  
  return complementary;
};

export const generateTriadic = (baseHex: string): string[] => {
  const { h, s, l } = hexToHsl(baseHex);
  const triadic: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const hue = (h + (i * 120)) % 360;
    triadic.push(hslToHex(hue, s, l));
  }
  
  return triadic;
};