import os
import shutil
import uuid

from typing import Union
from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse
from upload_file import UploadImage

load_dotenv()
app = FastAPI()

origins = os.environ.get('CORS_URL')
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Récupération de l'image d'avatar
@app.get("/avatar/{image_path}")
async def get_avatar(image_path: str):
    if not os.path.exists(f"./uploads/images/avatars/{image_path}"):
        raise HTTPException(status_code=404, detail="Image not found.")
    
    return FileResponse(f"./uploads/images/avatars/{image_path}")

###### Gestion de l'image d'avatar ######

# Enregistrement de l'image d'avatar
@app.post("/avatar")
async def create_upload_file(file: Union[UploadFile, None] = File(None)):
    if file is None:
        return {"message": "Aucun fichier à uploader."}
    
    try:
        uploader = UploadImage(file, "./uploads/images/avatars/")
        uploader.resize_image((150, 150))
        uploader.convert_to_webp()
        new_image_path = uploader.save()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Vous pouvez choisir de renvoyer le chemin de la nouvelle image, son URL, ou l'image elle-même
    return JSONResponse(
        status_code=200,
        content={
            "message": "Image uploader avec succès.", 
            "image_path": new_image_path.rsplit('/', 1)[-1]
        }
    )


# Suppression de l'image d'avatar
@app.delete("/avatar/{image_path}")
async def delete_avatar(image_path: str):
    if not os.path.exists(f"./uploads/images/avatars/{image_path}"):
        raise HTTPException(status_code=404, detail="Image not found.")
    
    os.remove(f"./uploads/images/avatars/{image_path}")
    return JSONResponse(
        status_code=200,
        content={"message": "Image supprimée avec succès."}
    )



###### Gestion de l'image des leçons ######

# Récupération de l'image de la leçon
@app.get("/lesson/{image_path}")
async def get_lesson_image(image_path: str):
    if not os.path.exists(f"./uploads/images/lessons/{image_path}"):
        raise HTTPException(status_code=404, detail="Image not found.")
    
    return FileResponse(f"./uploads/images/lessons/{image_path}")


# Enregistrement de l'image de la leçon
@app.post("/lesson")
async def create_upload_file(file: Union[UploadFile, None] = File(None)):
    if file is None:
        return {"message": "Aucun fichier à uploader."}
    
    try:
        uploader = UploadImage(file, "./uploads/images/lessons/")
        # uploader.resize_image((800, 600))
        # uploader.convert_to_webp()
        new_image_path = uploader.save()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Vous pouvez choisir de renvoyer le chemin de la nouvelle image, son URL, ou l'image elle-même
    return JSONResponse(
        status_code=200,
        content={
            "message": "Image uploader avec succès.", 
            "image_path": new_image_path.rsplit('/', 1)[-1]
        }
    )


# Suppression de l'image de la leçon
@app.delete("/lesson/{image_path}")
async def delete_lesson_image(image_path: str):
    if not os.path.exists(f"./uploads/images/lessons/{image_path}"):
        raise HTTPException(status_code=404, detail="Image not found.")
    
    os.remove(f"./uploads/images/lessons/{image_path}")
    return JSONResponse(
        status_code=200,
        content={"message": "Image supprimée avec succès."}
    )