/**
 * Suivi des entraînements d'un élève, pour son professeur.
 *
 * Pour chaque exercice d'entraînement attribué au groupe de l'élève : la
 * courbe des essais (réussite en %, essai après essai), le nombre d'essais
 * et si la correction a été vue. Module pur, sans accès base de données.
 */

import { toPercent } from "@/lib/student-progress";

export type TrackingExerciseInput = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string | null;
  type: string;
  attempts: { note: number; coeficient: number; createdAt: Date }[];
  correctionSeenAt: Date | null;
};

export type TrackedPractice = {
  id: string;
  title: string;
  subject: string;
  subjectColor: string | null;
  type: string;
  status: "not-started" | "in-progress" | "correction-seen";
  /** Essais dans l'ordre chronologique (n = numéro de l'essai) */
  attempts: { n: number; percent: number; createdAt: string }[];
  firstPercent: number | null;
  lastPercent: number | null;
  bestPercent: number | null;
  /** Points gagnés entre le premier et le dernier essai */
  progress: number | null;
  lastAttemptAt: string | null;
  correctionSeenAt: string | null;
};

export type PracticeTracking = {
  summary: {
    assigned: number;
    started: number;
    finished: number;
    totalAttempts: number;
  };
  exercises: TrackedPractice[];
};

export const buildPracticeTracking = (exercises: TrackingExerciseInput[]): PracticeTracking => {
  const tracked = exercises.map((exercise): TrackedPractice => {
    const attempts = [...exercise.attempts]
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((a, i) => ({
        n: i + 1,
        percent: toPercent(a.note, a.coeficient),
        createdAt: a.createdAt.toISOString(),
      }));
    const percents = attempts.map((a) => a.percent);
    const first = percents.length ? percents[0] : null;
    const last = percents.length ? percents[percents.length - 1] : null;

    return {
      id: exercise.id,
      title: exercise.title,
      subject: exercise.subject,
      subjectColor: exercise.subjectColor,
      type: exercise.type,
      status: exercise.correctionSeenAt
        ? "correction-seen"
        : attempts.length > 0
          ? "in-progress"
          : "not-started",
      attempts,
      firstPercent: first,
      lastPercent: last,
      bestPercent: percents.length ? Math.max(...percents) : null,
      progress: first !== null && last !== null && attempts.length > 1 ? last - first : null,
      lastAttemptAt: attempts.length ? attempts[attempts.length - 1].createdAt : null,
      correctionSeenAt: exercise.correctionSeenAt?.toISOString() ?? null,
    };
  });

  // Les plus récemment travaillés d'abord, puis ceux pas encore commencés
  tracked.sort((a, b) => {
    if (a.lastAttemptAt && b.lastAttemptAt) return b.lastAttemptAt.localeCompare(a.lastAttemptAt);
    if (a.lastAttemptAt) return -1;
    if (b.lastAttemptAt) return 1;
    return a.title.localeCompare(b.title, "fr");
  });

  return {
    summary: {
      assigned: tracked.length,
      started: tracked.filter((e) => e.attempts.length > 0).length,
      finished: tracked.filter((e) => e.status === "correction-seen").length,
      totalAttempts: tracked.reduce((sum, e) => sum + e.attempts.length, 0),
    },
    exercises: tracked,
  };
};
