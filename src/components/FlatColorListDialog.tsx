import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, List, Code } from "lucide-react";
import { toast } from "sonner";
import { getContrastColor, hexToHsl } from "@/lib/colorUtils";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

interface FlatColorListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: string[];
}

export const FlatColorListDialog = ({ open, onOpenChange, colors }: FlatColorListDialogProps) => {
  const [viewAsJson, setViewAsJson] = useState(false);

  const sortedColors = React.useMemo(() => {
    return [...colors].sort((a, b) => {
      const hslA = hexToHsl(a);
      const hslB = hexToHsl(b);
      return hslA.l - hslB.l; // Sort by lightness
    });
  }, [colors]);

  const jsonOutput = React.useMemo(() => {
    return JSON.stringify(sortedColors, null, 2);
  }, [sortedColors]);

  const handleCopyAll = () => {
    if (sortedColors.length === 0) {
      toast.info("No colors to copy.");
      return;
    }
    
    const textToCopy = viewAsJson ? jsonOutput : sortedColors.join("\n");
    navigator.clipboard.writeText(textToCopy);
    toast.success(`${viewAsJson ? "JSON list" : "All colors"} copied to clipboard!`);
  };

  const handleCopyJson = () => {
    if (jsonOutput.length === 0) {
      toast.info("No JSON to copy.");
      return;
    }
    navigator.clipboard.writeText(jsonOutput);
    toast.success("JSON list copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Exported Flat Color List</DialogTitle>
          <DialogDescription>
            Here is a flat list of all unique colors in your palette, sorted by lightness.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-end gap-2 mb-4">
          <Label htmlFor="view-toggle" className="text-sm font-medium text-muted-foreground">View as JSON</Label>
          <Toggle
            id="view-toggle"
            pressed={viewAsJson}
            onPressedChange={setViewAsJson}
            aria-label="Toggle view as JSON"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {viewAsJson ? <Code className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Toggle>
        </div>
        {sortedColors.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No colors in the palette to export.</p>
        ) : (
          <div className="flex-1 rounded-md border p-4 bg-muted/20 overflow-auto">
            {viewAsJson ? (
              <div className="font-mono text-sm cursor-pointer" onClick={handleCopyJson}>
                <pre>{jsonOutput}</pre>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {sortedColors.map((color, index) => {
                  const contrastColor = getContrastColor(color);
                  return (
                    <div
                      key={index}
                      className="aspect-square flex items-center justify-center rounded-md text-xs font-mono uppercase cursor-pointer transition-all duration-100 hover:drop-shadow-lg" // Applied hover:drop-shadow-lg here
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
            )}
          </div>
        )}
        <DialogFooter className="flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          <Button onClick={handleCopyAll} disabled={sortedColors.length === 0} className="w-full sm:w-auto">
            <Copy className="w-4 h-4 mr-2" /> Copy {viewAsJson ? "JSON" : "All Colors"}
          </Button>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto" variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};