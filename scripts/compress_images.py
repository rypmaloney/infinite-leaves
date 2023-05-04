import os
import shutil
from tqdm import tqdm
from PIL import Image


def compress(img_dir):
    compress_dir = os.path.join(img_dir, "compressed325")
    if not os.path.exists(compress_dir):
        os.makedirs(compress_dir)

    img_files = [
        f
        for f in os.listdir(img_dir)
        if f.endswith(".jpg") or f.endswith(".jpeg") or f.endswith(".png")
    ]

    for img_file in tqdm(img_files):
        # Copy the file into the compressed directory
        shutil.copy(
            os.path.join(img_dir, img_file), os.path.join(compress_dir, img_file)
        )

        # Compress the copied file
        with Image.open(os.path.join(compress_dir, img_file)) as img:
            # width, height = img.size
            # resized_img = img.resize((int(width / 2), int(height / 2)))
            resized_img = img.resize((325, 325))
            resized_img.save(
                os.path.join(compress_dir, img_file), optimize=True, quality=60
            )


if __name__ == "__main__":
    compress("images/01/samples/")
