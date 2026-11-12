import { currentUser } from "@/lib/auth";
import { getUploadServiceConfig, isUploadKind } from "@/lib/upload-service";
import { NextResponse } from "next/server";

// Taille maximale d'une image envoyée (5 Mo)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Envoie une image au service d'upload.
 * - avatar : tout utilisateur connecté
 * - lesson : professeurs uniquement
 */
export async function POST(
  request: Request,
  { params }: { params: { kind: string } }
) {
  const { kind } = params;
  if (!isUploadKind(kind)) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const user = await currentUser();
  if (!user?.id || (kind === "lesson" && user.role !== "ADMIN")) {
    return NextResponse.json(
      { message: "Action non autorisée." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: "Aucun fichier à uploader." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { message: "Image trop volumineuse (5 Mo maximum)." },
      { status: 413 }
    );
  }

  const { baseUrl, apiKey } = getUploadServiceConfig();
  const body = new FormData();
  body.append("file", file, file.name);

  const response = await fetch(`${baseUrl}/${kind}`, {
    method: "POST",
    headers: { "X-Upload-Key": apiKey },
    body,
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
