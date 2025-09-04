import { useState, useCallback } from 'react';
import { PaletteService, ColorData } from '@/services/paletteService';

export const usePaletteService = () => {
  const [paletteService] = useState(() => new PaletteService());
  const [colors, setColors] = useState<ColorData[]>([]);

  const addColor = useCallback((hex: string, name?: string): boolean => {
    const newColor: ColorData = {
      id: crypto.randomUUID(),
      hex,
      name,
    };
    const success = paletteService.addColor(newColor);
    if (success) {
      setColors([...paletteService.getColors()]); // Create a new array reference
    }
    return success;
  }, [paletteService]);

  const removeColor = useCallback((id: string) => {
    paletteService.removeColor(id);
    setColors([...paletteService.getColors()]); // Create a new array reference
  }, [paletteService]);

  const updateColor = useCallback((id: string, hex: string, name?: string) => {
    paletteService.updateColor(id, hex, name);
    setColors([...paletteService.getColors()]); // Create a new array reference
  }, [paletteService]);

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

  return {
    colors,
    addColor,
    removeColor,
    updateColor,
    exportToJson,
    downloadJson,
    exportFlatColors, // Expose new function
    downloadFlatColors, // Expose new function
    getVariations,
  };
};