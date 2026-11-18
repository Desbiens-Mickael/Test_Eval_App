import io
import os
import sys

import pytest
from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import main  # noqa: E402

API_KEY = "test-key"


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setenv("UPLOAD_API_KEY", API_KEY)
    monkeypatch.setattr(main, "UPLOAD_ROOT", str(tmp_path))
    monkeypatch.setattr(main, "AUDIO_ROOT", str(tmp_path / "audio"))
    return TestClient(main.app)


def png_file(name="photo.png"):
    buffer = io.BytesIO()
    Image.new("RGB", (300, 200), "red").save(buffer, format="PNG")
    buffer.seek(0)
    return {"file": (name, buffer, "image/png")}


@pytest.mark.parametrize("kind", ["avatar", "lesson"])
def test_upload_refuse_sans_cle(client, kind):
    response = client.post(f"/{kind}", files=png_file())
    assert response.status_code == 401


@pytest.mark.parametrize("kind", ["avatar", "lesson"])
def test_upload_refuse_mauvaise_cle(client, kind):
    response = client.post(
        f"/{kind}", files=png_file(), headers={"X-Upload-Key": "mauvaise"}
    )
    assert response.status_code == 401


def test_upload_refuse_si_cle_non_configuree(client, monkeypatch):
    monkeypatch.delenv("UPLOAD_API_KEY")
    response = client.post(
        "/avatar", files=png_file(), headers={"X-Upload-Key": API_KEY}
    )
    assert response.status_code == 401


def test_delete_refuse_sans_cle(client):
    response = client.delete("/avatar/00000000-0000-0000-0000-000000000000.webp")
    assert response.status_code == 401


def test_cycle_complet_avatar(client, tmp_path):
    headers = {"X-Upload-Key": API_KEY}

    upload = client.post("/avatar", files=png_file(), headers=headers)
    assert upload.status_code == 200
    image_path = upload.json()["image_path"]
    assert image_path.endswith(".webp")
    assert main.IMAGE_NAME_REGEX.match(image_path)

    saved = tmp_path / "avatars" / image_path
    assert saved.is_file()
    with Image.open(saved) as img:
        assert img.size == (150, 150)

    # La lecture reste publique
    assert client.get(f"/avatar/{image_path}").status_code == 200

    delete = client.delete(f"/avatar/{image_path}", headers=headers)
    assert delete.status_code == 200
    assert not saved.exists()


def test_upload_refuse_un_fichier_non_image(client):
    files = {"file": ("note.txt", io.BytesIO(b"bonjour"), "text/plain")}
    response = client.post("/lesson", files=files, headers={"X-Upload-Key": API_KEY})
    assert response.status_code == 400


@pytest.mark.parametrize("name", ["..", "photo.png", "../main.py", "a" * 40])
def test_nom_de_fichier_invalide(client, name):
    assert client.get(f"/lesson/{name}").status_code == 404


@pytest.mark.parametrize(
    "raw, expected",
    [
        (None, []),
        ('["http://localhost","http://localhost:3000"]', ["http://localhost", "http://localhost:3000"]),
        ("http://a.com, http://b.com", ["http://a.com", "http://b.com"]),
    ],
)
def test_parse_origins(raw, expected):
    assert main.parse_origins(raw) == expected


def image_file(size, mode="RGB", color="red", fmt="PNG", name="photo.png", exif=None):
    buffer = io.BytesIO()
    image = Image.new(mode, size, color)
    if exif is not None:
        image.save(buffer, format=fmt, exif=exif)
    else:
        image.save(buffer, format=fmt)
    buffer.seek(0)
    mime = {"PNG": "image/png", "JPEG": "image/jpeg"}[fmt]
    return {"file": (name, buffer, mime)}


def upload_lesson(client, files):
    response = client.post("/lesson", files=files, headers={"X-Upload-Key": API_KEY})
    assert response.status_code == 200, response.text
    return response.json()["image_path"]


def test_image_de_lecon_convertie_en_webp_et_reduite(client, tmp_path):
    name = upload_lesson(client, image_file((3200, 1000)))
    assert name.endswith(".webp")
    with Image.open(tmp_path / "lessons" / name) as img:
        assert img.format == "WEBP"
        # Plus grand côté limité, proportions conservées
        assert img.size == (1600, 500)


def test_petite_image_de_lecon_non_agrandie(client, tmp_path):
    name = upload_lesson(client, image_file((300, 200)))
    with Image.open(tmp_path / "lessons" / name) as img:
        assert img.size == (300, 200)


def test_transparence_conservee(client, tmp_path):
    name = upload_lesson(client, image_file((100, 100), mode="RGBA", color=(255, 0, 0, 0)))
    with Image.open(tmp_path / "lessons" / name) as img:
        assert img.mode == "RGBA"
        assert img.getpixel((50, 50))[3] == 0


def test_orientation_exif_appliquee(client, tmp_path):
    exif = Image.Exif()
    exif[0x0112] = 6  # photo prise de côté : rotation de 90°
    files = image_file((400, 200), fmt="JPEG", name="photo.jpg", exif=exif.tobytes())
    name = upload_lesson(client, files)
    with Image.open(tmp_path / "lessons" / name) as img:
        assert img.size == (200, 400)


def test_liste_des_images_de_lecon(client):
    assert client.get("/lesson").status_code == 401
    assert client.get("/lesson", headers={"X-Upload-Key": API_KEY}).json() == {"images": []}

    name = upload_lesson(client, image_file((50, 50)))
    images = client.get("/lesson", headers={"X-Upload-Key": API_KEY}).json()["images"]
    assert [image["name"] for image in images] == [name]
    assert images[0]["modified_at"] > 0


# ---------------------------------------------------------------------------
# Audio des dictées
# ---------------------------------------------------------------------------

def audio_file(content=b"\x1a\x45\xdf\xa3" + b"\x00" * 200, name="dictee.webm", mime="audio/webm"):
    return {"file": (name, io.BytesIO(content), mime)}


def wav_bytes(size=1000):
    data = b"\x00" * size
    return b"RIFF" + (36 + size).to_bytes(4, "little") + b"WAVE" + data


def upload_audio(client, files):
    return client.post("/dictation", files=files, headers={"X-Upload-Key": API_KEY})


def test_audio_refuse_sans_cle(client):
    assert client.post("/dictation", files=audio_file()).status_code == 401


@pytest.mark.parametrize(
    "content, extension",
    [
        (b"\x1a\x45\xdf\xa3" + b"\x00" * 100, "webm"),
        (b"OggS" + b"\x00" * 100, "ogg"),
        (b"ID3" + b"\x00" * 100, "mp3"),
        (b"\xff\xfb\x90\x00" + b"\x00" * 100, "mp3"),
        (b"\x00\x00\x00\x20ftypM4A " + b"\x00" * 100, "m4a"),
        (wav_bytes(100), "wav"),
    ],
)
def test_audio_reconnu_par_sa_signature(client, tmp_path, content, extension):
    # Le nom et le type annoncés ne comptent pas
    response = upload_audio(client, audio_file(content, "fichier.bin", "application/octet-stream"))
    assert response.status_code == 200
    name = response.json()["image_path"]
    assert name.endswith(f".{extension}")
    # Rangé à part des images
    assert (tmp_path / "audio" / name).read_bytes() == content


def test_audio_refuse_un_autre_contenu(client):
    response = upload_audio(client, audio_file(b"<html>pas un son</html>", "dictee.mp3", "audio/mpeg"))
    assert response.status_code == 415


def test_audio_refuse_un_fichier_vide(client):
    assert upload_audio(client, audio_file(b"")).status_code == 400


def test_audio_refuse_un_fichier_trop_gros(client, monkeypatch):
    monkeypatch.setattr(main, "MAX_AUDIO_SIZE", 50)
    assert upload_audio(client, audio_file(wav_bytes(100))).status_code == 413


def test_audio_servi_avec_son_type(client):
    content = wav_bytes(1000)
    name = upload_audio(client, audio_file(content)).json()["image_path"]
    response = client.get(f"/dictation/{name}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/wav"
    assert response.headers["accept-ranges"] == "bytes"
    assert response.content == content


def test_audio_requete_partielle(client):
    content = wav_bytes(1000)
    name = upload_audio(client, audio_file(content)).json()["image_path"]

    partial = client.get(f"/dictation/{name}", headers={"Range": "bytes=10-19"})
    assert partial.status_code == 206
    assert partial.headers["content-range"] == f"bytes 10-19/{len(content)}"
    assert partial.content == content[10:20]

    open_end = client.get(f"/dictation/{name}", headers={"Range": "bytes=1000-"})
    assert open_end.status_code == 206
    assert open_end.content == content[1000:]

    suffix = client.get(f"/dictation/{name}", headers={"Range": "bytes=-4"})
    assert suffix.content == content[-4:]

    beyond = client.get(f"/dictation/{name}", headers={"Range": f"bytes={len(content)}-"})
    assert beyond.status_code == 416


def test_audio_liste_et_suppression(client):
    name = upload_audio(client, audio_file()).json()["image_path"]

    listing = client.get("/dictation", headers={"X-Upload-Key": API_KEY}).json()["files"]
    assert [f["name"] for f in listing] == [name]
    assert client.get("/dictation").status_code == 401

    assert client.delete(f"/dictation/{name}").status_code == 401
    assert client.delete(f"/dictation/{name}", headers={"X-Upload-Key": API_KEY}).status_code == 200
    assert client.get(f"/dictation/{name}").status_code == 404


def test_audio_nom_invalide(client):
    assert client.get("/dictation/..%2Fsecret.wav").status_code == 404
