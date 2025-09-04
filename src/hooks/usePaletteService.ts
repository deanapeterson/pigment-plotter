import { useState, useCallback } from 'react';
import { PaletteService, ColorData } from '@/services/paletteService';

export const usePaletteService = () => {
  const [paletteService] = useState(() => new PaletteService());
  const [colors, setColors] = useState<ColorData[]>([]);

  const addColor = useCallback((hex: string, name?: string) => {
    const newColor: ColorData = {
      id: crypto.randomUUID(),
      hex,
      name,
    };
    paletteService.addColor(newColor);
    setColors(paletteService.getColors());
  }, [paletteService]);

  const removeColor = useCallback((id: string) => {
    paletteService.removeColor(id);
    setColors(paletteService.getColors());
  }, [paletteService]);

  const updateColor = useCallback((id: string, hex: string, name?: string) => {
    paletteService.updateColor(id, hex, name);
    setColors(paletteService.getColors());
  }, [paletteService]);

  const exportToJson = useCallback(() => {
    return paletteService.exportToJson();
  }, [paletteService]);

  const downloadJson = useCallback(() => {
    paletteService.downloadJson();
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
    getVariations,
  };
};