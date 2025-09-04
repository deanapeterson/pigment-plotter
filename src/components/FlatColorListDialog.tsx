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
import { Copy, Download } from "lucide-react"; // Import Download icon
import { toast } from "sonner";
import { getContrastColor } from "@/lib/colorUtils"; // Import getContrastColor

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

  // This function will be called from the parent component (ColorPaletteBuilder)
  // to trigger the actual download of the flat JSON.
  // For now, I'll add a placeholder toast.
  const handleDownloadFlatList = () => {
    // This action should ideally be handled by the parent component
    // which has access to the paletteService.downloadFlatColors() method.
    // For this component, we'll just show a toast.
    toast.info("Download functionality will be triggered by the main export button.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col"> {/* Increased max-width and added flex-col */}
        <DialogHeader>
          <DialogTitle>Exported Flat Color List</DialogTitle>
          <DialogDescription>
            Here is a flat list of all unique colors in your palette. Click a color to copy its hex value.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden py-4"> {/* Added flex-1 and overflow-hidden */}
          {colors.length === 0 ? (
            <p className="text-muted-foreground text-center">No colors in the palette to export.</p>
          ) : (
            <ScrollArea className="h-full w-full rounded-md border p-4 bg-muted/20"> {/* Changed height to h-full */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"> {/* Responsive grid */}
                {colors.map((color, index) => {
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
        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2"> {/* Adjusted footer for better layout */}
          <Button onClick={handleCopyAll} disabled={colors.length === 0} className="w-full sm:w-auto">
            <Copy className="w-4 h-4 mr-2" /> Copy All
          </Button>
          {/* Removed the direct download button from here as it's handled by the main export dropdown */}
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto" variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};