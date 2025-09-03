import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, Edit2, Check, X } from "lucide-react";
import { ColorData } from "./ColorPaletteBuilder";
import { ColorVariations } from "./ColorVariations";
import { toast } from "sonner";
import { hexToHsl, hexToRgb, getContrastColor } from "@/lib/colorUtils";

interface ColorCardProps {
  color: ColorData;
  onRemove: () => void;
  onUpdate: (hex: string, name?: string) => void;
}

export const ColorCard = ({ color, onRemove, onUpdate }: ColorCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editHex, setEditHex] = useState(color.hex);
  const [editName, setEditName] = useState(color.name || "");

  const handleCopy = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    toast(`${format} copied to clipboard!`);
  };

  const handleSaveEdit = () => {
    onUpdate(editHex, editName || undefined);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditHex(color.hex);
    setEditName(color.name || "");
    setIsEditing(false);
  };

  const contrastColor = getContrastColor(color.hex);
  const hsl = hexToHsl(color.hex);
  const rgb = hexToRgb(color.hex);

  return (
    <Card className="overflow-hidden shadow-soft border-0 bg-card/60 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
      {/* Color Header */}
      <div 
        className="p-6 text-center relative"
        style={{ backgroundColor: color.hex, color: contrastColor }}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onRemove}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editHex}
              onChange={(e) => setEditHex(e.target.value)}
              className="text-center bg-white/20 border-white/30 text-current placeholder:text-current/70"
              placeholder="Hex color"
            />
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-center bg-white/20 border-white/30 text-current placeholder:text-current/70"
              placeholder="Color name"
            />
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-2">{color.name || "Unnamed Color"}</h3>
            <div className="text-lg font-mono opacity-90">{color.hex.toUpperCase()}</div>
          </>
        )}
      </div>

      {/* Color Information */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">HEX</Badge>
            <div 
              className="font-mono text-sm cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors"
              onClick={() => handleCopy(color.hex, "HEX")}
            >
              <Copy className="w-3 h-3 inline mr-1" />
              {color.hex.toUpperCase()}
            </div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">RGB</Badge>
            <div 
              className="font-mono text-sm cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors"
              onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
            >
              <Copy className="w-3 h-3 inline mr-1" />
              {rgb.r}, {rgb.g}, {rgb.b}
            </div>
          </div>
          
          <div className="text-center">
            <Badge variant="outline" className="mb-2">HSL</Badge>
            <div 
              className="font-mono text-sm cursor-pointer hover:bg-secondary p-2 rounded-md transition-colors"
              onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
            >
              <Copy className="w-3 h-3 inline mr-1" />
              {hsl.h}°, {hsl.s}%, {hsl.l}%
            </div>
          </div>
        </div>

        {/* Color Variations */}
        <ColorVariations baseColor={color.hex} />
      </div>
    </Card>
  );
};