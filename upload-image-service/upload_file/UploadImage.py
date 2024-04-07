from fastapi import HTTPException
import os
import tempfile
import uuid

from PIL import Image



class UploadImage():
    def __init__(self, file, destination_path, quality=85):
        """
        Initializes the object with the given file, destination path, and quality.
        
        Parameters:
            file: the input file
            destination_path: the destination path for the processed file
            quality: the quality of the image (default is 85)
        """
        self.destination_path = self.__generate_security_name(file, destination_path)
        self.quality = quality
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.webp', mode='w+b')
        self.read_file_content(file)

        self.__file_type_check(file)
        
        self.image = Image.open(self.temp_file.name)
    
    def __file_type_check(self, file):
        """
        A function to check the type of file based on MIME types.

        Parameters:
        file (str): The file to be checked.

        Raises:
        HTTPException: If the file type is not supported.
        """
        types_mime_valides = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/tiff",
            "image/webp"
        ]
        if file.content_type not in types_mime_valides:
            raise ValueError("415: Unsupported file type")


    def read_file_content(self, file):
        """
        Reads the content of the given file and writes it to the temporary file.
        
        Parameters:
            file: the input file
        """
        with open(self.temp_file.name, 'wb') as temp_file:
            content = file.file.read()
            temp_file.write(content)
            temp_file.seek(0)


    def __generate_security_name(self, file, destination_path):
        """
        Generates a secure name for the given file and returns the path to the destination directory with the secure name.
        
        Args:
            file: The file for which the secure name is generated.
            destination_path: The destination path where the secure name will be placed.
            
        Returns:
            str: The path to the destination directory with the secure name.
        """
        secure_name = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}" 
        return os.path.join(destination_path, secure_name)
    

    def __change_extension(self, new_extension):
        """
        Private method to change the file extension of destination_path to the given new extension.
        
        Parameters:
            new_extension (str): New file extension (e.g., 'jpg', 'png').
        """
        base = os.path.splitext(self.destination_path)[0]
        self.destination_path = f"{base}.{new_extension}"


    def save(self):
        """
        Save the image to the destination path with a specified quality.
        """
        try:
            os.makedirs(os.path.dirname(self.destination_path), exist_ok=True)
            self.image.save(self.destination_path)
        except Exception as e:
            raise ValueError("500: Failed to save image")
        finally:
            self.cleanup()

        return self.destination_path


    def cleanup(self):
        """Deletes the temporary file."""
        if self.temp_file:
            self.temp_file.close()  # Ferme le fichier si ce n'est pas déjà fait
            os.remove(self.temp_file.name)  # Supprime le fichier du système de fichiers
            print(f"Fichier temporaire {self.temp_file.name} supprimé.")


    def resize_image(self, size=(800, 600)):
        """
        Resize the image to the specified size.

        Parameters:
            size (tuple): A tuple representing the new size of the image. Default is (800, 600).

        Returns:
            None
        """
        self.image = self.image.resize(size)
        self.image.save(self.temp_file.name)
    

    def __convert_image(self, format):
        """
        Convert the image to the specified format and save it to the destination path with the provided quality.
        
        Supported formats: 'JPEG', 'PNG', 'WEBP', 'BMP', 'TIFF', 'GIF'.
        
        Parameters:
            format (str): Format to convert the image to.
        """
        self.__change_extension(format.lower())
        
        if format.upper() in ['JPEG', 'WEBP']:
            # Convert image to RGB if it's in a mode that supports transparency
            if self.image.mode in ('RGBA', 'P', 'LA'):
                self.image = self.image.convert('RGB')
            self.image.save(self.temp_file.name, format=format, quality=self.quality)
        elif format.upper() == 'PNG':
            # PNG uses compress_level instead of quality
            self.image.save(self.temp_file.name, format=format, compress_level=9)
        else:
            # For BMP, TIFF, and GIF, the quality parameter does not apply
            self.image.save(self.temp_file.name, format=format)
    

    def convert_to_png(self):
        """
        Convert the image to PNG format.
        """
        self.__convert_image('PNG')
    

    def convert_to_webp(self):
        """
        Convert the image to WEBP format.
        """
        self.__convert_image('WEBP')
    

    def convert_to_jpg(self):
        """
        Convert the image to JPEG format.
        """
        self.__convert_image('JPEG')
    

    def convert_to_bmp(self):
        """
        Convert the image to BMP format.
        """
        self.__convert_image('BMP')
    

    def convert_to_tiff(self):
        """
        Convert the image to TIFF format.
        """
        self.__convert_image('TIFF')
    
    
    def convert_to_gif(self):
        """
        Convert the image to GIF format.
        """
        self.__convert_image('GIF')