import hmac
import json
import os
import re
from typing import Union

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.responses import FileResponse, Response
from upload_file import UploadImage
from upload_file.upload_audio import AUDIO_MEDIA_TYPES, save_audio

load_dotenv()
app = FastAPI()

UPLOAD_ROOT = "./uploads/images"
# Audio des dictées : dossier distinct des images
AUDIO_ROOT = "./uploads/audio"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 Mo (avant conversion)
# Plus grand côté d'une image de leçon après conversion
LESSON_MAX_SIDE = 1600
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
        else:
            uploader.limit_size(LESSON_MAX_SIDE)
        # Toutes les images sont enregistrées en WebP, plus léger
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


@app.get("/lesson", dependencies=[Depends(require_upload_key)])
async def list_lesson_images():
    """
    Liste les images de leçon enregistrées, avec leur date de dépôt
    (secondes depuis l'époque Unix). Sert au nettoyage des images
    qu'aucune leçon n'utilise.
    """
    folder = os.path.join(UPLOAD_ROOT, "lessons")
    if not os.path.isdir(folder):
        return {"images": []}
    images = [
        {"name": entry.name, "modified_at": entry.stat().st_mtime}
        for entry in os.scandir(folder)
        if entry.is_file() and IMAGE_NAME_REGEX.match(entry.name)
    ]
    return {"images": images}


@app.post("/lesson", dependencies=[Depends(require_upload_key)])
async def upload_lesson_image(file: Union[UploadFile, None] = File(None)):
    return save_upload(file, "lessons", avatar=False)


@app.delete("/lesson/{image_path}", dependencies=[Depends(require_upload_key)])
async def delete_lesson_image(image_path: str):
    return delete_image("lessons", image_path)


###### Gestion de l'audio des dictées ######

MAX_AUDIO_SIZE = 10 * 1024 * 1024  # 10 Mo
RANGE_REGEX = re.compile(r"^bytes=(\d*)-(\d*)$")


def audio_response(path: str, range_header: Union[str, None]):
    """
    Sert un fichier audio. Gère les requêtes partielles (en-tête Range) :
    sans elles, le navigateur ne peut pas revenir en arrière dans l'audio.
    """
    extension = path.rsplit(".", 1)[-1].lower()
    media_type = AUDIO_MEDIA_TYPES.get(extension, "application/octet-stream")
    size = os.path.getsize(path)
    match = RANGE_REGEX.match(range_header.strip()) if range_header else None
    if not match or (not match.group(1) and not match.group(2)):
        return FileResponse(path, media_type=media_type, headers={"Accept-Ranges": "bytes"})

    if match.group(1):
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else size - 1
    else:
        # « bytes=-500 » : les 500 derniers octets
        start = max(size - int(match.group(2)), 0)
        end = size - 1
    end = min(end, size - 1)
    if start > end or start >= size:
        return Response(status_code=416, headers={"Content-Range": f"bytes */{size}"})

    with open(path, "rb") as audio:
        audio.seek(start)
        data = audio.read(end - start + 1)
    return Response(
        content=data,
        status_code=206,
        media_type=media_type,
        headers={
            "Accept-Ranges": "bytes",
            "Content-Range": f"bytes {start}-{end}/{size}",
        },
    )


def audio_path_or_404(audio_path: str) -> str:
    if not IMAGE_NAME_REGEX.match(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found.")
    path = os.path.join(AUDIO_ROOT, audio_path)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Audio not found.")
    return path


@app.get("/dictation/{audio_path}")
async def get_dictation_audio(audio_path: str, request: Request):
    return audio_response(audio_path_or_404(audio_path), request.headers.get("range"))


@app.get("/dictation", dependencies=[Depends(require_upload_key)])
async def list_dictation_audio():
    """Fichiers audio enregistrés, avec leur date de dépôt (pour le nettoyage)."""
    if not os.path.isdir(AUDIO_ROOT):
        return {"files": []}
    files = [
        {"name": entry.name, "modified_at": entry.stat().st_mtime}
        for entry in os.scandir(AUDIO_ROOT)
        if entry.is_file() and IMAGE_NAME_REGEX.match(entry.name)
    ]
    return {"files": files}


@app.post("/dictation", dependencies=[Depends(require_upload_key)])
async def upload_dictation_audio(file: Union[UploadFile, None] = File(None)):
    if file is None:
        raise HTTPException(status_code=400, detail="Aucun fichier à uploader.")
    if file.size is not None and file.size > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=413, detail="Fichier audio trop volumineux.")
    try:
        name, _ = save_audio(file, AUDIO_ROOT, MAX_AUDIO_SIZE)
    except ValueError as e:
        message = str(e)
        status = 413 if message.startswith("413") else 415 if message.startswith("415") else 400
        raise HTTPException(status_code=status, detail=message.split(": ", 1)[-1])
    # Même clé que les images : le front lit « image_path »
    return JSONResponse(
        status_code=200,
        content={"message": "Audio enregistré avec succès.", "image_path": name},
    )


@app.delete("/dictation/{audio_path}", dependencies=[Depends(require_upload_key)])
async def delete_dictation_audio(audio_path: str):
    os.remove(audio_path_or_404(audio_path))
    return JSONResponse(status_code=200, content={"message": "Audio supprimé avec succès."})
