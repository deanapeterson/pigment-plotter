# python -c "from PIL import Image; Image.new('RGB', (1920,1080), '#00FF00').save('green.png')"



from PIL import Image
import json
import tkinter as tk
from tkinter import simpledialog, messagebox


# Open a Tkinter dialog with a textarea to paste JSON string

from tkinter import filedialog

class JsonInputDialog(simpledialog.Dialog):
    def body(self, master):
        self.title("Paste JSON String and Save Path")
        tk.Label(master, text="Paste your JSON string below:").pack()
        self.text = tk.Text(master, width=60, height=20)
        self.text.pack()
        tk.Label(master, text="Save images to folder:").pack(pady=(10,0))
        frame = tk.Frame(master)
        frame.pack()
        self.save_to = tk.Entry(frame, width=48)
        self.save_to.insert(0, './images')
        self.save_to.pack(side=tk.LEFT)
        browse_btn = tk.Button(frame, text="Browse", command=self.browse_folder)
        browse_btn.pack(side=tk.LEFT, padx=5)
        return self.text

    def browse_folder(self):
        folder_selected = filedialog.askdirectory(title="Select Folder to Save Images")
        if folder_selected:
            self.save_to.delete(0, tk.END)
            self.save_to.insert(0, folder_selected)

    def apply(self):
        self.result = self.text.get("1.0", tk.END).strip()
        self.save_path = self.save_to.get().strip()


import os

root = tk.Tk()
root.withdraw()
dialog = JsonInputDialog(root)
json_str = dialog.result
save_path = dialog.save_path if hasattr(dialog, 'save_path') else './images'

if not json_str:
    messagebox.showinfo("No Input", "No JSON string was provided. Exiting.")
    exit(1)

try:
    data = json.loads(json_str)
except Exception as e:
    messagebox.showerror("Invalid JSON", f"Could not parse JSON: {e}")
    exit(1)

if not os.path.exists(save_path):
    try:
        os.makedirs(save_path)
    except Exception as e:
        messagebox.showerror("Directory Error", f"Could not create directory: {e}")
        exit(1)



# Save images and collect file names with index and leading zeros
image_filenames = []
num_colors = len(data)
num_digits = len(str(num_colors))
for idx, color in enumerate(data):
    print(color)
    index_str = str(idx + 1).zfill(num_digits)
    filename = f"{index_str}_{color}.png"
    Image.new('RGB', (3600, 3600), color).save(os.path.join(save_path, filename))
    image_filenames.append(filename)

# Export image file names to a text file
export_path = os.path.join(save_path, 'image_filenames.txt')
try:
    with open(export_path, 'w') as f:
        for name in image_filenames:
            f.write(name + '\n')
    print(f"Exported image file names to {export_path}")
except Exception as e:
    messagebox.showerror("Export Error", f"Could not write image file names: {e}")