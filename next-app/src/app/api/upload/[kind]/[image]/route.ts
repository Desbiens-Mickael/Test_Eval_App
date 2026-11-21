import { getUsedLessonImagesData } from "@/data/lesson/lesson-images.data";
import { getStudentByIdData } from "@/data/student-data";
import { getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import {
  IMAGE_NAME_REGEX,
  getUploadServiceConfig,
  isUploadKind,
} from "@/lib/upload-service";
import { NextResponse } from "next/server";

// En-têtes du service recopiés dans la réponse (lecture audio par plages comprise)
const FORWARDED_HEADERS = [
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
];

// Le service annonce parfois « text/plain » (ex. WebP) : type déduit de
// l'extension, les noms étant générés par le service lui-même
const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  avif: "image/avif",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  wav: "audio/wav",
  webm: "audio/webm",
};

/**
 * Sert un fichier du service d'upload (avatar, image de leçon, audio de dictée).
 *
 * Le navigateur ne joint jamais le service directement : il passe par cette
 * route, avec une URL relative valable quelle que soit l'adresse de
 * l'application (localhost, IP du réseau local, domaine).
 * Lecture publique, comme sur le service : les noms sont des uuid aléatoires.
 */
export async function GET(
  request: Request,
  { params }: { params: { kind: string; image: string } }
) {
  const { kind, image } = params;
  if (!isUploadKind(kind) || !IMAGE_NAME_REGEX.test(image)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const { baseUrl } = getUploadServiceConfig();
  const range = request.headers.get("range");
  const upstream = await fetch(`${baseUrl}/${kind}/${image}`, {
    headers: range ? { range } : undefined,
    cache: "no-store",
  }).catch(() => null);

  if (!upstream || (!upstream.ok && upstream.status !== 206)) {
    return NextResponse.json(
      { message: "Not found." },
      { status: upstream?.status === 416 ? 416 : 404 }
    );
  }

  const headers = new Headers();
  FORWARDED_HEADERS.forEach((name) => {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  });
  const extension = image.split(".").pop()?.toLowerCase() ?? "";
  headers.set(
    "content-type",
    CONTENT_TYPES[extension] ?? "application/octet-stream"
  );
  headers.set("x-content-type-options", "nosniff");
  // Un nom de fichier n'est jamais réutilisé : le contenu ne change pas
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, { status: upstream.status, headers });
}

/**
 * Supprime une image du service d'upload.
 * - avatar : uniquement l'avatar actuel de l'utilisateur connecté
 * - lesson : professeurs uniquement
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { kind: string; image: string } }
) {
  const { kind, image } = params;
  // L'audio d'une dictée n'est supprimé que par le serveur, quand plus aucun
  // exercice ne l'utilise
  if (!isUploadKind(kind) || kind === "dictation" || !IMAGE_NAME_REGEX.test(image)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const user = await currentUser();
  if (!user?.id) {
    return NextResponse.json(
      { message: "Action non autorisée." },
      { status: 401 }
    );
  }

  if (kind === "lesson" && user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Action non autorisée." },
      { status: 401 }
    );
  }

  // Seule une image qu'aucune leçon n'utilise peut être supprimée ici (envoi
  // abandonné) ; les autres le sont à l'enregistrement de la leçon
  if (kind === "lesson" && (await getUsedLessonImagesData()).has(image.toLowerCase())) {
    return NextResponse.json(
      { message: "Image utilisée par une leçon." },
      { status: 409 }
    );
  }

  if (kind === "avatar") {
    const owner =
      user.role === "STUDENT"
        ? await getStudentByIdData(user.id)
        : await getUserByIdData(user.id);
    if (owner?.image?.split("/").pop() !== image) {
      return NextResponse.json(
        { message: "Action non autorisée." },
        { status: 401 }
      );
    }
  }

  const { baseUrl, apiKey } = getUploadServiceConfig();
  const response = await fetch(`${baseUrl}/${kind}/${image}`, {
    method: "DELETE",
    headers: { "X-Upload-Key": apiKey },
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
