"""
Enregistrement des fichiers audio des dictées.

Le format est reconnu à partir des premiers octets du fichier (signature),
pas du nom ni du type annoncé par le navigateur. Le fichier est enregistré
tel quel (pas de conversion) sous un nom aléatoire uuid4 + extension.
"""

import os
import uuid
from typing import Optional, Tuple

# Extension -> type MIME servi au navigateur
AUDIO_MEDIA_TYPES = {
    "webm": "audio/webm",
    "ogg": "audio/ogg",
    "mp3": "audio/mpeg",
    "m4a": "audio/mp4",
    "wav": "audio/wav",
}


def detect_audio_format(head: bytes) -> Optional[str]:
    """
    Renvoie l'extension du format audio reconnu dans les premiers octets,
    ou None si le contenu n'est pas un format audio accepté.
    """
    # WebM / Matroska (enregistrement du navigateur : Chrome, Firefox)
    if head.startswith(b"\x1a\x45\xdf\xa3"):
        return "webm"
    # Ogg (Opus, Vorbis)
    if head.startswith(b"OggS"):
        return "ogg"
    # MP3 avec étiquette ID3, ou trame MPEG brute (11 bits de synchronisation)
    if head.startswith(b"ID3") or (len(head) > 1 and head[0] == 0xFF and (head[1] & 0xE0) == 0xE0):
        return "mp3"
    # MP4 / M4A (enregistrement Safari, mémos vocaux) : boîte « ftyp »
    if len(head) >= 12 and head[4:8] == b"ftyp":
        return "m4a"
    # WAV : RIFF....WAVE
    if len(head) >= 12 and head[0:4] == b"RIFF" and head[8:12] == b"WAVE":
        return "wav"
    return None


def save_audio(file, destination_dir: str, max_size: int) -> Tuple[str, str]:
    """
    Vérifie et enregistre un fichier audio envoyé.

    Renvoie (nom du fichier, type MIME).
    Lève ValueError si le fichier est vide, trop gros ou pas un audio accepté.
    """
    content = file.file.read(max_size + 1)
    if not content:
        raise ValueError("Le fichier est vide.")
    if len(content) > max_size:
        raise ValueError("413: Fichier audio trop volumineux.")

    extension = detect_audio_format(content[:16])
    if extension is None:
        raise ValueError("415: Format audio non pris en charge.")

    os.makedirs(destination_dir, exist_ok=True)
    name = f"{uuid.uuid4()}.{extension}"
    with open(os.path.join(destination_dir, name), "wb") as output:
        output.write(content)
    return name, AUDIO_MEDIA_TYPES[extension]
