import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import { ColorVariations } from "./ColorVariations";
import { hexToRgb, hexToHsl, getContrastColor } from "@/lib/colorUtils";
import { ColorVariations as ColorVariationsType, ColorData } from "@/services/paletteService";

interface ColorCardProps {
  color: ColorData;
  onRemove: () => void;
  onUpdate: (hex: string, name?: string) => void;
  variations?: ColorVariationsType;
}

export const ColorCard = ({ color, onRemove, onUpdate, variations }: ColorCardProps) => {
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
      <div className="flex">
        {/* Primary Color Section - Left Side */}
        <div 
          className="w-64 p-6 text-center relative flex flex-col justify-center"
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
              <div className="text-lg font-mono opacity-90 mb-4">{color.hex.toUpperCase()}</div>
              
              {/* Color Format Information */}
              <div className="space-y-2">
                <div 
                  className="cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors flex items-center justify-center"
                  onClick={() => handleCopy(color.hex, "HEX")}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="font-mono text-sm">HEX: {color.hex.toUpperCase()}</span>
                </div>
                
                <div 
                  className="cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors flex items-center justify-center"
                  onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="font-mono text-sm">RGB: {rgb.r}, {rgb.g}, {rgb.b}</span>
                </div>
                
                <div 
                  className="cursor-pointer hover:bg-white/10 p-1 rounded-md transition-colors flex items-center justify-center"
                  onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  <span className="font-mono text-sm">HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Color Variations - Right Side */}
        <div className="flex-1 p-4"> {/* Reduced p-6 to p-4 */}
          {variations ? (
            <ColorVariations baseColor={color.hex} variations={variations} />
          ) : (
            <ColorVariations baseColor={color.hex} />
          )}
        </div>
      </div>
    </Card>
  );
};