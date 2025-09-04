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
import { Copy } from "lucide-react";
import { toast } from "sonner";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exported Flat Color List</DialogTitle>
          <DialogDescription>
            Here is a flat list of all unique colors in your palette. You can copy them or download the JSON.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {colors.length === 0 ? (
            <p className="text-muted-foreground text-center">No colors in the palette to export.</p>
          ) : (
            <ScrollArea className="h-60 w-full rounded-md border p-4 font-mono text-sm bg-muted/20">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: color }}></span>
                  <span>{color.toUpperCase()}</span>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleCopyAll} disabled={colors.length === 0}>
            <Copy className="w-4 h-4 mr-2" /> Copy All
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};