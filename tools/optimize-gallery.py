import os
import glob
from PIL import Image, ImageOps

def process_images():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    gallery_dir = os.path.join(base_dir, 'images', 'gallery')
    opt_dir = os.path.join(gallery_dir, 'opt')
    os.makedirs(opt_dir, exist_ok=True)

    categories = ['notebooks', 'shilpkaar', 'team', 'moments']
    
    for cat in categories:
        cat_dir = os.path.join(gallery_dir, cat)
        if not os.path.exists(cat_dir):
            continue
        
        # Get all images in the category folder
        files = glob.glob(os.path.join(cat_dir, '*.*'))
        for f in files:
            if not f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                continue
                
            name = os.path.splitext(os.path.basename(f))[0]
            thumb_path = os.path.join(opt_dir, f"{name}-thumb.webp")
            full_path = os.path.join(opt_dir, f"{name}-full.webp")
            
            try:
                with Image.open(f) as img:
                    # Apply EXIF rotation
                    img = ImageOps.exif_transpose(img)
                    
                    # Convert to RGB if needed
                    if img.mode in ('RGBA', 'P'):
                        img = img.convert('RGB')
                    
                    w, h = img.size
                    
                    # Full size (1400px)
                    if w > 1400:
                        new_h = int(h * (1400 / w))
                        full_img = img.resize((1400, new_h), Image.Resampling.LANCZOS)
                    else:
                        full_img = img
                    full_img.save(full_path, 'WEBP', quality=80)
                    
                    # Thumb size (640px)
                    if w > 640:
                        new_h = int(h * (640 / w))
                        thumb_img = img.resize((640, new_h), Image.Resampling.LANCZOS)
                    else:
                        thumb_img = img
                    thumb_img.save(thumb_path, 'WEBP', quality=78)
                    
                    print(f"Processed: {f}")
            except Exception as e:
                print(f"Error processing {f}: {e}")

if __name__ == "__main__":
    process_images()
