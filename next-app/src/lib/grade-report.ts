/**
 * Relevés de notes (groupe et élève) et leur export CSV.
 *
 * Module pur : il reçoit les données brutes et produit les relevés, utilisés
 * tels quels par l'export CSV (ici) et l'export PDF (grade-report-pdf.ts).
 * Toutes les moyennes sont calculées sur 20.
 */

const TIME_ZONE = "Europe/Paris";

// ---------------------------------------------------------------------------
// Utilitaires
// ---------------------------------------------------------------------------

/** Note ramenée sur 20, arrondie au dixième */
export const toScore20 = (note: number, coeficient: number) =>
  coeficient > 0 ? Math.round((note / coeficient) * 200) / 10 : 0;

const average = (values: number[]) =>
  values.length === 0
    ? null
    : Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10;

const numberFr = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  useGrouping: false,
});

/** Nombre au format français (virgule décimale), vide si absent */
export const formatNumberFr = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : numberFr.format(value);

const dateFr = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TIME_ZONE,
});

export const formatDateFr = (date: Date | string) => dateFr.format(new Date(date));

/** Nom de fichier sans accents ni caractères spéciaux */
export const reportFileName = (prefix: string, label: string, date: Date, extension: string) => {
  const slug = label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const day = new Intl.DateTimeFormat("fr-CA", { timeZone: TIME_ZONE }).format(date); // AAAA-MM-JJ
  return `${prefix}-${slug || "export"}-${day}.${extension}`;
};

// ---------------------------------------------------------------------------
// Relevé d'un groupe
// ---------------------------------------------------------------------------

export type GroupReportInput = {
  groupName: string;
  students: { id: string; name: string; identifier: string }[];
  exercises: { id: string; title: string; subject: string }[];
  results: { studentId: string; exerciceId: string | null; note: number; coeficient: number }[];
  generatedAt: Date;
};

export type GroupGradeReport = {
  groupName: string;
  generatedAt: string;
  exercises: { id: string; title: string; subject: string; average: number | null; done: number }[];
  students: {
    id: string;
    name: string;
    identifier: string;
    /** Note sur 20 par exercice, dans l'ordre de `exercises` (null = pas fait) */
    scores: (number | null)[];
    average: number | null;
    done: number;
  }[];
  average: number | null;
};

export const buildGroupGradeReport = (input: GroupReportInput): GroupGradeReport => {
  const scoreOf = new Map<string, number>();
  input.results.forEach((r) => {
    if (r.exerciceId) scoreOf.set(`${r.studentId}:${r.exerciceId}`, toScore20(r.note, r.coeficient));
  });

  const students = [...input.students]
    .sort((a, b) => a.name.localeCompare(b.name, "fr"))
    .map((student) => {
      const scores = input.exercises.map((e) => scoreOf.get(`${student.id}:${e.id}`) ?? null);
      const done = scores.filter((s): s is number => s !== null);
      return {
        id: student.id,
        name: student.name,
        identifier: student.identifier,
        scores,
        average: average(done),
        done: done.length,
      };
    });

  const exercises = input.exercises.map((exercise, i) => {
    const done = students.map((s) => s.scores[i]).filter((s): s is number => s !== null);
    return { ...exercise, average: average(done), done: done.length };
  });

  return {
    groupName: input.groupName,
    generatedAt: input.generatedAt.toISOString(),
    exercises,
    students,
    average: average(students.flatMap((s) => s.scores.filter((v): v is number => v !== null))),
  };
};

// ---------------------------------------------------------------------------
// Relevé d'un élève
// ---------------------------------------------------------------------------

export type StudentReportInput = {
  student: { name: string; identifier: string; groupName: string | null };
  results: {
    exerciceTitle: string | null;
    subject: string;
    note: number;
    coeficient: number;
    autoNote: number | null;
    teacherComment: string | null;
    createdAt: Date;
  }[];
  generatedAt: Date;
};

export type StudentGradeReport = {
  student: StudentReportInput["student"];
  generatedAt: string;
  rows: {
    date: string;
    subject: string;
    title: string;
    note: number;
    coeficient: number;
    score: number;
    adjusted: boolean;
    comment: string | null;
  }[];
  bySubject: { subject: string; average: number; count: number }[];
  average: number | null;
};

export const buildStudentGradeReport = (input: StudentReportInput): StudentGradeReport => {
  const rows = [...input.results]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map((r) => ({
      date: r.createdAt.toISOString(),
      subject: r.subject,
      title: r.exerciceTitle ?? "Contrôle supprimé",
      note: r.note,
      coeficient: r.coeficient,
      score: toScore20(r.note, r.coeficient),
      adjusted: r.autoNote !== null && r.autoNote !== r.note,
      comment: r.teacherComment,
    }));

  const bySubjectMap = new Map<string, number[]>();
  rows.forEach((r) => bySubjectMap.set(r.subject, [...(bySubjectMap.get(r.subject) ?? []), r.score]));
  const bySubject = Array.from(bySubjectMap, ([subject, scores]) => ({
    subject,
    average: average(scores) ?? 0,
    count: scores.length,
  })).sort((a, b) => a.subject.localeCompare(b.subject, "fr"));

  return {
    student: input.student,
    generatedAt: input.generatedAt.toISOString(),
    rows,
    bySubject,
    average: average(rows.map((r) => r.score)),
  };
};

// ---------------------------------------------------------------------------
// CSV (séparateur « ; » et virgule décimale : s'ouvre tel quel dans un Excel français)
// ---------------------------------------------------------------------------

const csvCell = (value: string | number | null) => {
  const text = value === null ? "" : String(value);
  // Une cellule qui commence par = + - @ serait interprétée comme une formule par Excel
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return /[";\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

const toCsv = (rows: (string | number | null)[][]) =>
  `﻿${rows.map((r) => r.map(csvCell).join(";")).join("\r\n")}\r\n`;

export const groupReportToCsv = (report: GroupGradeReport) =>
  toCsv([
    [
      "Élève",
      "Identifiant",
      ...report.exercises.map((e) => `${e.title} (${e.subject}, /20)`),
      "Contrôles faits",
      "Moyenne /20",
    ],
    ...report.students.map((s) => [
      s.name,
      s.identifier,
      ...s.scores.map(formatNumberFr),
      `${s.done}/${report.exercises.length}`,
      formatNumberFr(s.average),
    ]),
    [
      "Moyenne du groupe",
      "",
      ...report.exercises.map((e) => formatNumberFr(e.average)),
      "",
      formatNumberFr(report.average),
    ],
  ]);

export const studentReportToCsv = (report: StudentGradeReport) =>
  toCsv([
    ["Date", "Matière", "Contrôle", "Note", "Barème", "Note /20", "Note ajustée", "Commentaire du professeur"],
    ...report.rows.map((r) => [
      formatDateFr(r.date),
      r.subject,
      r.title,
      formatNumberFr(r.note),
      r.coeficient,
      formatNumberFr(r.score),
      r.adjusted ? "oui" : "",
      r.comment,
    ]),
    [],
    ["Matière", "Moyenne /20", "Copies"],
    ...report.bySubject.map((s) => [s.subject, formatNumberFr(s.average), s.count]),
    ["Moyenne générale", formatNumberFr(report.average), report.rows.length],
  ]);
