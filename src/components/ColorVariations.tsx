import { Badge } from "@/components/ui/badge";
import { generateTints, generateShades, generateAnalogous, generateComplementary, generateTriadic, generateSquare, generateTetradic, generateSplitComplementary } from "@/lib/colorUtils";
import { ColorVariations as ColorVariationsType } from "@/services/paletteService";
import { toast } from "sonner"; // Import toast for notifications

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
  const triadic = variations?.triadic || generateTriadic(baseColor);
  const square = variations?.square || generateSquare(baseColor);
  const tetradic = variations?.tetradic || generateTetradic(baseColor);
  const splitComplementary = variations?.splitComplementary || generateSplitComplementary(baseColor);

  const handleCopy = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    toast(`${format} copied to clipboard!`);
  };

  const ColorStrip = ({ colors, title }: { colors: string[]; title: string }) => (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="text-xs w-[120px] text-center text-wrap">{title}</Badge>
      <div className="flex-1 grid grid-cols-5 gap-1 rounded-lg overflow-hidden shadow-sm">
        {colors.map((color, index) => (
          <div
            key={index}
            className="aspect-2/1 relative group cursor-pointer transition-all duration-100"
            style={{ backgroundColor: color }}
            title={color}
            onClick={() => handleCopy(color, "HEX")}
          >
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
        <div className="flex-1 grid grid-cols-5 gap-1 rounded-lg overflow-sm">
          {paddedColors.map((color, index) => (
            <div
              key={index}
              className={`aspect-2/1 relative group ${
                color === 'transparent' ? 'cursor-default' : 'cursor-pointer transition-all duration-100'
              }`}
              style={{ backgroundColor: color === 'transparent' ? 'transparent' : color }}
              title={color === 'transparent' ? '' : color}
              onClick={() => color !== 'transparent' && handleCopy(color, "HEX")}
            >
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
          <ColorHarmonyStrip colors={triadic} title="Triadic Colors" />
          <ColorHarmonyStrip colors={square} title="Square Colors" />
          <ColorHarmonyStrip colors={tetradic} title="Tetradic Colors" />
          <ColorHarmonyStrip colors={splitComplementary} title="Split Complementary" />
        </div>
      </div>
    </div>
  );
};