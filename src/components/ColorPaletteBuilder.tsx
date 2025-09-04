import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Palette, Download, Trash2, FolderPlus, ChevronDown } from "lucide-react";
import { ColorInput } from "./ColorInput";
import { ColorCard } from "./ColorCard";
import { toast } from "sonner";
import { usePaletteService } from "@/hooks/usePaletteService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FlatColorListDialog } from "./FlatColorListDialog";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const ColorPaletteBuilder = () => {
  const {
    colors,
    paletteName,
    setPaletteName,
    allPaletteNames,
    activePaletteName,
    createNewPalette,
    switchPalette,
    deleteActivePalette,
    addColor,
    removeColor,
    updateColor,
    downloadJson,
    exportFlatColors,
    getVariations,
    importPaletteFromJson,
  } = usePaletteService();

  const [isFlatListDialogOpen, setIsFlatListDialogOpen] = useState(false);
  const [flatColorsToDisplay, setFlatColorsToDisplay] = useState<string[]>([]);
  const [isCreatePaletteDialogOpen, setIsCreatePaletteDialogOpen] = useState(false);
  const [newPaletteName, setNewPaletteName] = useState("");
  const [isImportPaletteDialogOpen, setIsImportPaletteDialogOpen] = useState(false);
  const [importJsonInput, setImportJsonInput] = useState("");

  const handleExportFullPalette = () => {
    downloadJson();
    toast.success("Full palette exported successfully!");
  };

  const handleExportFlatList = () => {
    const flatColors = exportFlatColors();
    setFlatColorsToDisplay(flatColors);
    setIsFlatListDialogOpen(true);
  };

  const handleCreateNewPalette = () => {
    if (!newPaletteName.trim()) {
      toast.error("Palette name cannot be empty.");
      return;
    }
    if (createNewPalette(newPaletteName.trim())) {
      toast.success(`Palette '${newPaletteName}' created and activated!`);
      setNewPaletteName("");
      setIsCreatePaletteDialogOpen(false);
    } else {
      toast.error(`Palette with name '${newPaletteName}' already exists.`);
    }
  };

  const handleDeleteActivePalette = () => {
    if (allPaletteNames.length === 1) {
      toast.error("Cannot delete the last palette. Create a new one first.");
      return;
    }
    if (activePaletteName && deleteActivePalette()) {
      toast.success(`Palette '${activePaletteName}' deleted.`);
    } else {
      toast.error("Failed to delete palette.");
    }
  };

  const handleImportPalette = () => {
    try {
      importPaletteFromJson(importJsonInput);
      toast.success("Palette imported successfully!");
      setImportJsonInput("");
      setIsImportPaletteDialogOpen(false);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message || "Invalid JSON"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Top Right Actions */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Palette Management Dropdown */}
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
            <DropdownMenuItem onClick={() => setIsCreatePaletteDialogOpen(true)}>
              <FolderPlus className="w-4 h-4 mr-2" /> Create New Palette
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsImportPaletteDialogOpen(true)}>
              <Download className="w-4 h-4 mr-2" /> Import Palette (JSON)
            </DropdownMenuItem>
            {activePaletteName && (
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
                      <AlertDialogAction onClick={handleDeleteActivePalette} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export Palette Dropdown */}
        {colors.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 shadow-lg bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportFullPalette}>
                Export Full Palette (JSON)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportFlatList}>
                Preview & Download Flat List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow">
              <Palette className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Color Palette Builder
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Create beautiful color palettes with automatic tints, shades, and variations.
            Perfect for designers and developers.
          </p>

          {/* Palette Name Input */}
          <div className="max-w-md mx-auto text-left mb-12">
            <Label htmlFor="palette-name" className="sr-only">Palette Name</Label>
            <Input
              id="palette-name"
              placeholder="Enter palette name (e.g., My Brand Colors)"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              className="text-center text-lg py-6 bg-card/60 border-0 shadow-soft focus:shadow-elegant transition-all duration-300"
            />
          </div>
        </div>

        {/* Add New Color */}
        <Card className="p-6 mb-8 shadow-soft border-0 bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Add New Color</h2>
          </div>
          <ColorInput onAddColor={addColor} />
        </Card>

        {/* Color Palette Grid */}
        <div className="grid gap-6">
          {colors.length === 0 ? (
            <Card className="p-12 text-center shadow-soft border-0 bg-card/60 backdrop-blur-sm">
              <div className="text-muted-foreground">
                <Palette className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No colors yet</h3>
                <p>Add your first color above to start building your palette</p>
              </div>
            </Card>
          ) : (
            colors.map((color) => (
              <ColorCard
                key={color.id}
                color={color}
                onRemove={() => removeColor(color.id)}
                onUpdate={(hex, name) => updateColor(color.id, hex, name)}
                variations={getVariations(color.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Flat Color List Dialog */}
      <FlatColorListDialog
        open={isFlatListDialogOpen}
        onOpenChange={setIsFlatListDialogOpen}
        colors={flatColorsToDisplay}
      />

      {/* Create New Palette Dialog */}
      <Dialog open={isCreatePaletteDialogOpen} onOpenChange={setIsCreatePaletteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Palette</DialogTitle>
            <DialogDescription>
              Enter a name for your new color palette. It will become the active palette.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="new-palette-name">Palette Name</Label>
            <Input
              id="new-palette-name"
              value={newPaletteName}
              onChange={(e) => setNewPaletteName(e.target.value)}
              placeholder="e.g., My Project Colors"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePaletteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateNewPalette}>Create Palette</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Palette Dialog */}
      <Dialog open={isImportPaletteDialogOpen} onOpenChange={setIsImportPaletteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Palette from JSON</DialogTitle>
            <DialogDescription>
              Paste the JSON data of a previously exported palette here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="import-json">Palette JSON</Label>
            <Input
              id="import-json"
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setImportJsonInput(event.target?.result as string);
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <textarea
              id="import-json-textarea"
              value={importJsonInput}
              onChange={(e) => setImportJsonInput(e.target.value)}
              placeholder="Paste JSON here or upload a file..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportPaletteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleImportPalette}>Import Palette</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};