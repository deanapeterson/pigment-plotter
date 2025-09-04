import { generateTints, generateShades, generateAnalogous, generateComplementary, generateTriadic, generateSquare, generateTetradic, generateSplitComplementary, areColorsSimilar } from "@/lib/colorUtils";

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
  square: string[];
  tetradic: string[];
  splitComplementary: string[];
}

export interface PaletteData {
  name: string;
  baseColors: ColorData[];
  variations: Record<string, ColorVariations>;
}

interface AllPalettesData {
  palettes: Record<string, PaletteData>;
  activePaletteName: string | null;
}

const LOCAL_STORAGE_KEY = "color-palette-builder-all-palette";
const DEFAULT_PALETTE_NAME = "My Awesome Palette";

export class PaletteService {
  private allPalettes: Record<string, PaletteData> = {};
  private activePaletteName: string | null = null;

  constructor() {
    this.loadAllPalettes();
    if (Object.keys(this.allPalettes).length === 0) {
      this.createPalette(DEFAULT_PALETTE_NAME);
    } else if (!this.activePaletteName || !this.allPalettes[this.activePaletteName]) {
      this.activePaletteName = Object.keys(this.allPalettes)[0];
      this.saveAllPalettes();
    }
  }

  private saveAllPalettes(): void {
    try {
      const dataToSave: AllPalettesData = {
        palettes: this.allPalettes,
        activePaletteName: this.activePaletteName,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save all palettes to local storage:", error);
    }
  }

  private loadAllPalettes(): void {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData: AllPalettesData = JSON.parse(savedData);
        if (parsedData.palettes && typeof parsedData.palettes === 'object') {
          this.allPalettes = parsedData.palettes;
          this.activePaletteName = parsedData.activePaletteName;

          // Regenerate variations for any missing ones or new harmony types
          Object.values(this.allPalettes).forEach(palette => {
            palette.baseColors.forEach(color => {
              if (!palette.variations[color.id] || Object.keys(palette.variations[color.id]).length < 7) { // Check if all 7 harmonies are present
                this.generateVariations(color, palette);
              }
            });
          });
        }
      }
    } catch (error) {
      console.error("Failed to load all palettes from local storage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
    }
  }

  private getActivePalette(): PaletteData {
    if (!this.activePaletteName || !this.allPalettes[this.activePaletteName]) {
      // This should ideally not happen if constructor logic is sound
      console.error("No active palette or active palette not found. Creating a default one.");
      this.createPalette(DEFAULT_PALETTE_NAME);
      return this.allPalettes[this.activePaletteName!];
    }
    return this.allPalettes[this.activePaletteName];
  }

  getAllPaletteNames(): string[] {
    return Object.keys(this.allPalettes);
  }

  getActivePaletteName(): string | null {
    return this.activePaletteName;
  }

  createPalette(name: string): boolean {
    if (this.allPalettes[name]) {
      return false; // Palette with this name already exists
    }
    this.allPalettes[name] = {
      name: name,
      baseColors: [],
      variations: {},
    };
    this.activePaletteName = name;
    this.saveAllPalettes();
    return true;
  }

  loadPalette(name: string): boolean {
    if (!this.allPalettes[name]) {
      return false; // Palette not found
    }
    this.activePaletteName = name;
    this.saveAllPalettes();
    return true;
  }

  renamePalette(oldName: string, newName: string): boolean {
    if (!this.allPalettes[oldName] || this.allPalettes[newName]) {
      return false; // Old palette not found or new name already exists
    }
    const palette = this.allPalettes[oldName];
    palette.name = newName; // Update the name property inside the palette data
    this.allPalettes[newName] = palette;
    delete this.allPalettes[oldName];

    if (this.activePaletteName === oldName) {
      this.activePaletteName = newName;
    }
    this.saveAllPalettes();
    return true;
  }

  deletePalette(name: string): boolean {
    if (!this.allPalettes[name]) {
      return false; // Palette not found
    }
    const wasActive = this.activePaletteName === name;
    delete this.allPalettes[name];

    if (wasActive) {
      // After deleting the active palette, always switch to a new default palette
      // regardless of how many other palettes exist.
      const newDefaultName = DEFAULT_PALETTE_NAME;
      // Ensure the new default name is unique if a palette with that exact name exists
      let finalNewDefaultName = newDefaultName;
      let counter = 1;
      while (this.allPalettes[finalNewDefaultName]) {
         finalNewDefaultName = `${newDefaultName} ${counter}`;
         counter++;
      }
      this.createPalette(finalNewDefaultName);
      this.activePaletteName = finalNewDefaultName;
    } else if (this.activePaletteName === null || !this.allPalettes[this.activePaletteName]) {
       // Fallback safety check, though 'wasActive' should cover the main case
       const remainingNames = Object.keys(this.allPalettes);
       if (remainingNames.length > 0) {
          this.activePaletteName = remainingNames[0];
       } else {
          // This case should ideally not be reached due to the createPalette above,
          // but included for robustness.
          this.createPalette(DEFAULT_PALETTE_NAME);
          this.activePaletteName = DEFAULT_PALETTE_NAME;
       }
    }
    this.saveAllPalettes();
    return true;
  }

  // --- Methods operating on the active palette ---

  setPaletteNameForActive(name: string): void {
    const activePalette = this.getActivePalette();
    if (activePalette.name !== name) {
      // If the name is actually changing, we need to handle the key in allPalettes
      const oldName = activePalette.name;
      if (this.allPalettes[name]) {
        console.warn(`Palette with name '${name}' already exists. Cannot rename active palette to a duplicate name.`);
        return;
      }
      activePalette.name = name;
      this.allPalettes[name] = activePalette;
      delete this.allPalettes[oldName];
      this.activePaletteName = name;
      this.saveAllPalettes();
    }
  }

  getPaletteNameForActive(): string {
    return this.getActivePalette().name;
  }

  addColor(color: ColorData): boolean {
    const activePalette = this.getActivePalette();
    // Check for exact hex match first
    if (activePalette.baseColors.some(c => c.hex.toLowerCase() === color.hex.toLowerCase())) {
      return false; // Exact duplicate, do not add
    }

    // Check for perceptual similarity
    if (activePalette.baseColors.some(c => areColorsSimilar(c.hex, color.hex))) {
      return false; // Perceptually similar, do not add
    }

    activePalette.baseColors.push(color);
    this.generateVariations(color, activePalette);
    this.saveAllPalettes();
    return true;
  }

  removeColor(id: string): void {
    const activePalette = this.getActivePalette();
    activePalette.baseColors = activePalette.baseColors.filter(color => color.id !== id);
    delete activePalette.variations[id];
    this.saveAllPalettes();
  }

  updateColor(id: string, hex: string, name?: string): void {
    const activePalette = this.getActivePalette();
    const colorIndex = activePalette.baseColors.findIndex(color => color.id === id);
    if (colorIndex !== -1) {
      activePalette.baseColors[colorIndex] = { id, hex, name };
      this.generateVariations({ id, hex, name }, activePalette);
      this.saveAllPalettes();
    }
  }

  private generateVariations(color: ColorData, palette: PaletteData): void {
    palette.variations[color.id] = {
      tints: generateTints(color.hex, 5),
      shades: generateShades(color.hex, 5),
      analogous: generateAnalogous(color.hex),
      complementary: generateComplementary(color.hex),
      triadic: generateTriadic(color.hex),
      square: generateSquare(color.hex),
      tetradic: generateTetradic(color.hex),
      splitComplementary: generateSplitComplementary(color.hex)
    };
  }

  getColors(): ColorData[] {
    return this.getActivePalette().baseColors;
  }

  getVariations(colorId: string): ColorVariations | undefined {
    return this.getActivePalette().variations[colorId];
  }

  exportToJson(): string {
    const activePalette = this.getActivePalette();
    const exportData = {
      palette: {
        name: activePalette.name,
        createdAt: new Date().toISOString(),
        baseColors: activePalette.baseColors,
        variations: activePalette.variations
      }
    };
    return JSON.stringify(exportData, null, 2);
  }

  downloadJson(): void {
    const jsonData = this.exportToJson();
    const activePalette = this.getActivePalette();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePalette.name.toLowerCase().replace(/\s/g, '-')}-palette-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  exportFlatColors(): string[] {
    const activePalette = this.getActivePalette();
    const uniqueColors = new Set<string>();

    activePalette.baseColors.forEach(color => uniqueColors.add(color.hex.toUpperCase()));

    Object.values(activePalette.variations).forEach(variationSet => {
      Object.values(variationSet).forEach(colorsArray => {
        colorsArray.forEach(colorHex => uniqueColors.add(colorHex.toUpperCase()));
      });
    });

    return Array.from(uniqueColors);
  }

  downloadFlatColors(): void {
    const flatColors = this.exportFlatColors();
    const activePalette = this.getActivePalette();
    const jsonData = JSON.stringify(flatColors, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePalette.name.toLowerCase().replace(/\s/g, '-')}-flat-colors-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importFromJson(jsonString: string): void {
    try {
      const importData = JSON.parse(jsonString);
      if (importData.palette && importData.palette.name && Array.isArray(importData.palette.baseColors)) {
        const newPaletteName = importData.palette.name;
        if (this.allPalettes[newPaletteName]) {
          console.warn(`Palette with name '${newPaletteName}' already exists. Overwriting.`);
        }
        const importedPalette: PaletteData = {
          name: newPaletteName,
          baseColors: importData.palette.baseColors,
          variations: importData.palette.variations || {},
        };

        // Ensure all variations are generated for imported colors
        importedPalette.baseColors.forEach(color => {
          if (!importedPalette.variations[color.id]) {
            this.generateVariations(color, importedPalette);
          }
        });

        this.allPalettes[newPaletteName] = importedPalette;
        this.activePaletteName = newPaletteName;
        this.saveAllPalettes();
      } else {
        throw new Error('Invalid JSON format for palette import.');
      }
    } catch (error) {
      console.error('Error importing palette:', error);
      throw new Error('Invalid JSON format or data structure.');
    }
  }
}