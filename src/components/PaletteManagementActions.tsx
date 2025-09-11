import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Download, Trash2, FolderPlus, ChevronDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PaletteManagementActionsProps } from "@/types/color";

export const PaletteManagementActions = ({
  allPaletteNames,
  activePaletteName,
  switchPalette,
  createNewPalette,
  setIsImportPaletteDialogOpen,
  deleteActivePalette,
  hasColors,
}: PaletteManagementActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 shadow-lg">
          {activePaletteName || "Select Palette"} <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allPaletteNames.map((name) => (
          <DropdownMenuItem key={name} onClick={() => switchPalette(name)}>
            {name} {name === activePaletteName && "(Active)"}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={createNewPalette}>
          <FolderPlus className="w-4 h-4 mr-2" /> Create New Palette
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsImportPaletteDialogOpen(true)}>
          <Download className="w-4 h-4 mr-2" /> Import Palette (JSON)
        </DropdownMenuItem>
        {activePaletteName && hasColors && ( // Only show delete if there's an active palette and colors exist
          <>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Active Palette
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    <span className="font-bold"> {activePaletteName} </span> palette and all its associated colors.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteActivePalette} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};