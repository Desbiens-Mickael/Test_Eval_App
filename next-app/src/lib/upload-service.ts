import "server-only";

/**
 * Accès au service d'upload d'images (FastAPI) depuis le serveur Next.
 *
 * Le navigateur n'appelle plus directement le service pour l'envoi ou la
 * suppression : il passe par les routes `/api/upload/**`, qui vérifient la
 * session puis transmettent la requête avec la clé partagée `UPLOAD_API_KEY`.
 */

// dictation : audio des dictées (rangé à part des images par le service)
export const UPLOAD_KINDS = ["avatar", "lesson", "dictation"] as const;
export type UploadKind = (typeof UPLOAD_KINDS)[number];

export const isUploadKind = (value: string): value is UploadKind =>
  (UPLOAD_KINDS as readonly string[]).includes(value);

// Noms de fichiers générés par le service : uuid4 + extension
export const IMAGE_NAME_REGEX = /^[0-9a-f-]{36}\.[a-z0-9]{2,5}$/i;

export const getUploadServiceConfig = () => {
  const baseUrl =
    process.env.UPLOAD_API_URL ?? process.env.NEXT_PUBLIC_SERVER_DOMAIN_API;
  const apiKey = process.env.UPLOAD_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "UPLOAD_API_URL (ou NEXT_PUBLIC_SERVER_DOMAIN_API) et UPLOAD_API_KEY doivent être définis."
    );
  }

  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey };
};

/** Supprime une image du service ; une image déjà absente n'est pas une erreur */
export const deleteUploadedImage = async (kind: UploadKind, name: string) => {
  if (!IMAGE_NAME_REGEX.test(name)) return;
  const { baseUrl, apiKey } = getUploadServiceConfig();
  const response = await fetch(`${baseUrl}/${kind}/${name}`, {
    method: "DELETE",
    headers: { "X-Upload-Key": apiKey },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`Suppression de l'image ${name} impossible (${response.status})`);
  }
};

/** Fichiers audio des dictées enregistrés par le service, avec leur date de dépôt */
export const listDictationAudio = async (): Promise<
  { name: string; modifiedAt: Date }[]
> => {
  const { baseUrl, apiKey } = getUploadServiceConfig();
  const response = await fetch(`${baseUrl}/dictation`, {
    headers: { "X-Upload-Key": apiKey },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Liste des fichiers audio impossible (${response.status})`);
  }
  const { files } = (await response.json()) as {
    files: { name: string; modified_at: number }[];
  };
  return files.map((file) => ({
    name: file.name,
    modifiedAt: new Date(file.modified_at * 1000),
  }));
};

/** Images de leçon enregistrées par le service, avec leur date de dépôt */
export const listLessonImages = async (): Promise<
  { name: string; modifiedAt: Date }[]
> => {
  const { baseUrl, apiKey } = getUploadServiceConfig();
  const response = await fetch(`${baseUrl}/lesson`, {
    headers: { "X-Upload-Key": apiKey },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Liste des images impossible (${response.status})`);
  }
  const { images } = (await response.json()) as {
    images: { name: string; modified_at: number }[];
  };
  return images.map((image) => ({
    name: image.name,
    modifiedAt: new Date(image.modified_at * 1000),
  }));
};
