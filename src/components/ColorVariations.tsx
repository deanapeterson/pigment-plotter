import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { generateTints, generateShades, generateAnalogous, generateComplementary } from "@/lib/colorUtils";

interface ColorVariationsProps {
  baseColor: string;
}

export const ColorVariations = ({ baseColor }: ColorVariationsProps) => {
  const tints = generateTints(baseColor, 8);
  const shades = generateShades(baseColor, 8);
  const analogous = generateAnalogous(baseColor);
  const complementary = generateComplementary(baseColor);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    toast(`${color} copied to clipboard!`);
  };

  const ColorStrip = ({ colors, title }: { colors: string[]; title: string }) => (
    <div className="space-y-2">
      <Badge variant="secondary" className="text-xs">{title}</Badge>
      <div className="grid grid-cols-8 gap-1 rounded-lg overflow-hidden shadow-sm">
        {colors.map((color, index) => (
          <div
            key={index}
            className="aspect-square cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
            style={{ backgroundColor: color }}
            onClick={() => handleCopy(color)}
            title={color}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <Copy className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-4 text-foreground">Color Variations</h4>
        <div className="space-y-4">
          <ColorStrip colors={tints} title="Tints (Lighter)" />
          <ColorStrip colors={shades} title="Shades (Darker)" />
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-4 text-foreground">Color Harmonies</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">Analogous Colors</Badge>
            <div className="flex gap-1 rounded-lg overflow-hidden shadow-sm">
              {analogous.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 aspect-square cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color)}
                  title={color}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Copy className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">Complementary Colors</Badge>
            <div className="flex gap-1 rounded-lg overflow-hidden shadow-sm">
              {complementary.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 aspect-square cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color)}
                  title={color}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Copy className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};