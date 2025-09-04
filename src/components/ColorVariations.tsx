import { Badge } from "@/components/ui/badge";
// Removed Copy icon import
// Removed toast import
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

  // Removed handleCopy function

  const ColorStrip = ({ colors, title }: { colors: string[]; title: string }) => (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs w-[120px] text-center text-wrap">{title}</Badge>
      <div className="flex-1 grid grid-cols-5 gap-1 rounded-lg overflow-hidden shadow-sm">
        {colors.map((color, index) => (
          <div
            key={index}
            className="aspect-2/1 relative group" // Removed cursor-pointer and hover effects
            style={{ backgroundColor: color }}
            // Removed onClick handler
            title={color}
          >
            {/* Removed Copy icon and its container */}
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
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-xs w-[120px] text-center text-wrap">{title}</Badge>
        <div className="flex-1 grid grid-cols-5 gap-1 rounded-lg overflow-hidden shadow-sm">
          {paddedColors.map((color, index) => (
            <div
              key={index}
              className={`aspect-2/1 relative group ${
                color === 'transparent' ? 'cursor-default' : '' // Removed hover effects
              }`}
              style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
              // Removed onClick handler
              title={color === 'transparent' ? '' : color}
            >
              {/* Removed Copy icon and its container */}
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
          <ColorStrip colors={tints} title="Tints (Lighter)" />
          <ColorStrip colors={shades} title="Shades (Darker)" />
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2 text-foreground">Color Harmonies</h4>
        <div className="space-y-2">
          <ColorHarmonyStrip colors={analogous} title="Analogous Colors" />
          <ColorHarmonyStrip colors={complementary} title="Complementary Colors" />
        </div>
      </div>
    </div>
  );
};