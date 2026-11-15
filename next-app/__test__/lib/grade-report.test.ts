/**
 * @jest-environment node
 */
import {
  buildGroupGradeReport,
  buildStudentGradeReport,
  formatNumberFr,
  groupReportToCsv,
  reportFileName,
  studentReportToCsv,
} from "@/lib/grade-report";

const NOW = new Date("2026-11-15T10:00:00Z");

const groupInput = {
  groupName: "CM1 Explorateurs",
  generatedAt: NOW,
  students: [
    { id: "s2", name: "Zoé Martin", identifier: "z.martin" },
    { id: "s1", name: "Élodie Bernard", identifier: "e.bernard" },
  ],
  exercises: [
    { id: "e1", title: "Les fractions", subject: "Mathématique" },
    { id: "e2", title: "Le présent", subject: "Français" },
  ],
  results: [
    { studentId: "s1", exerciceId: "e1", note: 4, coeficient: 5 }, // 16/20
    { studentId: "s1", exerciceId: "e2", note: 6, coeficient: 10 }, // 12/20
    { studentId: "s2", exerciceId: "e1", note: 2.5, coeficient: 5 }, // 10/20
    { studentId: "s2", exerciceId: "x", note: 5, coeficient: 5 }, // exercice non attribué
  ],
};

describe("buildGroupGradeReport", () => {
  const report = buildGroupGradeReport(groupInput);

  it("trie les élèves par nom (accents compris)", () => {
    expect(report.students.map((s) => s.name)).toEqual(["Élodie Bernard", "Zoé Martin"]);
  });

  it("aligne les notes sur 20 sur les exercices attribués", () => {
    expect(report.students[0].scores).toEqual([16, 12]);
    expect(report.students[1].scores).toEqual([10, null]);
  });

  it("calcule les moyennes par élève, par exercice et du groupe", () => {
    expect(report.students[0]).toMatchObject({ average: 14, done: 2 });
    expect(report.students[1]).toMatchObject({ average: 10, done: 1 });
    expect(report.exercises[0]).toMatchObject({ average: 13, done: 2 });
    expect(report.average).toBe(12.7);
  });
});

describe("groupReportToCsv", () => {
  const csv = groupReportToCsv(buildGroupGradeReport(groupInput));
  const lines = csv.replace(/^﻿/, "").trim().split("\r\n");

  it("commence par un BOM pour qu'Excel lise les accents", () => {
    expect(csv.startsWith("﻿")).toBe(true);
  });

  it("utilise ; et la virgule décimale", () => {
    expect(lines[0]).toBe(
      "Élève;Identifiant;Les fractions (Mathématique, /20);Le présent (Français, /20);Exercices faits;Moyenne /20"
    );
    expect(lines[1]).toBe("Élodie Bernard;e.bernard;16;12;2/2;14");
    expect(lines[2]).toBe("Zoé Martin;z.martin;10;;1/2;10");
    expect(lines[3]).toBe("Moyenne du groupe;;13;12;;12,7");
  });
});

describe("buildStudentGradeReport / studentReportToCsv", () => {
  const report = buildStudentGradeReport({
    generatedAt: NOW,
    student: { name: "Léa Martin", identifier: "l.martin", groupName: "CM2" },
    results: [
      {
        exerciceTitle: "Le présent",
        subject: "Français",
        note: 4.5,
        coeficient: 5,
        autoNote: 5,
        teacherComment: 'Bravo ; relis "avoir"',
        createdAt: new Date("2026-11-02T15:00:00Z"),
      },
      {
        exerciceTitle: null,
        subject: "Mathématique",
        note: 5,
        coeficient: 10,
        autoNote: null,
        teacherComment: null,
        createdAt: new Date("2026-10-20T08:00:00Z"),
      },
    ],
  });

  it("trie les copies par date et repère les notes ajustées", () => {
    expect(report.rows.map((r) => r.title)).toEqual(["Exercice supprimé", "Le présent"]);
    expect(report.rows[1]).toMatchObject({ score: 18, adjusted: true });
  });

  it("calcule les moyennes par matière et générale", () => {
    expect(report.bySubject).toEqual([
      { subject: "Français", average: 18, count: 1 },
      { subject: "Mathématique", average: 10, count: 1 },
    ]);
    expect(report.average).toBe(14);
  });

  it("protège les cellules contenant ; ou des guillemets", () => {
    const csv = studentReportToCsv(report);
    expect(csv).toContain('20/10/2026;Mathématique;Exercice supprimé;5;10;10;;');
    expect(csv).toContain('02/11/2026;Français;Le présent;4,5;5;18;oui;"Bravo ; relis ""avoir"""');
  });
});

describe("sécurité et utilitaires", () => {
  it("neutralise les formules Excel dans les cellules", () => {
    const csv = studentReportToCsv(
      buildStudentGradeReport({
        generatedAt: NOW,
        student: { name: "A", identifier: "a", groupName: null },
        results: [
          {
            exerciceTitle: "=HYPERLINK(\"x\")",
            subject: "+cmd",
            note: 1,
            coeficient: 5,
            autoNote: null,
            teacherComment: "@SUM(A1)",
            createdAt: NOW,
          },
        ],
      })
    );
    expect(csv).toContain(`'+cmd;"'=HYPERLINK(""x"")"`);
    expect(csv).toContain("'@SUM(A1)");
  });

  it("formate nombres et noms de fichiers", () => {
    expect(formatNumberFr(12.75)).toBe("12,75");
    expect(formatNumberFr(null)).toBe("");
    expect(reportFileName("notes", "CM1 Éxplorateurs !", NOW, "pdf")).toBe(
      "notes-cm1-explorateurs-2026-11-15.pdf"
    );
  });
});
