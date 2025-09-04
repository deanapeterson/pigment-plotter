import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { generateTints, generateShades, generateAnalogous, generateComplementary } from "@/lib/colorUtils";
import { ColorVariations as ColorVariationsType } from "@/services/paletteService";

interface ColorVariationsProps {
  baseColor: string;
  variations?: ColorVariationsType;
}

export const ColorVariations = ({ baseColor, variations }: ColorVariationsProps) => {
  // Use provided variations or generate them with a count of 5
  const tints = variations?.tints || generateTints(baseColor, 5);
  const shades = variations?.shades || generateShades(baseColor, 5);
  const analogous = variations?.analogous || generateAnalogous(baseColor);
  const complementary = variations?.complementary || generateComplementary(baseColor);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    toast(`${color} copied to clipboard!`);
  };

  const ColorStrip = ({ colors, title }: { colors: string[]; title: string }) => (
    <div className="space-y-1 flex-1"> {/* Added flex-1 */}
      <Badge variant="secondary" className="text-xs">{title}</Badge>
      <div className="grid grid-cols-5 gap-1 rounded-lg overflow-hidden shadow-sm">
        {colors.map((color, index) => (
          <div
            key={index}
            className="aspect-2/1 cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
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

  const ColorHarmonyStrip = ({ colors, title }: { colors: string[]; title: string }) => {
    // Pad colors to fill 5 slots for consistent height
    const paddedColors = [...colors];
    while (paddedColors.length < 5) {
      paddedColors.push('transparent');
    }

    return (
      <div className="space-y-1 flex-1"> {/* Added flex-1 */}
        <Badge variant="secondary" className="text-xs">{title}</Badge>
        <div className="grid grid-cols-5 gap-1 rounded-lg overflow-hidden shadow-sm">
          {paddedColors.map((color, index) => (
            <div
              key={index}
              className={`aspect-2/1 transition-transform duration-200 relative group ${
                color === 'transparent' ? 'cursor-default' : 'cursor-pointer hover:scale-105'
              }`}
              style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
              onClick={() => color !== 'transparent' && handleCopy(color)}
              title={color === 'transparent' ? '' : color}
            >
              {color !== 'transparent' && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <Copy className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 text-foreground">Color Variations</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-4"> {/* New flex container */}
            <h5 className="w-24 text-sm font-medium text-muted-foreground">Tints</h5> {/* New heading */}
            <ColorStrip colors={tints} title="Tints (Lighter)" />
          </div>
          <div className="flex items-center gap-4"> {/* New flex container */}
            <h5 className="w-24 text-sm font-medium text-muted-foreground">Shades</h5> {/* New heading */}
            <ColorStrip colors={shades} title="Shades (Darker)" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-foreground">Color Harmonies</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-4"> {/* New flex container */}
            <h5 className="w-24 text-sm font-medium text-muted-foreground">Analogous</h5> {/* New heading */}
            <ColorHarmonyStrip colors={analogous} title="Analogous Colors" />
          </div>
          <div className="flex items-center gap-4"> {/* New flex container */}
            <h5 className="w-24 text-sm font-medium text-muted-foreground">Complementary</h5> {/* New heading */}
            <ColorHarmonyStrip colors={complementary} title="Complementary Colors" />
          </div>
        </div>
      </div>
    </div>
  );
};