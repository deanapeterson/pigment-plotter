import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Download } from "lucide-react";
import { ColorInput } from "./ColorInput";
import { ColorCard } from "./ColorCard";
import { toast } from "sonner";
import { usePaletteService } from "@/hooks/usePaletteService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components

export const ColorPaletteBuilder = () => {
  const { colors, addColor, removeColor, updateColor, downloadJson, downloadFlatColors, getVariations } = usePaletteService();

  const handleExportFullPalette = () => {
    downloadJson();
    toast("Full palette exported successfully!");
  };

  const handleExportFlatList = () => {
    downloadFlatColors();
    toast("Flat list of colors exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Export Palette Button - Fixed Position */}
      {colors.length > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 shadow-lg">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportFullPalette}>
                Export Full Palette (JSON)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportFlatList}>
                Export Flat List (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Palette className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Color Palette Builder
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create beautiful color palettes with automatic tints, shades, and variations. 
            Perfect for designers and developers.
          </p>
        </div>

        {/* Add New Color */}
        <Card className="p-6 mb-8 shadow-soft border-0 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Add New Color</h2>
          </div>
          <ColorInput onAddColor={addColor} />
        </Card>

        {/* Color Palette Grid */}
        <div className="grid gap-6">
          {colors.length === 0 ? (
            <Card className="p-12 text-center shadow-soft border-0 bg-card/60 backdrop-blur-sm">
              <div className="text-muted-foreground">
                <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No colors yet</h3>
                <p>Add your first color above to start building your palette</p>
              </div>
            </Card>
          ) : (
            colors.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                onRemove={() => removeColor(color.id)}
                onUpdate={(hex, name) => updateColor(color.id, hex, name)}
                variations={getVariations(color.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};