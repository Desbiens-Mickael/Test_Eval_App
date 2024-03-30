import os
import shutil
import uuid
# import magic

from typing import Union
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from Image_handler import ImageHandler

load_dotenv()
app = FastAPI()

origins = ["*"] #os.environ.get('CORS_URL')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route pour exposer les fichiers static
app.mount("/image", StaticFiles(directory="./uploads/images"), name="image")


# Validation du type de fichier
def valider_type_fichier(file):
    types_mime_valides = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/webp"
    ]
    if file.content_type not in types_mime_valides:
        return False
    return True


@app.post("/uploadfile/")
async def create_upload_file(file: Union[UploadFile, None] = File(None)):
    if file is None:
        return {"message": "No upload file sent"}

    # Définir un emplacement temporaire pour sauvegarder l'image uploadée
    temp_image_dir = "./uploads/image_temp/"
    os.makedirs(temp_image_dir, exist_ok=True)

    # Générer un nom de fichier sécurisé
    fichier_nom_sec = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    temp_file_path = os.path.join(temp_image_dir, fichier_nom_sec)

    # Sauvegarder l'image temporairement
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Vérifier le type du fichier
    if not valider_type_fichier(file):
        os.remove(temp_file_path)  # Nettoyer si le fichier n'est pas valide
        raise HTTPException(status_code=400, detail="Type de fichier non supporté.")

    # Créer une instance de ImageHandler pour le fichier temporaire
    handler = ImageHandler(temp_file_path)

    # Convertir l'image en .webp, ajuste la qualité et la sauvegarde dans le dossier final
    save_path = "./uploads/images/"
    os.makedirs(save_path, exist_ok=True)
    new_image_path = handler.convert_to_webp(save_path, quality=80)

    # Nettoyer : fermer le fichier uploadé et supprimer le fichier temporaire
    file.file.close()
    try:
        os.remove(temp_file_path)
    except Exception as e:
        print(f"Erreur lors de la suppression du fichier temporaire : {e}")

    # Vous pouvez choisir de renvoyer le chemin de la nouvelle image, son URL, ou l'image elle-même
    return {"message": "Image processed successfully", "image_path": new_image_path.rsplit('/', 1)[-1]}
