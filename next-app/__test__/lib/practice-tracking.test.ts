/**
 * @jest-environment node
 */
import { TrackingExerciseInput, buildPracticeTracking } from "@/lib/practice-tracking";

const attempt = (note: number, iso: string) => ({ note, coeficient: 10, createdAt: new Date(iso) });

const exercise = (overrides: Partial<TrackingExerciseInput>): TrackingExerciseInput => ({
  id: "e1",
  title: "Exercice",
  subject: "Mathématique",
  subjectColor: "bg-blue-500",
  type: "Vrai ou Faux",
  attempts: [],
  correctionSeenAt: null,
  ...overrides,
});

describe("buildPracticeTracking", () => {
  it("trace la courbe des essais dans l'ordre chronologique", () => {
    const { exercises } = buildPracticeTracking([
      exercise({
        attempts: [
          attempt(8, "2026-11-03T10:00:00Z"),
          attempt(3, "2026-11-01T10:00:00Z"),
          attempt(6, "2026-11-02T10:00:00Z"),
        ],
      }),
    ]);
    expect(exercises[0].attempts).toEqual([
      { n: 1, percent: 30, createdAt: "2026-11-01T10:00:00.000Z" },
      { n: 2, percent: 60, createdAt: "2026-11-02T10:00:00.000Z" },
      { n: 3, percent: 80, createdAt: "2026-11-03T10:00:00.000Z" },
    ]);
    expect(exercises[0]).toMatchObject({
      status: "in-progress",
      firstPercent: 30,
      lastPercent: 80,
      bestPercent: 80,
      progress: 50,
      lastAttemptAt: "2026-11-03T10:00:00.000Z",
    });
  });

  it("n'affiche pas de progression avec un seul essai", () => {
    const { exercises } = buildPracticeTracking([
      exercise({ attempts: [attempt(5, "2026-11-01T10:00:00Z")] }),
    ]);
    expect(exercises[0].progress).toBeNull();
  });

  it("indique quand la correction a été vue", () => {
    const { exercises } = buildPracticeTracking([
      exercise({
        attempts: [attempt(5, "2026-11-01T10:00:00Z")],
        correctionSeenAt: new Date("2026-11-02T10:00:00Z"),
      }),
    ]);
    expect(exercises[0].status).toBe("correction-seen");
    expect(exercises[0].correctionSeenAt).toBe("2026-11-02T10:00:00.000Z");
  });

  it("classe les plus récemment travaillés d'abord, puis ceux pas commencés", () => {
    const tracking = buildPracticeTracking([
      exercise({ id: "jamais-b", title: "B" }),
      exercise({ id: "ancien", attempts: [attempt(5, "2026-11-01T10:00:00Z")] }),
      exercise({ id: "jamais-a", title: "A" }),
      exercise({
        id: "recent",
        attempts: [attempt(5, "2026-11-05T10:00:00Z")],
        correctionSeenAt: new Date("2026-11-06T10:00:00Z"),
      }),
    ]);
    expect(tracking.exercises.map((e) => e.id)).toEqual(["recent", "ancien", "jamais-a", "jamais-b"]);
    expect(tracking.summary).toEqual({ assigned: 4, started: 2, finished: 1, totalAttempts: 2 });
  });

  it("gère un élève sans exercice", () => {
    expect(buildPracticeTracking([])).toEqual({
      summary: { assigned: 0, started: 0, finished: 0, totalAttempts: 0 },
      exercises: [],
    });
  });
});
