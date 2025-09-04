import { useState, useCallback } from 'react';
import { PaletteService, ColorData } from '@/services/paletteService';

export const usePaletteService = () => {
  // Initialize PaletteService once. Its constructor will handle loading from localStorage.
  const [paletteService] = useState(() => new PaletteService());
  
  // Initialize state variables from the paletteService instance
  const [colors, setColors] = useState<ColorData[]>(paletteService.getColors());
  const [paletteName, setPaletteNameState] = useState<string>(paletteService.getPaletteName());

  const addColor = useCallback((hex: string, name?: string): boolean => {
    const newColor: ColorData = {
      id: crypto.randomUUID(),
      hex,
      name,
    };
    const success = paletteService.addColor(newColor);
    if (success) {
      setColors([...paletteService.getColors()]); // Create a new array reference to trigger re-render
    }
    return success;
  }, [paletteService]);

  const removeColor = useCallback((id: string) => {
    paletteService.removeColor(id);
    setColors([...paletteService.getColors()]); // Create a new array reference to trigger re-render
  }, [paletteService]);

  const updateColor = useCallback((id: string, hex: string, name?: string) => {
    paletteService.updateColor(id, hex, name);
    setColors([...paletteService.getColors()]); // Create a new array reference to trigger re-render
  }, [paletteService]);

  const setPaletteName = useCallback((name: string) => {
    paletteService.setPaletteName(name);
    setPaletteNameState(name); // Update local state to trigger re-render
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
    paletteName,
    setPaletteName,
    addColor,
    removeColor,
    updateColor,
    exportToJson,
    downloadJson,
    exportFlatColors,
    downloadFlatColors,
    getVariations,
  };
};