import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Palette } from "lucide-react";
import { ColorInput } from "./ColorInput";
import { ColorCard } from "./ColorCard";
import { toast } from "sonner";

export interface ColorData {
  id: string;
  hex: string;
  name?: string;
}

export const ColorPaletteBuilder = () => {
  const [colors, setColors] = useState<ColorData[]>([
    { id: "1", hex: "#8B5CF6", name: "Primary Purple" },
    { id: "2", hex: "#0EA5E9", name: "Accent Blue" }
  ]);

  const addColor = (hex: string, name?: string) => {
    const newColor: ColorData = {
      id: Date.now().toString(),
      hex,
      name: name || `Color ${colors.length + 1}`
    };
    setColors([...colors, newColor]);
    toast(`Added ${hex} to your palette!`);
  };

  const removeColor = (id: string) => {
    setColors(colors.filter(color => color.id !== id));
    toast("Color removed from palette");
  };

  const updateColor = (id: string, hex: string, name?: string) => {
    setColors(colors.map(color => 
      color.id === id ? { ...color, hex, name } : color
    ));
    toast("Color updated!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};