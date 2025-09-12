from PIL import Image
import json
import tkinter as tk
from tkinter import simpledialog, messagebox, filedialog
import os

# Dialog class copied from render-colors.py
class JsonInputDialog(simpledialog.Dialog):
    def body(self, master):
        self.title("Paste JSON String and Save Path")
        tk.Label(master, text="Paste your JSON string below:").pack()
        self.text = tk.Text(master, width=60, height=20)
        self.text.pack()
        tk.Label(master, text="Save image to folder:").pack(pady=(10,0))
        frame = tk.Frame(master)
        frame.pack()
        self.save_to = tk.Entry(frame, width=48)
        self.save_to.insert(0, './images')
        self.save_to.pack(side=tk.LEFT)
        browse_btn = tk.Button(frame, text="Browse", command=self.browse_folder)
        browse_btn.pack(side=tk.LEFT, padx=5)

        # Custom image selection
        tk.Label(master, text="Optional: Add custom image to front:").pack(pady=(10,0))
        img_frame = tk.Frame(master)
        img_frame.pack()
        self.custom_img_path = tk.Entry(img_frame, width=48)
        self.custom_img_path.pack(side=tk.LEFT)
        img_browse_btn = tk.Button(img_frame, text="Browse", command=self.browse_image)
        img_browse_btn.pack(side=tk.LEFT, padx=5)

        return self.text

    def browse_folder(self):
        folder_selected = filedialog.askdirectory(title="Select Folder to Save Image")
        if folder_selected:
            self.save_to.delete(0, tk.END)
            self.save_to.insert(0, folder_selected)

    def browse_image(self):
        file_selected = filedialog.askopenfilename(title="Select Image to Add", filetypes=[("Image Files", "*.png;*.jpg;*.jpeg;*.bmp;*.gif"), ("All Files", "*.*")])
        if file_selected:
            self.custom_img_path.delete(0, tk.END)
            self.custom_img_path.insert(0, file_selected)

    def apply(self):
        self.result = self.text.get("1.0", tk.END).strip()
        self.save_path = self.save_to.get().strip()
        self.custom_image = self.custom_img_path.get().strip()

# Main logic

root = tk.Tk()
root.withdraw()
dialog = JsonInputDialog(root)
json_str = dialog.result
save_path = dialog.save_path if hasattr(dialog, 'save_path') else './images'
custom_image_path = dialog.custom_image if hasattr(dialog, 'custom_image') else ''

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


# Render vertical strips in 2 rows
img_size = 1200
num_colors = len(data)
if num_colors == 0:
    messagebox.showerror("No Colors", "No colors provided in JSON.")
    exit(1)

num_rows = 2
colors_per_row = (num_colors + 1) // 2
strip_width = img_size // colors_per_row
strip_height = img_size // num_rows
image = Image.new('RGB', (img_size, img_size), 'white')


# Draw each color strip with a drop shadow to the left
shadow_width = max(6, strip_width // 8)  # width of the shadow in pixels
for idx, color in enumerate(data):
    row = idx // colors_per_row
    col = idx % colors_per_row
    x0 = col * strip_width
    x1 = (col + 1) * strip_width if col < colors_per_row - 1 or (row == 0 and num_colors % 2 == 0) else img_size
    y0 = row * strip_height
    y1 = (row + 1) * strip_height if row < num_rows - 1 else img_size

    # Draw drop shadow (left of the color strip)
    for sx in range(x0 - shadow_width, x0):
        if sx < 0:
            continue
        # Shadow alpha fades out to the left
        alpha = int(80 * (1 - (x0 - sx) / shadow_width))  # 0..80
        shadow_color = (0, 0, 0)
        for sy in range(y0, y1):
            orig = image.getpixel((sx, sy))
            # Blend shadow with background (simple alpha blend)
            blended = tuple(
                int((alpha / 255) * s + (1 - alpha / 255) * o)
                for s, o in zip(shadow_color, orig)
            )
            image.putpixel((sx, sy), blended)

    # Draw the color strip
    for x in range(x0, x1):
        for y in range(y0, y1):
            image.putpixel((x, y), Image.new('RGB', (1, 1), color).getpixel((0, 0)))


# If a custom image is provided, composite it to the front (left) of the generated image
if custom_image_path:
    try:
        custom_img = Image.open(custom_image_path).convert('RGBA')
        # Resize custom image to fit the height of the generated image
        custom_img = custom_img.resize((custom_img.width * img_size // custom_img.height, img_size), Image.LANCZOS)
        # Create new image wide enough to hold both
        new_width = custom_img.width + image.width
        combined = Image.new('RGB', (new_width, img_size), 'white')
        combined.paste(custom_img.convert('RGB'), (0, 0))
        combined.paste(image, (custom_img.width, 0))
        image = combined
    except Exception as e:
        messagebox.showerror("Custom Image Error", f"Could not add custom image: {e}")

# Save the image
output_filename = 'color_strips.png'
output_path = os.path.join(save_path, output_filename)
try:
    image.save(output_path)
    print(f"Saved color strips image to {output_path}")
except Exception as e:
    messagebox.showerror("Save Error", f"Could not save image: {e}")
