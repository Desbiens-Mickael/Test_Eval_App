import hmac
import json
import os
import re
from typing import Union

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.responses import FileResponse
from upload_file import UploadImage

load_dotenv()
app = FastAPI()

UPLOAD_ROOT = "./uploads/images"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 Mo
# Noms générés par le service : uuid4 + extension (empêche "../" et autres chemins)
IMAGE_NAME_REGEX = re.compile(r"^[0-9a-fA-F-]{36}\.[a-zA-Z0-9]{2,5}$")


def parse_origins(raw: Union[str, None]) -> list:
    """Accepte une liste JSON (["http://a","http://b"]) ou des URLs séparées par des virgules."""
    if not raw:
        return []
    raw = raw.strip()
    if raw.startswith("["):
        return [str(origin) for origin in json.loads(raw)]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=parse_origins(os.environ.get("CORS_URL")),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def require_upload_key(x_upload_key: Union[str, None] = Header(default=None)):
    """
    Vérifie la clé partagée avec le serveur Next.js.
    Sans UPLOAD_API_KEY configurée, l'envoi et la suppression sont refusés.
    """
    expected = os.environ.get("UPLOAD_API_KEY")
    if not expected or not x_upload_key or not hmac.compare_digest(
        x_upload_key, expected
    ):
        raise HTTPException(status_code=401, detail="Unauthorized.")


def image_path_or_404(folder: str, image_path: str) -> str:
    if not IMAGE_NAME_REGEX.match(image_path):
        raise HTTPException(status_code=404, detail="Image not found.")
    path = os.path.join(UPLOAD_ROOT, folder, image_path)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Image not found.")
    return path


def save_upload(file: Union[UploadFile, None], folder: str, avatar: bool):
    if file is None:
        raise HTTPException(status_code=400, detail="Aucun fichier à uploader.")
    if file.size is not None and file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image trop volumineuse.")

    try:
        uploader = UploadImage(file, os.path.join(UPLOAD_ROOT, folder) + "/")
        if avatar:
            uploader.resize_image((150, 150))
            uploader.convert_to_webp()
        new_image_path = uploader.save()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return JSONResponse(
        status_code=200,
        content={
            "message": "Image uploader avec succès.",
            "image_path": new_image_path.rsplit("/", 1)[-1],
        },
    )


def delete_image(folder: str, image_path: str):
    os.remove(image_path_or_404(folder, image_path))
    return JSONResponse(
        status_code=200, content={"message": "Image supprimée avec succès."}
    )


###### Gestion de l'image d'avatar ######

@app.get("/avatar/{image_path}")
async def get_avatar(image_path: str):
    return FileResponse(image_path_or_404("avatars", image_path))


@app.post("/avatar", dependencies=[Depends(require_upload_key)])
async def upload_avatar(file: Union[UploadFile, None] = File(None)):
    return save_upload(file, "avatars", avatar=True)


@app.delete("/avatar/{image_path}", dependencies=[Depends(require_upload_key)])
async def delete_avatar(image_path: str):
    return delete_image("avatars", image_path)


###### Gestion de l'image des leçons ######

@app.get("/lesson/{image_path}")
async def get_lesson_image(image_path: str):
    return FileResponse(image_path_or_404("lessons", image_path))


@app.post("/lesson", dependencies=[Depends(require_upload_key)])
async def upload_lesson_image(file: Union[UploadFile, None] = File(None)):
    return save_upload(file, "lessons", avatar=False)


@app.delete("/lesson/{image_path}", dependencies=[Depends(require_upload_key)])
async def delete_lesson_image(image_path: str):
    return delete_image("lessons", image_path)
