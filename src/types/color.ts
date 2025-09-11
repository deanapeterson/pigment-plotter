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