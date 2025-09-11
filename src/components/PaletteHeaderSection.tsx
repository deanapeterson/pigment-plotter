import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { PaletteHeaderSectionProps } from "@/types/color";

export const PaletteHeaderSection = ({ paletteName, setPaletteName }: PaletteHeaderSectionProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
          <Palette className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Color Palette Builder
        </h1>
      </div>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
        Create beautiful color palettes with automatic tints, shades, and variations.
        Perfect for designers and developers.
      </p>

      {/* Palette Name Input */}
      <div className="max-w-md mx-auto text-left mb-12">
        <Label htmlFor="palette-name" className="sr-only">Palette Name</Label>
        <Input
          id="palette-name"
          placeholder="Enter palette name (e.g., My Brand Colors)"
          value={paletteName}
          onChange={(e) => setPaletteName(e.target.value)}
          className="text-center text-lg py-6 bg-card/60 border-0 shadow-soft focus:shadow-elegant transition-all duration-300"
        />
      </div>
    </div>
  );
};