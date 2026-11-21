// Adresse des fichiers du service d'upload (images, audio des dictées).
//
// Le navigateur ne parle jamais directement au service : les fichiers sont
// servis par l'application elle-même (route `/api/upload/<type>/<nom>`), avec
// une URL relative. Elle marche donc quelle que soit l'adresse utilisée pour
// ouvrir l'application (localhost, IP du réseau local, nom de domaine…).

export type MediaKind = "avatar" | "lesson" | "dictation";

/** URL d'un fichier déposé sur le service d'upload, vue par le navigateur */
export const mediaUrl = (kind: MediaKind, name: string) =>
  `/api/upload/${kind}/${encodeURIComponent(name)}`;
