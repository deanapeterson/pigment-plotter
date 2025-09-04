import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Palette } from "lucide-react";
import { toast } from "sonner";
import { isValidHex } from "@/lib/colorUtils";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover components

interface ColorInputProps {
  onAddColor: (hex: string, name?: string) => void;
}

export const ColorInput = ({ onAddColor }: ColorInputProps) => {
  const [hexValue, setHexValue] = useState("");
  const [colorName, setColorName] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false); // State to control Popover visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hexValue) {
      toast.error("Please enter a color value");
      return;
    }

    const cleanHex = hexValue.startsWith("#") ? hexValue : `#${hexValue}`;
    
    if (!isValidHex(cleanHex)) {
      toast.error("Please enter a valid hex color (e.g., #FF5733)");
      return;
    }

    onAddColor(cleanHex, colorName || undefined);
    setHexValue("");
    setColorName("");
    setIsPickerOpen(false); // Close picker after adding color
  };

  const handleRandomColor = () => {
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setHexValue(randomHex);
    setIsPickerOpen(true); // Open picker when random color is generated
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexValue(value);
    // Optionally, open picker if a valid hex is being typed
    if (isValidHex(value.startsWith("#") ? value : `#${value}`)) {
      setIsPickerOpen(true);
    }
  };

  const handleColorPickerChange = (color: string) => {
    setHexValue(color);
  };

  const currentHex = hexValue.startsWith("#") ? hexValue : `#${hexValue}`;
  const isCurrentHexValid = isValidHex(currentHex);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hex-input">Hex Color</Label>
          <div className="relative">
            <Input
              id="hex-input"
              placeholder="#FF5733 or FF5733"
              value={hexValue}
              onChange={handleHexChange}
              className="pr-20"
            />
            {isCurrentHexValid && (
              <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md border-2 border-border shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{ backgroundColor: currentHex }}
                    aria-label="Open color picker"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <HexColorPicker color={currentHex} onChange={handleColorPickerChange} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name-input">Color Name (Optional)</Label>
          <Input
            id="name-input"
            placeholder="e.g., Brand Primary"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="opacity-0">Actions</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRandomColor}
              className="flex-1"
            >
              <Palette className="w-4 h-4 mr-2" />
              Random
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Color
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};