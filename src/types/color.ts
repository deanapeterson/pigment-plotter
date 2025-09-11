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

export interface ColorCardProps {
  color: ColorData;
  onRemove: () => void;
  onUpdate: (hex: string, name?: string) => void;
  variations?: ColorVariations;
}

export interface ColorInputProps {
  onAddColor: (hex: string, name?: string) => boolean;
}

export interface ColorVariationsProps {
  baseColor: string;
  variations?: ColorVariations;
}

export interface FlatColorListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: string[];
}

// New interfaces for refactored components
export interface PaletteManagementActionsProps {
  allPaletteNames: string[];
  activePaletteName: string | null;
  switchPalette: (name: string) => boolean;
  createNewPalette: () => void;
  setIsImportPaletteDialogOpen: (isOpen: boolean) => void;
  deleteActivePalette: () => void;
  hasColors: boolean; // To determine if delete option should be available
}

export interface ExportPaletteActionsProps {
  hasColors: boolean;
  onExportFullPalette: () => void;
  onExportFlatList: () => void;
}

export interface PaletteHeaderSectionProps {
  paletteName: string;
  setPaletteName: (name: string) => void;
}

export interface ImportPaletteDialogProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  importJsonInput: string;
  setImportJsonInput: (json: string) => void;
  onImportPalette: () => void;
}