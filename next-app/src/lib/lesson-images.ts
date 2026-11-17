// Repérage des images utilisées par une leçon : bannière et contenu.
// Fonctions pures, sans accès au réseau ni à la base.

// Nom d'une image de leçon dans une URL : …/lesson/<uuid>.<extension>
const LESSON_IMAGE_IN_URL = /\/lesson\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]{2,5})/gi;

/**
 * Noms des images de leçon référencées par une bannière et un contenu Tiptap.
 * Le contenu est parcouru en entier (images dans des colonnes, tableaux…),
 * quel que soit le domaine de l'URL (navigateur ou serveur).
 */
export const lessonImageNames = (lesson: {
  imageBanner?: string | null;
  content?: unknown;
}): Set<string> => {
  const text = `${lesson.imageBanner ?? ""} ${
    typeof lesson.content === "string" ? lesson.content : JSON.stringify(lesson.content ?? null)
  }`;
  return new Set(Array.from(text.matchAll(LESSON_IMAGE_IN_URL), (match) => match[1].toLowerCase()));
};

/** Images de `before` absentes de `after` */
export const removedImages = (before: Set<string>, after: Set<string>) =>
  new Set(Array.from(before).filter((name) => !after.has(name)));

/**
 * Images orphelines à supprimer : déposées depuis plus longtemps que le délai
 * de grâce (le temps de finir la leçon en cours d'écriture) et utilisées par
 * aucune leçon.
 */
export const orphanImages = (
  stored: { name: string; modifiedAt: Date }[],
  used: Set<string>,
  { now, graceMs }: { now: Date; graceMs: number }
) =>
  stored
    .filter((image) => !used.has(image.name.toLowerCase()))
    .filter((image) => now.getTime() - image.modifiedAt.getTime() > graceMs)
    .map((image) => image.name);
