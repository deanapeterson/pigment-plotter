import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ExportPaletteActionsProps } from "@/types/color";

export const ExportPaletteActions = ({
  hasColors,
  onExportFullPalette,
  onExportFlatList,
}: ExportPaletteActionsProps) => {
  if (!hasColors) {
    return null; // Don't render if no colors to export
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2 shadow-lg bg-gradient-primary hover:shadow-glow transition-all duration-300">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onExportFullPalette}>
          Export Full Palette (JSON)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onExportFlatList}>
          Preview & Download Flat List
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};