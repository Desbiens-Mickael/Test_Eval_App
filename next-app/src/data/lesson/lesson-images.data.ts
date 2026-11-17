// Couche d'accès aux données : uniquement côté serveur.
import "server-only";

import { getAllLessonImageSourcesData } from "@/data/lesson/lesson-data";
import { lessonImageNames, orphanImages } from "@/lib/lesson-images";
import { deleteUploadedImage, listLessonImages } from "@/lib/upload-service";

/** Délai avant qu'une image non utilisée soit considérée comme orpheline */
export const ORPHAN_GRACE_MS = 24 * 60 * 60 * 1000;
/** Intervalle minimal entre deux balayages des images orphelines */
const SWEEP_INTERVAL_MS = 60 * 60 * 1000;

let lastSweepAt = 0;

/** Toutes les images utilisées par au moins une leçon */
export const getUsedLessonImagesData = async () => {
  const lessons = await getAllLessonImageSourcesData();
  const used = new Set<string>();
  lessons.forEach((lesson) => lessonImageNames(lesson).forEach((name) => used.add(name)));
  return used;
};

/**
 * Supprime les images candidates qu'aucune leçon n'utilise plus
 * (après la modification ou la suppression d'une leçon).
 * Renvoie les images supprimées.
 */
export const deleteUnusedLessonImagesData = async (candidates: Set<string>) => {
  if (candidates.size === 0) return [];
  const used = await getUsedLessonImagesData();
  const toDelete = Array.from(candidates).filter((name) => !used.has(name));
  await Promise.all(toDelete.map((name) => deleteUploadedImage("lesson", name)));
  return toDelete;
};

/**
 * Supprime les images de leçon orphelines : déposées puis jamais enregistrées
 * dans une leçon (onglet fermé, envoi interrompu…), après un délai de grâce.
 */
export const sweepOrphanLessonImagesData = async (now: Date = new Date()) => {
  const [stored, used] = await Promise.all([listLessonImages(), getUsedLessonImagesData()]);
  const orphans = orphanImages(stored, used, { now, graceMs: ORPHAN_GRACE_MS });
  await Promise.all(orphans.map((name) => deleteUploadedImage("lesson", name)));
  return orphans;
};

/**
 * Nettoyage sans risque pour l'action appelante : erreurs journalisées,
 * balayage des orphelines au plus une fois par heure.
 */
export const cleanUpLessonImagesSafeData = async (candidates: Set<string> = new Set()) => {
  try {
    await deleteUnusedLessonImagesData(candidates);
    const now = Date.now();
    if (now - lastSweepAt > SWEEP_INTERVAL_MS) {
      lastSweepAt = now;
      await sweepOrphanLessonImagesData(new Date(now));
    }
  } catch (error) {
    console.error("Nettoyage des images de leçon :", error);
  }
};
