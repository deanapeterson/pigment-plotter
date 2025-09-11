import { useState, useCallback, useEffect } from 'react';
import { PaletteService } from '@/services/paletteService';
import { ColorData } from '@/types/color'; // Updated import

export const usePaletteService = () => {
  const [paletteService] = useState(() => new PaletteService());
  
  // State for the currently active palette's data
  const [colors, setColors] = useState<ColorData[]>([]);
  const [paletteName, setPaletteNameState] = useState<string>("");
  
  // State for managing the list of all palettes
  const [allPaletteNames, setAllPaletteNames] = useState<string[]>([]);
  const [activePaletteName, setActivePaletteNameState] = useState<string | null>(null);

  // Function to update all relevant states from the service
  const updateAllStates = useCallback(() => {
    setColors(paletteService.getColors());
    setPaletteNameState(paletteService.getPaletteNameForActive());
    setAllPaletteNames(paletteService.getAllPaletteNames());
    setActivePaletteNameState(paletteService.getActivePaletteName());
  }, [paletteService]);

  // Initialize states on mount
  useEffect(() => {
    updateAllStates();
  }, [updateAllStates]);

  const addColor = useCallback((hex: string, name?: string): boolean => {
    const newColor: ColorData = {
      id: crypto.randomUUID(),
      hex,
      name,
    };
    const success = paletteService.addColor(newColor);
    if (success) {
      updateAllStates();
    }
    return success;
  }, [paletteService, updateAllStates]);

  const removeColor = useCallback((id: string) => {
    paletteService.removeColor(id);
    updateAllStates();
  }, [paletteService, updateAllStates]);

  const updateColor = useCallback((id: string, hex: string, name?: string) => {
    paletteService.updateColor(id, hex, name);
    updateAllStates();
  }, [paletteService, updateAllStates]);

  const setPaletteName = useCallback((name: string) => {
    paletteService.setPaletteNameForActive(name);
    updateAllStates();
  }, [paletteService, updateAllStates]);

  const createNewPalette = useCallback((name: string): boolean => {
    const success = paletteService.createPalette(name);
    if (success) {
      updateAllStates();
    }
    return success;
  }, [paletteService, updateAllStates]);

  const switchPalette = useCallback((name: string): boolean => {
    const success = paletteService.loadPalette(name);
    if (success) {
      updateAllStates();
    }
    return success;
  }, [paletteService, updateAllStates]);

  const deleteActivePalette = useCallback((): boolean => {
    if (activePaletteName) {
      const success = paletteService.deletePalette(activePaletteName);
      if (success) {
        updateAllStates();
      }
      return success;
    }
    return false;
  }, [paletteService, activePaletteName, updateAllStates]);

  const exportToJson = useCallback(() => {
    return paletteService.exportToJson();
  }, [paletteService]);

  const downloadJson = useCallback(() => {
    paletteService.downloadJson();
  }, [paletteService]);

  const exportFlatColors = useCallback(() => {
    return paletteService.exportFlatColors();
  }, [paletteService]);

  const downloadFlatColors = useCallback(() => {
    paletteService.downloadFlatColors();
  }, [paletteService]);

  const getVariations = useCallback((colorId: string) => {
    return paletteService.getVariations(colorId);
  }, [paletteService]);

  const importPaletteFromJson = useCallback((jsonString: string) => {
    paletteService.importFromJson(jsonString);
    updateAllStates();
  }, [paletteService, updateAllStates]);

  return {
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
    exportToJson,
    downloadJson,
    exportFlatColors,
    downloadFlatColors,
    getVariations,
    importPaletteFromJson,
  };
};