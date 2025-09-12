import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SettingsPanelProps } from "@/types/color";

export const SettingsPanel = ({ similarityThreshold, setSimilarityThreshold }: SettingsPanelProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-lg">
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-4">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="similarity-threshold">Color Similarity Threshold</Label>
            <Slider
              id="similarity-threshold"
              min={0}
              max={50}
              step={1}
              value={[similarityThreshold]}
              onValueChange={(value) => setSimilarityThreshold(value[0])}
              className="w-full"
            />
            <span className="text-sm text-muted-foreground text-right">
              Current: {similarityThreshold} (Lower = more distinct colors)
            </span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};