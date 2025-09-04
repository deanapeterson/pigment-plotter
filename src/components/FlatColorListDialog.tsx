import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy } from "lucide-react"; // Removed Download icon as it's not used here
import { toast } from "sonner";
import { getContrastColor, hexToHsl } from "@/lib/colorUtils"; // Import hexToHsl

interface FlatColorListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: string[];
}

export const FlatColorListDialog = ({ open, onOpenChange, colors }: FlatColorListDialogProps) => {
  const handleCopyAll = () => {
    if (colors.length > 0) {
      navigator.clipboard.writeText(colors.join("\n"));
      toast.success("All colors copied to clipboard!");
    } else {
      toast.info("No colors to copy.");
    }
  };

  // Sort colors by hue
  const sortedColors = React.useMemo(() => {
    return [...colors].sort((a, b) => {
      const hslA = hexToHsl(a);
      const hslB = hexToHsl(b);
      return hslA.h - hslB.h;
    });
  }, [colors]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Exported Flat Color List</DialogTitle>
          <DialogDescription>
            Here is a flat list of all unique colors in your palette, sorted by hue. Click a color to copy its hex value.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden py-4">
          {sortedColors.length === 0 ? (
            <p className="text-muted-foreground text-center">No colors in the palette to export.</p>
          ) : (
            <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/20">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {sortedColors.map((color, index) => {
                  const contrastColor = getContrastColor(color);
                  return (
                    <div
                      key={index}
                      className="aspect-square flex items-center justify-center rounded-md text-xs font-mono uppercase cursor-pointer transition-transform duration-100 hover:scale-105 shadow-sm"
                      style={{ backgroundColor: color, color: contrastColor }}
                      title={`Click to copy ${color.toUpperCase()}`}
                      onClick={() => {
                        navigator.clipboard.writeText(color);
                        toast.success(`${color.toUpperCase()} copied to clipboard!`);
                      }}
                    >
                      {color.toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2">
          <Button onClick={handleCopyAll} disabled={sortedColors.length === 0} className="w-full sm:w-auto">
            <Copy className="w-4 h-4 mr-2" /> Copy All
          </Button>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto" variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};