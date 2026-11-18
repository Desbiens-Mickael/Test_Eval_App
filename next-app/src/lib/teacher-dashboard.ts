/**
 * Calculs du tableau de bord professeur.
 *
 * Module pur (aucun accès base de données) : il reçoit les données brutes du
 * professeur et produit tous les indicateurs affichés. Toutes les notes sont
 * ramenées sur 20 pour être comparables, quel que soit le coefficient.
 */

export const DASHBOARD_PERIODS = ["7", "30", "90", "tout"] as const;
export type DashboardPeriod = (typeof DASHBOARD_PERIODS)[number];

export const isDashboardPeriod = (value: unknown): value is DashboardPeriod =>
  typeof value === "string" &&
  (DASHBOARD_PERIODS as readonly string[]).includes(value);

const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = "Europe/Paris";

// Seuils des alertes "élèves à accompagner"
export const LOW_AVERAGE_THRESHOLD = 10; // moyenne /20
export const DECLINE_THRESHOLD = 4; // points /20 perdus
export const INACTIVITY_DAYS = 14;

// ---------------------------------------------------------------------------
// Types d'entrée
// ---------------------------------------------------------------------------

export type DashboardGroupInput = {
  id: string;
  name: string;
  studentIds: string[];
  exerciceIds: string[];
};

export type DashboardStudentInput = {
  id: string;
  name: string;
  image: string | null;
  groupId: string | null;
};

export type DashboardResultInput = {
  id: string;
  studentId: string;
  exerciceId: string | null;
  exerciceTitle: string | null;
  subject: string;
  note: number;
  coeficient: number;
  createdAt: Date;
};

/** Réponse libre rendue, pas encore notée par le professeur */
export type DashboardToReviewInput = {
  id: string;
  studentId: string;
  exerciceId: string | null;
  exerciceTitle: string | null;
  createdAt: Date;
};

export type DashboardInput = {
  now: Date;
  period: DashboardPeriod;
  groupId: string | null;
  groups: DashboardGroupInput[];
  students: DashboardStudentInput[];
  results: DashboardResultInput[];
  /** Copies à corriger : comptées comme rendues, mais sans note */
  toReview?: DashboardToReviewInput[];
};

// ---------------------------------------------------------------------------
// Types de sortie
// ---------------------------------------------------------------------------

export type StudentAlertReason = "low-average" | "declining" | "inactive";

export type TeacherDashboard = {
  period: DashboardPeriod;
  groupId: string | null;
  summary: {
    average: number | null;
    previousAverage: number | null;
    submissions: number;
    previousSubmissions: number | null;
    completionRate: number | null;
    assigned: number;
    done: number;
    activeStudents: number;
    totalStudents: number;
    studentsToHelp: number;
  };
  /** Copies rendues par semaine sur les 12 dernières semaines (tendance) */
  weeklyTrend: { start: string; count: number }[];
  activity: {
    unit: "day" | "week" | "month";
    buckets: {
      key: string;
      label: string;
      count: number;
      average: number | null;
    }[];
  };
  distribution: { label: string; min: number; max: number; count: number }[];
  bySubject: { subject: string; average: number; count: number }[];
  groups: {
    id: string;
    name: string;
    studentCount: number;
    exerciceCount: number;
    assigned: number;
    done: number;
    completionRate: number | null;
    average: number | null;
  }[];
  studentsToHelp: {
    id: string;
    name: string;
    image: string | null;
    groupName: string | null;
    average: number | null;
    recentAverage: number | null;
    lastActivity: string | null;
    pending: number;
    reasons: StudentAlertReason[];
  }[];
  hardestExercises: {
    exerciceId: string;
    title: string;
    subject: string;
    average: number;
    count: number;
  }[];
  /** Réponses libres à corriger, de la plus ancienne à la plus récente */
  toReview: {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    createdAt: string;
  }[];
  recent: {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    subject: string;
    note: number;
    coeficient: number;
    score: number;
    createdAt: string;
  }[];
  /** Nombre de copies par jour de la semaine (lundi = 0) et moment de la journée */
  rhythm: { day: number; slot: number; count: number }[];
};

export const RHYTHM_DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const RHYTHM_SLOTS = [
  { label: "Matin", hint: "6 h – 12 h" },
  { label: "Après-midi", hint: "12 h – 17 h" },
  { label: "Soir", hint: "17 h – 21 h" },
  { label: "Nuit", hint: "21 h – 6 h" },
];

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

/** Note ramenée sur 20, arrondie à 0,1 */
export const toScore20 = (note: number, coeficient: number) =>
  coeficient > 0 ? Math.round((note / coeficient) * 200) / 10 : 0;

const round1 = (value: number) => Math.round(value * 10) / 10;

const average = (values: number[]) =>
  values.length === 0
    ? null
    : round1(values.reduce((sum, v) => sum + v, 0) / values.length);

const periodDays = (period: DashboardPeriod) =>
  period === "tout" ? null : Number(period);

const parisFormatter = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  weekday: "short",
});

const WEEKDAY_INDEX: Record<string, number> = {
  lun: 0,
  mar: 1,
  mer: 2,
  jeu: 3,
  ven: 4,
  sam: 5,
  dim: 6,
};

/** Date décomposée dans le fuseau du professeur (Europe/Paris) */
export const parisParts = (date: Date) => {
  const parts = Object.fromEntries(
    parisFormatter.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    weekday: WEEKDAY_INDEX[parts.weekday.replace(".", "").toLowerCase()] ?? 0,
  };
};

/** Clé de jour "AAAA-MM-JJ" dans le fuseau Europe/Paris */
const dayKey = (date: Date) => {
  const { year, month, day } = parisParts(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

/** Jour calendaire (UTC midi) correspondant à une clé "AAAA-MM-JJ" */
const keyToDate = (key: string) => new Date(`${key}T12:00:00Z`);

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * DAY_MS);

/** Lundi de la semaine contenant ce jour (clé "AAAA-MM-JJ") */
const weekKey = (date: Date) => {
  const key = keyToDate(dayKey(date));
  const weekday = (key.getUTCDay() + 6) % 7;
  return addDays(key, -weekday).toISOString().slice(0, 10);
};

const monthKey = (date: Date) => dayKey(date).slice(0, 7);

const SHORT_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const MONTH_LABEL = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

const timeSlot = (hour: number) => {
  if (hour >= 6 && hour < 12) return 0;
  if (hour >= 12 && hour < 17) return 1;
  if (hour >= 17 && hour < 21) return 2;
  return 3;
};

// ---------------------------------------------------------------------------
// Calcul principal
// ---------------------------------------------------------------------------

export const buildTeacherDashboard = (
  input: DashboardInput
): TeacherDashboard => {
  const { now, period } = input;
  const days = periodDays(period);
  const periodStart = days === null ? null : addDays(now, -days);
  const previousStart = days === null ? null : addDays(now, -2 * days);

  // Périmètre : tous les groupes ou un seul
  const scopedGroups = input.groupId
    ? input.groups.filter((g) => g.id === input.groupId)
    : input.groups;
  const scopedStudentIds = new Set(
    input.groupId
      ? scopedGroups.flatMap((g) => g.studentIds)
      : input.students.map((s) => s.id)
  );
  const students = input.students.filter((s) => scopedStudentIds.has(s.id));
  const studentById = new Map(students.map((s) => [s.id, s]));
  const groupById = new Map(input.groups.map((g) => [g.id, g]));

  const allResults = input.results
    .filter((r) => scopedStudentIds.has(r.studentId))
    .map((r) => ({ ...r, score: toScore20(r.note, r.coeficient) }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const inPeriod = periodStart
    ? allResults.filter((r) => r.createdAt >= periodStart && r.createdAt <= now)
    : allResults.filter((r) => r.createdAt <= now);
  const inPreviousPeriod =
    periodStart && previousStart
      ? allResults.filter(
          (r) => r.createdAt >= previousStart && r.createdAt < periodStart
        )
      : null;

  // Copies à corriger : rendues (elles comptent dans la complétion) mais sans note
  const toReview = (input.toReview ?? [])
    .filter((r) => scopedStudentIds.has(r.studentId))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // --- Complétion (état cumulé, indépendant de la période) -----------------
  const doneKeys = new Set(
    [...allResults, ...toReview]
      .filter((r) => r.exerciceId)
      .map((r) => `${r.studentId}:${r.exerciceId}`)
  );
  const groupStats = scopedGroups.map((group) => {
    const assigned = group.studentIds.length * group.exerciceIds.length;
    let done = 0;
    group.studentIds.forEach((studentId) =>
      group.exerciceIds.forEach((exerciceId) => {
        if (doneKeys.has(`${studentId}:${exerciceId}`)) done += 1;
      })
    );
    const memberIds = new Set(group.studentIds);
    return {
      id: group.id,
      name: group.name,
      studentCount: group.studentIds.length,
      exerciceCount: group.exerciceIds.length,
      assigned,
      done,
      completionRate: assigned > 0 ? done / assigned : null,
      average: average(
        inPeriod.filter((r) => memberIds.has(r.studentId)).map((r) => r.score)
      ),
    };
  });
  const assigned = groupStats.reduce((sum, g) => sum + g.assigned, 0);
  const done = groupStats.reduce((sum, g) => sum + g.done, 0);

  // --- Élèves à accompagner -------------------------------------------------
  const inactivityLimit = addDays(now, -INACTIVITY_DAYS);
  const studentsToHelp = students
    .map((student) => {
      const history = allResults.filter((r) => r.studentId === student.id);
      const scores = history.map((r) => r.score);
      const studentAverage = average(scores);
      const recentAverage = average(scores.slice(-3));
      const olderAverage = average(scores.slice(0, -3));
      const last = history[history.length - 1]?.createdAt ?? null;

      const group = student.groupId ? groupById.get(student.groupId) : null;
      const pending = group
        ? group.exerciceIds.filter(
            (exerciceId) => !doneKeys.has(`${student.id}:${exerciceId}`)
          ).length
        : 0;

      const reasons: StudentAlertReason[] = [];
      if (
        studentAverage !== null &&
        scores.length >= 2 &&
        studentAverage < LOW_AVERAGE_THRESHOLD
      ) {
        reasons.push("low-average");
      }
      if (
        recentAverage !== null &&
        olderAverage !== null &&
        scores.length >= 5 &&
        olderAverage - recentAverage >= DECLINE_THRESHOLD
      ) {
        reasons.push("declining");
      }
      if (pending > 0 && (!last || last < inactivityLimit)) {
        reasons.push("inactive");
      }

      return {
        id: student.id,
        name: student.name,
        image: student.image,
        groupName: group?.name ?? null,
        average: studentAverage,
        recentAverage,
        lastActivity: last ? last.toISOString() : null,
        pending,
        reasons,
      };
    })
    .filter((s) => s.reasons.length > 0)
    .sort(
      (a, b) =>
        b.reasons.length - a.reasons.length ||
        (a.average ?? 20) - (b.average ?? 20)
    );

  // --- Activité ------------------------------------------------------------
  const unit: TeacherDashboard["activity"]["unit"] =
    days !== null && days <= 30 ? "day" : days === 90 ? "week" : "month";
  const bucketKeys: { key: string; label: string }[] = [];
  if (unit === "day") {
    const today = keyToDate(dayKey(now));
    for (let i = (days ?? 30) - 1; i >= 0; i--) {
      const date = addDays(today, -i);
      bucketKeys.push({
        key: date.toISOString().slice(0, 10),
        label: SHORT_DATE.format(date),
      });
    }
  } else if (unit === "week") {
    const thisWeek = keyToDate(weekKey(now));
    for (let i = 12; i >= 0; i--) {
      const date = addDays(thisWeek, -7 * i);
      bucketKeys.push({
        key: date.toISOString().slice(0, 10),
        label: SHORT_DATE.format(date),
      });
    }
  } else {
    const first = inPeriod[0]?.createdAt ?? now;
    const start = parisParts(first);
    const end = parisParts(now);
    let year = start.year;
    let month = start.month;
    // Au moins 6 mois affichés pour que la tendance reste lisible
    const minStart = parisParts(addDays(now, -150));
    if (year * 12 + month > minStart.year * 12 + minStart.month) {
      year = minStart.year;
      month = minStart.month;
    }
    while (year * 12 + month <= end.year * 12 + end.month) {
      const key = `${year}-${String(month).padStart(2, "0")}`;
      bucketKeys.push({
        key,
        label: MONTH_LABEL.format(keyToDate(`${key}-15`)),
      });
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
  }
  const bucketOf = (date: Date) =>
    unit === "day" ? dayKey(date) : unit === "week" ? weekKey(date) : monthKey(date);
  const scoresByBucket = new Map<string, number[]>();
  inPeriod.forEach((r) => {
    const key = bucketOf(r.createdAt);
    scoresByBucket.set(key, [...(scoresByBucket.get(key) ?? []), r.score]);
  });

  // --- Tendance hebdomadaire (12 semaines, indépendante de la période) -----
  const thisWeek = keyToDate(weekKey(now));
  const weeklyCounts = new Map<string, number>();
  allResults.forEach((r) => {
    const key = weekKey(r.createdAt);
    weeklyCounts.set(key, (weeklyCounts.get(key) ?? 0) + 1);
  });
  const weeklyTrend = Array.from({ length: 12 }, (_, i) => {
    const start = addDays(thisWeek, -7 * (11 - i)).toISOString().slice(0, 10);
    return { start, count: weeklyCounts.get(start) ?? 0 };
  });

  // --- Répartition des notes (10 tranches de 2 points) ---------------------
  const distribution = Array.from({ length: 10 }, (_, i) => ({
    label: `${i * 2}–${i * 2 + 2}`,
    min: i * 2,
    max: i * 2 + 2,
    count: 0,
  }));
  inPeriod.forEach((r) => {
    distribution[Math.min(9, Math.floor(r.score / 2))].count += 1;
  });

  // --- Moyenne par matière -------------------------------------------------
  const bySubjectMap = new Map<string, number[]>();
  inPeriod.forEach((r) =>
    bySubjectMap.set(r.subject, [...(bySubjectMap.get(r.subject) ?? []), r.score])
  );
  const bySubject = Array.from(bySubjectMap, ([subject, scores]) => ({
    subject,
    average: average(scores) ?? 0,
    count: scores.length,
  })).sort((a, b) => b.average - a.average);

  // --- Exercices à revoir --------------------------------------------------
  const byExercice = new Map<
    string,
    { title: string; subject: string; scores: number[] }
  >();
  inPeriod.forEach((r) => {
    if (!r.exerciceId) return;
    const entry = byExercice.get(r.exerciceId) ?? {
      title: r.exerciceTitle ?? "Contrôle supprimé",
      subject: r.subject,
      scores: [],
    };
    entry.scores.push(r.score);
    byExercice.set(r.exerciceId, entry);
  });
  const hardestExercises = Array.from(byExercice, ([exerciceId, e]) => ({
    exerciceId,
    title: e.title,
    subject: e.subject,
    average: average(e.scores) ?? 0,
    count: e.scores.length,
  }))
    .filter((e) => e.count >= 2 && e.average < 14)
    .sort((a, b) => a.average - b.average)
    .slice(0, 5);

  // --- Rythme de travail ---------------------------------------------------
  const rhythmCounts = new Map<string, number>();
  inPeriod.forEach((r) => {
    const { weekday, hour } = parisParts(r.createdAt);
    const key = `${weekday}:${timeSlot(hour)}`;
    rhythmCounts.set(key, (rhythmCounts.get(key) ?? 0) + 1);
  });
  const rhythm = RHYTHM_DAYS.flatMap((_, day) =>
    RHYTHM_SLOTS.map((__, slot) => ({
      day,
      slot,
      count: rhythmCounts.get(`${day}:${slot}`) ?? 0,
    }))
  );

  // --- Dernières copies ----------------------------------------------------
  const recent = [...inPeriod]
    .reverse()
    .slice(0, 8)
    .map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: studentById.get(r.studentId)?.name ?? "Élève",
      title: r.exerciceTitle ?? "Contrôle supprimé",
      subject: r.subject,
      note: r.note,
      coeficient: r.coeficient,
      score: r.score,
      createdAt: r.createdAt.toISOString(),
    }));

  return {
    period,
    groupId: input.groupId,
    summary: {
      average: average(inPeriod.map((r) => r.score)),
      previousAverage: inPreviousPeriod
        ? average(inPreviousPeriod.map((r) => r.score))
        : null,
      submissions: inPeriod.length,
      previousSubmissions: inPreviousPeriod ? inPreviousPeriod.length : null,
      completionRate: assigned > 0 ? done / assigned : null,
      assigned,
      done,
      activeStudents: new Set(inPeriod.map((r) => r.studentId)).size,
      totalStudents: students.length,
      studentsToHelp: studentsToHelp.length,
    },
    weeklyTrend,
    activity: {
      unit,
      buckets: bucketKeys.map(({ key, label }) => {
        const scores = scoresByBucket.get(key) ?? [];
        return { key, label, count: scores.length, average: average(scores) };
      }),
    },
    distribution,
    bySubject,
    groups: groupStats,
    studentsToHelp,
    hardestExercises,
    toReview: toReview.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: studentById.get(r.studentId)?.name ?? "Élève",
      title: r.exerciceTitle ?? "Contrôle supprimé",
      createdAt: r.createdAt.toISOString(),
    })),
    recent,
    rhythm,
  };
};
