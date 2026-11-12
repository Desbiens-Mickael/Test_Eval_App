import "server-only";

/**
 * Accès au service d'upload d'images (FastAPI) depuis le serveur Next.
 *
 * Le navigateur n'appelle plus directement le service pour l'envoi ou la
 * suppression : il passe par les routes `/api/upload/**`, qui vérifient la
 * session puis transmettent la requête avec la clé partagée `UPLOAD_API_KEY`.
 */

export const UPLOAD_KINDS = ["avatar", "lesson"] as const;
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
