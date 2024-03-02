import os

from PIL import Image


class ImageHandler:
    def __init__(self, image_path):
        self.image_path = image_path
        self.image = Image.open(image_path)

    def convert_to_webp(self, save_path=None, quality=80):
        name_webp = self.image_path.rsplit('.', 1)[0] + '.webp'
        image_name = name_webp.rsplit('/', 1)[-1]

        if save_path is None:
            save_path = os.path.join(os.path.dirname(self.image_path), name_webp)
        else:  
            save_path = os.path.join(save_path, image_name)

        self.image.save(save_path, format="WEBP", quality=quality)
        return save_path
            