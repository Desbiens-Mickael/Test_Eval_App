/**
 * Progression d'un élève : réussite par matière, historique et badges.
 *
 * Module pur (aucun accès base de données). Les résultats sont exprimés en
 * pourcentage de réussite (note / barème), plus parlant pour un élève qu'une
 * note sur 20.
 *
 * Les badges ne sont pas stockés : ils sont recalculés à partir de l'historique.
 * La date d'obtention est celle de la copie qui a rempli la condition.
 */

import { parisParts } from "@/lib/teacher-dashboard";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Nombre de résultats comparés pour la tendance récente */
export const TREND_WINDOW = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProgressResultInput = {
  id: string;
  exerciceId: string | null;
  exerciceTitle: string | null;
  subject: string;
  note: number;
  coeficient: number;
  createdAt: Date;
};

export type ProgressInput = {
  results: ProgressResultInput[];
  /** Exercices attribués au groupe de l'élève */
  assigned: { id: string; subject: string }[];
  /** Couleur (classe Tailwind) de chaque matière, par libellé */
  subjectColors: Record<string, string>;
};

export type BadgeIcon =
  | "footprints"
  | "rocket"
  | "mountain"
  | "star"
  | "sparkles"
  | "compass"
  | "calendar"
  | "crown"
  | "trending-up";

export type ProgressBadge = {
  id: string;
  title: string;
  description: string;
  icon: BadgeIcon;
  /** Date ISO d'obtention, null si pas encore obtenu */
  earnedAt: string | null;
  /** Avancement vers le badge, quand il se mesure */
  progress: { current: number; target: number } | null;
};

export type StudentProgress = {
  summary: {
    /** Réussite moyenne en %, null sans résultat */
    successRate: number | null;
    done: number;
    assigned: number;
    assignedDone: number;
    completionRate: number | null;
    /** Moyenne des derniers résultats et de ceux d'avant (tendance) */
    recentRate: number | null;
    previousRate: number | null;
    perfect: number;
  };
  bySubject: {
    subject: string;
    color: string | null;
    successRate: number | null;
    best: number | null;
    done: number;
    assigned: number;
    assignedDone: number;
  }[];
  /** Tous les résultats, du plus ancien au plus récent */
  history: {
    id: string;
    title: string;
    subject: string;
    color: string | null;
    percent: number;
    note: number;
    coeficient: number;
    createdAt: string;
  }[];
  badges: ProgressBadge[];
};

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

/** Pourcentage de réussite d'une copie, entier entre 0 et 100 */
export const toPercent = (note: number, coeficient: number) =>
  coeficient > 0
    ? Math.min(100, Math.max(0, Math.round((note / coeficient) * 100)))
    : 0;

const average = (values: number[]) =>
  values.length === 0
    ? null
    : Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

/** Numéro de la semaine (lundi → dimanche, fuseau Europe/Paris) */
const weekIndex = (date: Date) => {
  const { year, month, day, weekday } = parisParts(date);
  const monday = Date.UTC(year, month - 1, day) - weekday * DAY_MS;
  return Math.round(monday / (7 * DAY_MS));
};

/** Plus longue suite de semaines consécutives avec au moins un exercice */
export const longestWeekStreak = (dates: Date[]) => {
  const weeks = Array.from(new Set(dates.map(weekIndex))).sort((a, b) => a - b);
  let best = 0;
  let current = 0;
  weeks.forEach((week, i) => {
    current = i > 0 && week === weeks[i - 1] + 1 ? current + 1 : 1;
    best = Math.max(best, current);
  });
  return best;
};

// ---------------------------------------------------------------------------
// Badges
// ---------------------------------------------------------------------------

type ScoredResult = ProgressResultInput & { percent: number };

type HistoryStats = {
  count: number;
  perfect: number;
  subjects: number;
  weekStreak: number;
  /** Meilleure réussite moyenne d'une matière comptant au moins 5 copies */
  bestSubjectRate: number | null;
  /** Écart entre les 3 dernières copies et les 3 précédentes */
  improvement: number | null;
};

const statsOf = (results: ScoredResult[]): HistoryStats => {
  const bySubject = new Map<string, number[]>();
  results.forEach((r) =>
    bySubject.set(r.subject, [...(bySubject.get(r.subject) ?? []), r.percent])
  );
  const subjectRates = Array.from(bySubject.values())
    .filter((scores) => scores.length >= 5)
    .map((scores) => average(scores) ?? 0);

  const last = average(results.slice(-3).map((r) => r.percent));
  const before =
    results.length >= 6 ? average(results.slice(-6, -3).map((r) => r.percent)) : null;

  return {
    count: results.length,
    perfect: results.filter((r) => r.percent === 100).length,
    subjects: bySubject.size,
    weekStreak: longestWeekStreak(results.map((r) => r.createdAt)),
    bestSubjectRate: subjectRates.length ? Math.max(...subjectRates) : null,
    improvement: last !== null && before !== null ? last - before : null,
  };
};

type BadgeDefinition = Omit<ProgressBadge, "earnedAt" | "progress"> & {
  isEarned: (stats: HistoryStats) => boolean;
  progress?: (stats: HistoryStats) => { current: number; target: number };
};

const countBadge = (
  target: number,
  metric: (stats: HistoryStats) => number
): Pick<BadgeDefinition, "isEarned" | "progress"> => ({
  isEarned: (stats) => metric(stats) >= target,
  progress: (stats) => ({ current: Math.min(target, metric(stats)), target }),
});

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "premier-pas",
    title: "Premier pas",
    description: "Faire ton premier exercice",
    icon: "footprints",
    ...countBadge(1, (s) => s.count),
  },
  {
    id: "bien-lance",
    title: "Bien lancé",
    description: "Faire 10 exercices",
    icon: "rocket",
    ...countBadge(10, (s) => s.count),
  },
  {
    id: "marathonien",
    title: "Marathonien",
    description: "Faire 30 exercices",
    icon: "mountain",
    ...countBadge(30, (s) => s.count),
  },
  {
    id: "sans-faute",
    title: "Sans faute",
    description: "Réussir un exercice à 100 %",
    icon: "star",
    ...countBadge(1, (s) => s.perfect),
  },
  {
    id: "perfectionniste",
    title: "Perfectionniste",
    description: "Réussir 5 exercices à 100 %",
    icon: "sparkles",
    ...countBadge(5, (s) => s.perfect),
  },
  {
    id: "explorateur",
    title: "Explorateur",
    description: "Faire des exercices dans 3 matières différentes",
    icon: "compass",
    ...countBadge(3, (s) => s.subjects),
  },
  {
    id: "regulier",
    title: "Régulier",
    description: "Travailler 3 semaines de suite",
    icon: "calendar",
    ...countBadge(3, (s) => s.weekStreak),
  },
  {
    id: "specialiste",
    title: "Spécialiste",
    description: "Avoir 80 % de réussite dans une matière (au moins 5 exercices)",
    icon: "crown",
    isEarned: (s) => s.bestSubjectRate !== null && s.bestSubjectRate >= 80,
  },
  {
    id: "en-progres",
    title: "En progrès",
    description: "Gagner 15 points sur tes 3 derniers exercices par rapport aux 3 d'avant",
    icon: "trending-up",
    isEarned: (s) => s.improvement !== null && s.improvement >= 15,
  },
];

/**
 * Rejoue l'historique copie par copie : un badge est obtenu à la première
 * copie qui remplit sa condition, et le reste ensuite.
 */
export const computeBadges = (results: ScoredResult[]): ProgressBadge[] => {
  const earnedAt = new Map<string, string>();
  for (let i = 0; i < results.length; i++) {
    const remaining = BADGE_DEFINITIONS.filter((b) => !earnedAt.has(b.id));
    if (remaining.length === 0) break;
    const stats = statsOf(results.slice(0, i + 1));
    remaining.forEach((badge) => {
      if (badge.isEarned(stats)) {
        earnedAt.set(badge.id, results[i].createdAt.toISOString());
      }
    });
  }

  const finalStats = statsOf(results);
  return BADGE_DEFINITIONS.map(({ isEarned, progress, ...badge }) => ({
    ...badge,
    earnedAt: earnedAt.get(badge.id) ?? null,
    progress: progress ? progress(finalStats) : null,
  }));
};

// ---------------------------------------------------------------------------
// Calcul principal
// ---------------------------------------------------------------------------

export const buildStudentProgress = (input: ProgressInput): StudentProgress => {
  const results: ScoredResult[] = [...input.results]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((r) => ({ ...r, percent: toPercent(r.note, r.coeficient) }));
  const colorOf = (subject: string) => input.subjectColors[subject] ?? null;

  // Une copie par exercice : on ne compte que les exercices attribués faits
  const doneExerciceIds = new Set(
    results.map((r) => r.exerciceId).filter((id): id is string => id !== null)
  );
  const assignedDone = input.assigned.filter((e) => doneExerciceIds.has(e.id));

  // --- Par matière (matières travaillées + matières attribuées) -------------
  const subjects = new Set([
    ...results.map((r) => r.subject),
    ...input.assigned.map((e) => e.subject),
  ]);
  const bySubject = Array.from(subjects)
    .map((subject) => {
      const scores = results.filter((r) => r.subject === subject).map((r) => r.percent);
      return {
        subject,
        color: colorOf(subject),
        successRate: average(scores),
        best: scores.length ? Math.max(...scores) : null,
        done: scores.length,
        assigned: input.assigned.filter((e) => e.subject === subject).length,
        assignedDone: assignedDone.filter((e) => e.subject === subject).length,
      };
    })
    .sort((a, b) => a.subject.localeCompare(b.subject, "fr"));

  const percents = results.map((r) => r.percent);
  const recent = percents.slice(-TREND_WINDOW);
  const previous = percents.slice(-2 * TREND_WINDOW, -TREND_WINDOW);

  return {
    summary: {
      successRate: average(percents),
      done: results.length,
      assigned: input.assigned.length,
      assignedDone: assignedDone.length,
      completionRate:
        input.assigned.length > 0 ? assignedDone.length / input.assigned.length : null,
      recentRate: previous.length >= 3 ? average(recent) : null,
      previousRate: previous.length >= 3 ? average(previous) : null,
      perfect: percents.filter((p) => p === 100).length,
    },
    bySubject,
    history: results.map((r) => ({
      id: r.id,
      title: r.exerciceTitle ?? "Exercice supprimé",
      subject: r.subject,
      color: colorOf(r.subject),
      percent: r.percent,
      note: r.note,
      coeficient: r.coeficient,
      createdAt: r.createdAt.toISOString(),
    })),
    badges: computeBadges(results),
  };
};
