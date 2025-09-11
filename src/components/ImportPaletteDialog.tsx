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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImportPaletteDialogProps } from "@/types/color";

export const ImportPaletteDialog = ({
  open,
  onOpenChange,
  importJsonInput,
  setImportJsonInput,
  onImportPalette,
}: ImportPaletteDialogProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportJsonInput(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Palette from JSON</DialogTitle>
          <DialogDescription>
            Paste the JSON data of a previously exported palette here or upload a JSON file.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="import-json-file">Upload JSON File</Label>
          <Input
            id="import-json-file"
            type="file"
            accept=".json"
            onChange={handleFileChange}
          />
          <Label htmlFor="import-json-textarea">Paste JSON Data</Label>
          <textarea
            id="import-json-textarea"
            value={importJsonInput}
            onChange={(e) => setImportJsonInput(e.target.value)}
            placeholder="Paste JSON here..."
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onImportPalette}>Import Palette</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};