/**
 * @jest-environment node
 */
import {
  ProgressInput,
  ProgressResultInput,
  buildStudentProgress,
  longestWeekStreak,
  toPercent,
} from "@/lib/student-progress";

// Jeudi 12 novembre 2026, 15 h à Paris
const NOW = new Date("2026-11-12T14:00:00Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);

let resultId = 0;
const result = (
  percent: number,
  createdAt: Date,
  subject = "Mathématique",
  exerciceId: string | null = `e${resultId + 1}`
): ProgressResultInput => ({
  id: `r${++resultId}`,
  exerciceId,
  exerciceTitle: exerciceId ? `Exercice ${exerciceId}` : null,
  subject,
  note: percent / 10, // barème sur 10
  coeficient: 10,
  createdAt,
});

const input = (overrides: Partial<ProgressInput> = {}): ProgressInput => ({
  results: [],
  assigned: [],
  subjectColors: { Mathématique: "bg-blue-500", Français: "bg-red-500" },
  ...overrides,
});

const badge = (progress: ReturnType<typeof buildStudentProgress>, id: string) =>
  progress.badges.find((b) => b.id === id)!;

describe("toPercent", () => {
  it("convertit une note en pourcentage entier borné", () => {
    expect(toPercent(5, 10)).toBe(50);
    expect(toPercent(2, 3)).toBe(67);
    expect(toPercent(12, 10)).toBe(100);
    expect(toPercent(-1, 10)).toBe(0);
    expect(toPercent(3, 0)).toBe(0);
  });
});

describe("longestWeekStreak", () => {
  it("compte les semaines consécutives (du lundi au dimanche, heure de Paris)", () => {
    // Lundi 2, lundi 9 et jeudi 12 novembre : 2 semaines de suite
    expect(
      longestWeekStreak([
        new Date("2026-11-02T08:00:00Z"),
        new Date("2026-11-09T08:00:00Z"),
        new Date("2026-11-12T08:00:00Z"),
      ])
    ).toBe(2);
    // Dimanche 8 novembre 23 h 30 à Paris = 22 h 30 UTC : encore la semaine du 2
    expect(
      longestWeekStreak([new Date("2026-11-02T08:00:00Z"), new Date("2026-11-08T22:30:00Z")])
    ).toBe(1);
    // Une semaine sautée casse la série
    expect(
      longestWeekStreak([
        new Date("2026-10-19T08:00:00Z"),
        new Date("2026-11-02T08:00:00Z"),
        new Date("2026-11-09T08:00:00Z"),
      ])
    ).toBe(2);
    expect(longestWeekStreak([])).toBe(0);
  });
});

describe("buildStudentProgress", () => {
  it("renvoie une progression vide sans résultat", () => {
    const progress = buildStudentProgress(input());
    expect(progress.summary).toEqual({
      successRate: null,
      done: 0,
      assigned: 0,
      assignedDone: 0,
      completionRate: null,
      recentRate: null,
      previousRate: null,
      perfect: 0,
    });
    expect(progress.history).toEqual([]);
    expect(progress.bySubject).toEqual([]);
    expect(progress.badges.every((b) => b.earnedAt === null)).toBe(true);
  });

  it("calcule la réussite par matière, y compris les matières seulement attribuées", () => {
    const progress = buildStudentProgress(
      input({
        results: [
          result(80, daysAgo(3), "Mathématique", "e1"),
          result(60, daysAgo(2), "Mathématique", "e2"),
          result(100, daysAgo(1), "Mathématique", null), // exercice supprimé
        ],
        assigned: [
          { id: "e1", subject: "Mathématique" },
          { id: "e2", subject: "Mathématique" },
          { id: "e9", subject: "Mathématique" },
          { id: "f1", subject: "Français" },
        ],
      })
    );

    expect(progress.summary.successRate).toBe(80);
    expect(progress.summary.done).toBe(3);
    expect(progress.summary.assignedDone).toBe(2);
    expect(progress.summary.completionRate).toBe(0.5);
    expect(progress.bySubject).toEqual([
      {
        subject: "Français",
        color: "bg-red-500",
        successRate: null,
        best: null,
        done: 0,
        assigned: 1,
        assignedDone: 0,
      },
      {
        subject: "Mathématique",
        color: "bg-blue-500",
        successRate: 80,
        best: 100,
        done: 3,
        assigned: 3,
        assignedDone: 2,
      },
    ]);
  });

  it("trie l'historique du plus ancien au plus récent", () => {
    const progress = buildStudentProgress(
      input({ results: [result(50, daysAgo(1)), result(70, daysAgo(5)), result(90, daysAgo(3))] })
    );
    expect(progress.history.map((h) => h.percent)).toEqual([70, 90, 50]);
    expect(progress.history[0].title).toMatch(/^Exercice /);
  });

  it("compare les 5 derniers résultats aux 5 précédents", () => {
    const scores = [40, 40, 40, 40, 40, 80, 80, 80, 80, 80];
    const progress = buildStudentProgress(
      input({ results: scores.map((s, i) => result(s, daysAgo(20 - i))) })
    );
    expect(progress.summary.previousRate).toBe(40);
    expect(progress.summary.recentRate).toBe(80);

    // Pas de tendance avec trop peu de résultats
    const few = buildStudentProgress(input({ results: [result(50, daysAgo(2))] }));
    expect(few.summary.recentRate).toBeNull();
  });

  describe("badges", () => {
    it("date un badge à la copie qui a rempli la condition", () => {
      const first = daysAgo(10);
      const perfect = daysAgo(4);
      const progress = buildStudentProgress(
        input({ results: [result(50, first), result(70, daysAgo(6)), result(100, perfect)] })
      );

      expect(badge(progress, "premier-pas").earnedAt).toBe(first.toISOString());
      expect(badge(progress, "sans-faute").earnedAt).toBe(perfect.toISOString());
      expect(badge(progress, "perfectionniste")).toMatchObject({
        earnedAt: null,
        progress: { current: 1, target: 5 },
      });
      expect(badge(progress, "bien-lance").progress).toEqual({ current: 3, target: 10 });
    });

    it("plafonne l'avancement à l'objectif", () => {
      const progress = buildStudentProgress(
        input({ results: Array.from({ length: 12 }, (_, i) => result(50, daysAgo(30 - i))) })
      );
      expect(badge(progress, "bien-lance").progress).toEqual({ current: 10, target: 10 });
      expect(badge(progress, "bien-lance").earnedAt).not.toBeNull();
    });

    it("explorateur : 3 matières différentes", () => {
      const progress = buildStudentProgress(
        input({
          results: [
            result(50, daysAgo(3), "Mathématique"),
            result(50, daysAgo(2), "Français"),
            result(50, daysAgo(1), "Histoire"),
          ],
        })
      );
      expect(badge(progress, "explorateur").earnedAt).toBe(daysAgo(1).toISOString());
    });

    it("régulier : 3 semaines de suite", () => {
      const progress = buildStudentProgress(
        input({ results: [result(50, daysAgo(14)), result(50, daysAgo(7)), result(50, daysAgo(0))] })
      );
      expect(badge(progress, "regulier").earnedAt).toBe(daysAgo(0).toISOString());
    });

    it("spécialiste : 80 % de moyenne sur au moins 5 exercices d'une matière", () => {
      const four = buildStudentProgress(
        input({ results: [90, 90, 90, 90].map((s, i) => result(s, daysAgo(10 - i))) })
      );
      expect(badge(four, "specialiste").earnedAt).toBeNull();

      const five = buildStudentProgress(
        input({ results: [90, 90, 90, 90, 60].map((s, i) => result(s, daysAgo(10 - i))) })
      );
      expect(badge(five, "specialiste").earnedAt).toBe(daysAgo(6).toISOString());
      expect(badge(five, "specialiste").progress).toBeNull();
    });

    it("en progrès : +15 points sur les 3 dernières copies", () => {
      const progress = buildStudentProgress(
        input({ results: [40, 50, 40, 60, 70, 60].map((s, i) => result(s, daysAgo(10 - i))) })
      );
      expect(badge(progress, "en-progres").earnedAt).toBe(daysAgo(5).toISOString());

      const flat = buildStudentProgress(
        input({ results: [60, 60, 60, 60, 60, 60].map((s, i) => result(s, daysAgo(10 - i))) })
      );
      expect(badge(flat, "en-progres").earnedAt).toBeNull();
    });

    it("garde un badge obtenu même si la condition n'est plus remplie", () => {
      // Progression puis baisse : « En progrès » reste acquis
      const progress = buildStudentProgress(
        input({
          results: [40, 40, 40, 80, 80, 80, 30, 30, 30].map((s, i) => result(s, daysAgo(20 - i))),
        })
      );
      expect(badge(progress, "en-progres").earnedAt).toBe(daysAgo(15).toISOString());
    });
  });
});
