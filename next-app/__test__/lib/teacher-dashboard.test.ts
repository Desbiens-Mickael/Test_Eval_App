/**
 * @jest-environment node
 */
import {
  DashboardInput,
  DashboardResultInput,
  buildTeacherDashboard,
  parisParts,
  toScore20,
} from "@/lib/teacher-dashboard";

// Jeudi 12 novembre 2026, 15 h à Paris
const NOW = new Date("2026-11-12T14:00:00Z");
const daysAgo = (days: number, hourUtc = 14) => {
  const d = new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d;
};

let resultId = 0;
const result = (
  studentId: string,
  exerciceId: string,
  score20: number,
  createdAt: Date,
  subject = "Mathématique"
): DashboardResultInput => ({
  id: `r${++resultId}`,
  studentId,
  exerciceId,
  exerciceTitle: `Exercice ${exerciceId}`,
  subject,
  note: score20 / 2, // coefficient 10
  coeficient: 10,
  createdAt,
});

const baseInput = (overrides: Partial<DashboardInput> = {}): DashboardInput => ({
  now: NOW,
  period: "30",
  groupId: null,
  groups: [
    { id: "g1", name: "CM1 A", studentIds: ["s1", "s2"], exerciceIds: ["e1", "e2"] },
    { id: "g2", name: "CM2", studentIds: ["s3"], exerciceIds: ["e3"] },
  ],
  students: [
    { id: "s1", name: "Alice", image: null, groupId: "g1" },
    { id: "s2", name: "Bob", image: null, groupId: "g1" },
    { id: "s3", name: "Chloé", image: null, groupId: "g2" },
  ],
  results: [],
  ...overrides,
});

describe("toScore20", () => {
  it("ramène une note sur 20", () => {
    expect(toScore20(5, 10)).toBe(10);
    expect(toScore20(3.33, 5)).toBe(13.3);
    expect(toScore20(1, 0)).toBe(0);
  });
});

describe("parisParts", () => {
  it("utilise le fuseau de Paris", () => {
    // 23 h UTC en hiver = minuit le lendemain à Paris
    const parts = parisParts(new Date("2026-11-12T23:30:00Z"));
    expect(parts.day).toBe(13);
    expect(parts.hour).toBe(0);
    expect(parts.weekday).toBe(4); // vendredi
  });
});

describe("buildTeacherDashboard", () => {
  it("calcule moyenne, nombre de copies et évolution", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [
          result("s1", "e1", 16, daysAgo(2)),
          result("s2", "e1", 12, daysAgo(5)),
          result("s1", "e2", 8, daysAgo(40)), // période précédente
        ],
      })
    );
    expect(dashboard.summary.average).toBe(14);
    expect(dashboard.summary.submissions).toBe(2);
    expect(dashboard.summary.previousAverage).toBe(8);
    expect(dashboard.summary.previousSubmissions).toBe(1);
    expect(dashboard.summary.activeStudents).toBe(2);
    expect(dashboard.summary.totalStudents).toBe(3);
  });

  it("n'a pas de période précédente sur « tout »", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({ period: "tout", results: [result("s1", "e1", 10, daysAgo(400))] })
    );
    expect(dashboard.summary.submissions).toBe(1);
    expect(dashboard.summary.previousAverage).toBeNull();
    expect(dashboard.activity.unit).toBe("month");
  });

  it("calcule la complétion par groupe, toutes périodes confondues", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [
          result("s1", "e1", 10, daysAgo(1)),
          result("s1", "e2", 10, daysAgo(60)),
          result("s3", "e3", 10, daysAgo(3)),
          result("s2", "e3", 10, daysAgo(3)), // hors groupe : ne compte pas
        ],
      })
    );
    const g1 = dashboard.groups.find((g) => g.id === "g1")!;
    expect(g1.assigned).toBe(4);
    expect(g1.done).toBe(2);
    expect(g1.completionRate).toBe(0.5);
    expect(dashboard.summary.assigned).toBe(5);
    expect(dashboard.summary.done).toBe(3);
  });

  it("filtre sur un groupe", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        groupId: "g2",
        results: [result("s1", "e1", 18, daysAgo(1)), result("s3", "e3", 6, daysAgo(1))],
      })
    );
    expect(dashboard.summary.totalStudents).toBe(1);
    expect(dashboard.summary.average).toBe(6);
    expect(dashboard.groups.map((g) => g.id)).toEqual(["g2"]);
  });

  it("signale les élèves en difficulté, en baisse ou inactifs", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [
          // Alice : en baisse (16, 17, 16 puis 10, 9, 8)
          ...[16, 17, 16, 10, 9, 8].map((score, i) =>
            result("s1", `x${i}`, score, daysAgo(20 - i))
          ),
          // Bob : moyenne basse
          result("s2", "e1", 6, daysAgo(3)),
          result("s2", "e2", 8, daysAgo(2)),
          // Chloé : rien depuis 30 jours alors qu'un exercice l'attend
        ],
      })
    );
    const byName = Object.fromEntries(
      dashboard.studentsToHelp.map((s) => [s.name, s.reasons])
    );
    expect(byName["Alice"]).toContain("declining");
    expect(byName["Bob"]).toContain("low-average");
    expect(byName["Chloé"]).toEqual(["inactive"]);
  });

  it("répartit les notes en tranches de 2 points", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [
          result("s1", "e1", 0, daysAgo(1)),
          result("s1", "e2", 19.5, daysAgo(1)),
          result("s2", "e1", 20, daysAgo(1)),
        ],
      })
    );
    expect(dashboard.distribution[0].count).toBe(1);
    expect(dashboard.distribution[9].count).toBe(2);
  });

  it("liste les exercices les plus difficiles", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [
          result("s1", "e1", 4, daysAgo(1)),
          result("s2", "e1", 6, daysAgo(1)),
          result("s1", "e2", 18, daysAgo(1)),
          result("s2", "e2", 19, daysAgo(1)),
          result("s3", "e3", 2, daysAgo(1)), // une seule copie : ignoré
        ],
      })
    );
    expect(dashboard.hardestExercises).toEqual([
      expect.objectContaining({ exerciceId: "e1", average: 5, count: 2 }),
    ]);
  });

  it("construit une activité quotidienne et le rythme de travail", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        period: "7",
        results: [
          result("s1", "e1", 10, daysAgo(0, 8)), // jeudi 9 h à Paris
          result("s2", "e1", 10, daysAgo(0, 9)),
        ],
      })
    );
    expect(dashboard.activity.unit).toBe("day");
    expect(dashboard.activity.buckets).toHaveLength(7);
    expect(dashboard.activity.buckets.at(-1)!.count).toBe(2);
    const thursdayMorning = dashboard.rhythm.find((c) => c.day === 3 && c.slot === 0);
    expect(thursdayMorning?.count).toBe(2);
    expect(dashboard.weeklyTrend).toHaveLength(12);
    expect(dashboard.weeklyTrend.at(-1)!.count).toBe(2);
  });

  it("trie les dernières copies de la plus récente à la plus ancienne", () => {
    const dashboard = buildTeacherDashboard(
      baseInput({
        results: [result("s1", "e1", 10, daysAgo(5)), result("s2", "e2", 12, daysAgo(1))],
      })
    );
    expect(dashboard.recent.map((r) => r.studentName)).toEqual(["Bob", "Alice"]);
  });
});
