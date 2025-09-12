import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Palette } from "lucide-react";
import { toast } from "sonner";
import { ColorInput } from "./ColorInput";
import { ColorCard } from "./ColorCard";
import { FlatColorListDialog } from "./FlatColorListDialog";
import { usePaletteService } from "@/hooks/usePaletteService";
import { PaletteManagementActions } from "./PaletteManagementActions";
import { ExportPaletteActions } from "./ExportPaletteActions";
import { PaletteHeaderSection } from "./PaletteHeaderSection";
import { ImportPaletteDialog } from "./ImportPaletteDialog";
import { SettingsPanel } from "./SettingsPanel"; // Import the new component

export const ColorPaletteBuilder = () => {
  const [similarityThreshold, setSimilarityThreshold] = useState(20); // Initial threshold
  
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
  } = usePaletteService(similarityThreshold); // Pass threshold to the hook

  const [isFlatListDialogOpen, setIsFlatListDialogOpen] = useState(false);
  const [flatColorsToDisplay, setFlatColorsToDisplay] = useState<string[]>([]);
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

  const handleCreateNewPaletteDirectly = () => {
    let newName = "New Palette";
    let counter = 1;
    while (allPaletteNames.includes(newName)) {
      newName = `New Palette ${counter}`;
      counter++;
    }

    if (createNewPalette(newName)) {
      toast.success(`Palette '${newName}' created and activated!`);
    } else {
      toast.error(`Failed to create palette '${newName}'. It might already exist.`);
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
        <SettingsPanel
          similarityThreshold={similarityThreshold}
          setSimilarityThreshold={setSimilarityThreshold}
        />
        <PaletteManagementActions
          allPaletteNames={allPaletteNames}
          activePaletteName={activePaletteName}
          switchPalette={switchPalette}
          createNewPalette={handleCreateNewPaletteDirectly}
          setIsImportPaletteDialogOpen={setIsImportPaletteDialogOpen}
          deleteActivePalette={handleDeleteActivePalette}
          hasColors={colors.length > 0}
        />
        <ExportPaletteActions
          hasColors={colors.length > 0}
          onExportFullPalette={handleExportFullPalette}
          onExportFlatList={handleExportFlatList}
        />
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <PaletteHeaderSection
          paletteName={paletteName}
          setPaletteName={setPaletteName}
        />

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

      {/* Import Palette Dialog */}
      <ImportPaletteDialog
        open={isImportPaletteDialogOpen}
        onOpenChange={setIsImportPaletteDialogOpen}
        importJsonInput={importJsonInput}
        setImportJsonInput={setImportJsonInput}
        onImportPalette={handleImportPalette}
      />
    </div>
  );
};