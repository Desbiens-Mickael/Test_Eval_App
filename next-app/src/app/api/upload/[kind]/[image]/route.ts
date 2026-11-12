import { getStudentByIdData } from "@/data/student-data";
import { getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import {
  IMAGE_NAME_REGEX,
  getUploadServiceConfig,
  isUploadKind,
} from "@/lib/upload-service";
import { NextResponse } from "next/server";

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
  if (!isUploadKind(kind) || !IMAGE_NAME_REGEX.test(image)) {
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
