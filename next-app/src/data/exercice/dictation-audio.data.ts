// Couche d'accès aux données : uniquement côté serveur.
import "server-only";

import { prisma } from "@/lib/db";
import { orphanImages } from "@/lib/lesson-images";
import { deleteUploadedImage, listDictationAudio } from "@/lib/upload-service";
import { DICTATION_TYPE } from "@/shema-zod/exercice.shema";

/** Délai avant qu'un audio non utilisé soit considéré comme orphelin */
export const ORPHAN_AUDIO_GRACE_MS = 24 * 60 * 60 * 1000;
/** Intervalle minimal entre deux balayages des fichiers audio orphelins */
const SWEEP_INTERVAL_MS = 60 * 60 * 1000;

let lastSweepAt = 0;

/** Nom du fichier audio d'un contenu de dictée, s'il y en a un */
export const dictationAudioName = (content: unknown): string | null => {
  const audio = (content as { audio?: unknown } | null)?.audio;
  return typeof audio === "string" && audio ? audio.toLowerCase() : null;
};

/** Fichiers audio des dictées parmi ces exercices */
export const getDictationAudioOfExercicesData = async (exerciceIds: string[]) => {
  const exercices = await prisma.exercice.findMany({
    where: { id: { in: exerciceIds }, type: { name: DICTATION_TYPE } },
    select: { content: true },
  });
  return new Set(
    exercices.map((e) => dictationAudioName(e.content)).filter((n): n is string => n !== null)
  );
};

/** Tous les fichiers audio utilisés par au moins une dictée */
export const getUsedDictationAudioData = async () => {
  const exercices = await prisma.exercice.findMany({
    where: { type: { name: DICTATION_TYPE } },
    select: { content: true },
  });
  return new Set(
    exercices.map((e) => dictationAudioName(e.content)).filter((n): n is string => n !== null)
  );
};

/** Supprime les fichiers candidats qu'aucune dictée n'utilise plus */
export const deleteUnusedDictationAudioData = async (candidates: Set<string>) => {
  if (candidates.size === 0) return [];
  const used = await getUsedDictationAudioData();
  const toDelete = Array.from(candidates).filter((name) => !used.has(name));
  await Promise.all(toDelete.map((name) => deleteUploadedImage("dictation", name)));
  return toDelete;
};

/**
 * Supprime les fichiers audio orphelins : déposés puis jamais enregistrés
 * dans une dictée (formulaire abandonné, leçon supprimée…), après un délai de grâce.
 */
export const sweepOrphanDictationAudioData = async (now: Date = new Date()) => {
  const [stored, used] = await Promise.all([listDictationAudio(), getUsedDictationAudioData()]);
  const orphans = orphanImages(stored, used, { now, graceMs: ORPHAN_AUDIO_GRACE_MS });
  await Promise.all(orphans.map((name) => deleteUploadedImage("dictation", name)));
  return orphans;
};

/**
 * Nettoyage sans risque pour l'action appelante : erreurs journalisées,
 * balayage des orphelins au plus une fois par heure.
 */
export const cleanUpDictationAudioSafeData = async (candidates: Set<string> = new Set()) => {
  try {
    await deleteUnusedDictationAudioData(candidates);
    const now = Date.now();
    if (now - lastSweepAt > SWEEP_INTERVAL_MS) {
      lastSweepAt = now;
      await sweepOrphanDictationAudioData(new Date(now));
    }
  } catch (error) {
    console.error("Nettoyage de l'audio des dictées :", error);
  }
};
