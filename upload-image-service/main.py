import os
import shutil
import uuid
# import magic

from typing import Union
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from upload_file import UploadImage

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

@app.post("/uploadfile/")
async def create_upload_file(file: Union[UploadFile, None] = File(None)):
    if file is None:
        return {"message": "No upload file sent"}
    
    try:
        uploader = UploadImage(file, "./uploads/images/")
        uploader.convert_to_webp()
        uploader.resize_image((80, 80))
        new_image_path = uploader.save()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Vous pouvez choisir de renvoyer le chemin de la nouvelle image, son URL, ou l'image elle-même
    return {"message": "Image processed successfully", "image_path": new_image_path.rsplit('/', 1)[-1]}
