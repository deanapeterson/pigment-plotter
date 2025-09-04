import { generateTints, generateShades, generateAnalogous, generateComplementary, generateTriadic, generateSquare, generateTetradic, generateSplitComplementary } from "@/lib/colorUtils";

export interface ColorData {
  id: string;
  hex: string;
  name?: string;
}

export interface ColorVariations {
  tints: string[];
  shades: string[];
  analogous: string[];
  complementary: string[];
  triadic: string[];
  square: string[]; // New harmony
  tetradic: string[]; // New harmony
  splitComplementary: string[]; // New harmony
}

export interface PaletteData {
  baseColors: ColorData[];
  variations: Record<string, ColorVariations>;
}

export class PaletteService {
  private data: PaletteData = {
    baseColors: [],
    variations: {}
  };

  addColor(color: ColorData): void {
    this.data.baseColors.push(color);
    this.generateVariations(color);
  }

  removeColor(id: string): void {
    this.data.baseColors = this.data.baseColors.filter(color => color.id !== id);
    delete this.data.variations[id];
  }

  updateColor(id: string, hex: string, name?: string): void {
    const colorIndex = this.data.baseColors.findIndex(color => color.id === id);
    if (colorIndex !== -1) {
      this.data.baseColors[colorIndex] = { id, hex, name };
      this.generateVariations({ id, hex, name });
    }
  }

  private generateVariations(color: ColorData): void {
    this.data.variations[color.id] = {
      tints: generateTints(color.hex, 5),
      shades: generateShades(color.hex, 5),
      analogous: generateAnalogous(color.hex),
      complementary: generateComplementary(color.hex),
      triadic: generateTriadic(color.hex),
      square: generateSquare(color.hex), // Generate new harmony
      tetradic: generateTetradic(color.hex), // Generate new harmony
      splitComplementary: generateSplitComplementary(color.hex) // Generate new harmony
    };
  }

  getColors(): ColorData[] {
    return this.data.baseColors;
  }

  getVariations(colorId: string): ColorVariations | undefined {
    return this.data.variations[colorId];
  }

  exportToJson(): string {
    const exportData = {
      palette: {
        name: `Color Palette - ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        baseColors: this.data.baseColors,
        variations: this.data.variations
      }
    };
    return JSON.stringify(exportData, null, 2);
  }

  downloadJson(): void {
    const jsonData = this.exportToJson();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `color-palette-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importFromJson(jsonString: string): void {
    try {
      const importData = JSON.parse(jsonString);
      if (importData.palette && importData.palette.baseColors) {
        this.data.baseColors = importData.palette.baseColors;
        this.data.variations = importData.palette.variations || {};
        
        // Regenerate variations for any missing ones
        this.data.baseColors.forEach(color => {
          if (!this.data.variations[color.id]) {
            this.generateVariations(color);
          }
        });
      }
    } catch (error) {
      console.error('Error importing palette:', error);
      throw new Error('Invalid JSON format');
    }
  }
}