import React, { useState, useRef, useEffect, useCallback } from "react";
import { FixedSizeGrid } from "react-window"; // Reverted to named import
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
      return hslA.h - hslB.h;
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

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [gridHeight, setGridHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (gridContainerRef.current) {
        setGridWidth(gridContainerRef.current.offsetWidth);
        setGridHeight(gridContainerRef.current.offsetHeight);
      }
    };

    updateDimensions(); // Set initial dimensions

    const observer = new ResizeObserver(updateDimensions);
    if (gridContainerRef.current) {
      observer.observe(gridContainerRef.current);
    }

    return () => {
      if (gridContainerRef.current) {
        observer.unobserve(gridContainerRef.current);
      }
    };
  }, []);

  const MIN_ITEM_WIDTH = 100; // Minimum width for a color square
  const GAP = 8; // Corresponds to Tailwind's gap-2

  // Calculate column count based on available width and minimum item width
  const calculatedColumnCount = Math.max(1, Math.floor((gridWidth + GAP) / (MIN_ITEM_WIDTH + GAP)));
  // Calculate the actual width of each item, distributing remaining space
  const actualItemWidth = (gridWidth - (calculatedColumnCount - 1) * GAP) / calculatedColumnCount;
  const actualItemHeight = actualItemWidth; // For aspect-square

  // For react-window, columnWidth and rowHeight should include the gap
  const columnWidthWithGap = actualItemWidth + GAP;
  const rowHeightWithGap = actualItemHeight + GAP;

  const rowCount = Math.ceil(sortedColors.length / calculatedColumnCount);

  // Cell component for react-window FixedSizeGrid
  const GridCell = useCallback(({ columnIndex, rowIndex, style, data }: any) => {
    const index = rowIndex * calculatedColumnCount + columnIndex;
    const color = data[index];

    if (!color) {
      return null; // No color at this index
    }

    const contrastColor = getContrastColor(color);

    return (
      <div style={style}> {/* This div gets the absolute positioning and full cell size from react-window */}
        <div
          className="flex items-center justify-center rounded-md text-xs font-mono uppercase cursor-pointer transition-transform duration-100 hover:scale-105 shadow-sm"
          style={{
            backgroundColor: color,
            color: contrastColor,
            width: actualItemWidth, // Explicitly set the item's width
            height: actualItemHeight, // Explicitly set the item's height
          }}
          title={`Click to copy ${color.toUpperCase()}`}
          onClick={() => {
            navigator.clipboard.writeText(color);
            toast.success(`${color.toUpperCase()} copied to clipboard!`);
          }}
        >
          {color.toUpperCase()}
        </div>
      </div>
    );
  }, [calculatedColumnCount, actualItemWidth, actualItemHeight, sortedColors]); // Dependencies for useCallback

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Exported Flat Color List</DialogTitle>
          <DialogDescription>
            Here is a flat list of all unique colors in your palette, sorted by hue.
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
          <div ref={gridContainerRef} className="flex-1 rounded-md border p-4 bg-muted/20 overflow-auto">
            {viewAsJson ? (
              <div className="font-mono text-sm cursor-pointer" onClick={handleCopyJson}>
                <pre>{jsonOutput}</pre>
              </div>
            ) : (
              gridWidth > 0 && gridHeight > 0 && (
                <FixedSizeGrid
                  columnCount={calculatedColumnCount}
                  columnWidth={columnWidthWithGap} // Pass item width + gap
                  height={gridHeight}
                  rowCount={rowCount}
                  rowHeight={rowHeightWithGap} // Pass item height + gap
                  width={gridWidth}
                  itemData={sortedColors}
                >
                  {GridCell}
                </FixedSizeGrid>
              )
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