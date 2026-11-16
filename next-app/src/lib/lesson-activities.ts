/**
 * Exercices et contrôles d'une leçon, vus par l'élève.
 *
 * Module pur, sans accès base de données.
 */

import { areResultsVisible, getControlStatus } from "@/lib/control-period";
import { PracticeSummary, summarizePractice } from "@/lib/practice";

type Row = {
  id: string;
  title: string;
  kind: "CONTROL" | "PRACTICE";
  opensAt: Date | null;
  closesAt: Date | null;
  level: { label: string; color: string };
  type: { name: string };
  practiceAttempts: { note: number; coeficient: number; createdAt: Date }[];
  practiceCorrections: { revealedAt: Date }[];
  studentExercices: {
    id: string;
    note: number;
    coeficient: number;
    isMissing: boolean;
  }[];
};

type Base = {
  id: string;
  title: string;
  level: string;
  levelColor: string;
  type: string;
};

export type LessonPractice = Base & { summary: PracticeSummary };

/**
 * - UPCOMING : pas encore ouvert
 * - TODO : ouvert, copie pas encore rendue
 * - DONE : copie rendue (ou non rendue à la clôture, voir `isMissing`)
 * - CLOSED : clos sans copie (la copie notée 0 arrive à la clôture)
 */
export type LessonControlStatus = "UPCOMING" | "TODO" | "DONE" | "CLOSED";

export type LessonControl = Base & {
  status: LessonControlStatus;
  opensAt: Date | null;
  closesAt: Date | null;
  studentExerciceId: string | null;
  /** null tant que la note est cachée (contrôle pas encore clos) */
  note: number | null;
  coeficient: number | null;
  isMissing: boolean;
  /** La correction peut être ouverte */
  canSeeCorrection: boolean;
};

export type LessonActivities = {
  practices: LessonPractice[];
  controls: LessonControl[];
};

export const buildLessonActivities = (
  rows: Row[],
  now: Date = new Date()
): LessonActivities => {
  const practices: LessonPractice[] = [];
  const controls: LessonControl[] = [];

  for (const row of rows) {
    const base: Base = {
      id: row.id,
      title: row.title,
      level: row.level.label,
      levelColor: row.level.color,
      type: row.type.name,
    };

    if (row.kind === "PRACTICE") {
      practices.push({
        ...base,
        summary: summarizePractice(
          row.practiceAttempts,
          row.practiceCorrections[0]?.revealedAt ?? null
        ),
      });
      continue;
    }

    const copy = row.studentExercices[0];
    const visible = areResultsVisible({ closesAt: row.closesAt }, now);
    const period = getControlStatus(row, now);

    controls.push({
      ...base,
      status: copy ? "DONE" : period === "OPEN" ? "TODO" : period,
      opensAt: row.opensAt,
      closesAt: row.closesAt,
      studentExerciceId: copy?.id ?? null,
      note: copy && visible ? copy.note : null,
      coeficient: copy?.coeficient ?? null,
      isMissing: copy?.isMissing ?? false,
      canSeeCorrection: !!copy && visible,
    });
  }

  return { practices, controls };
};
