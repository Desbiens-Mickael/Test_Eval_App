/**
 * Règles des exercices d'entraînement.
 *
 * Un entraînement se refait autant de fois que l'élève veut, sans voir la
 * correction. Quand il choisit d'afficher la correction, il ne peut plus
 * faire d'essai : sinon il lui suffirait de recopier les réponses.
 *
 * Module pur, sans accès base de données.
 */

import { toPercent } from "@/lib/student-progress";

export type PracticeAttemptSummary = {
  note: number;
  coeficient: number;
  createdAt: Date;
};

export type PracticeStatus = "not-started" | "in-progress" | "correction-seen";

export type PracticeSummary = {
  status: PracticeStatus;
  attempts: number;
  /** Réussite en %, null sans essai */
  lastPercent: number | null;
  bestPercent: number | null;
  lastAttemptAt: string | null;
  correctionSeenAt: string | null;
  /** L'élève peut encore faire un essai */
  canAttempt: boolean;
  /** L'élève peut afficher la correction (au moins un essai fait) */
  canRevealCorrection: boolean;
};

export const summarizePractice = (
  attempts: PracticeAttemptSummary[],
  correctionSeenAt: Date | null
): PracticeSummary => {
  const sorted = [...attempts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const percents = sorted.map((a) => toPercent(a.note, a.coeficient));
  const last = sorted[sorted.length - 1];
  const seen = correctionSeenAt !== null;

  return {
    status: seen ? "correction-seen" : sorted.length > 0 ? "in-progress" : "not-started",
    attempts: sorted.length,
    lastPercent: percents.length ? percents[percents.length - 1] : null,
    bestPercent: percents.length ? Math.max(...percents) : null,
    lastAttemptAt: last ? last.createdAt.toISOString() : null,
    correctionSeenAt: correctionSeenAt ? correctionSeenAt.toISOString() : null,
    canAttempt: !seen,
    canRevealCorrection: !seen && sorted.length > 0,
  };
};
