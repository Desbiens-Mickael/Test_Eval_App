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
