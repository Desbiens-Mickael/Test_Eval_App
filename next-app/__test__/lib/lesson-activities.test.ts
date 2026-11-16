import { buildLessonActivities } from "@/lib/lesson-activities";

const now = new Date("2026-11-16T12:00:00Z");
const past = new Date("2026-11-15T12:00:00Z");
const future = new Date("2026-11-17T12:00:00Z");

const row = (over: Partial<Parameters<typeof buildLessonActivities>[0][number]>) => ({
  id: "ex",
  title: "Titre",
  kind: "CONTROL" as const,
  opensAt: null,
  closesAt: null,
  level: { label: "Facile", color: "c" },
  type: { name: "Vrai ou Faux" },
  practiceAttempts: [],
  practiceCorrections: [],
  studentExercices: [],
  ...over,
});

const copy = { id: "se1", note: 4, coeficient: 5, isMissing: false };

describe("buildLessonActivities", () => {
  it("sépare exercices et contrôles", () => {
    const { practices, controls } = buildLessonActivities(
      [row({ id: "p", kind: "PRACTICE" }), row({ id: "c" })],
      now
    );
    expect(practices.map((p) => p.id)).toEqual(["p"]);
    expect(controls.map((c) => c.id)).toEqual(["c"]);
  });

  it("résume l'avancement d'un exercice", () => {
    const { practices } = buildLessonActivities(
      [
        row({
          kind: "PRACTICE",
          practiceAttempts: [{ note: 2, coeficient: 5, createdAt: past }],
        }),
      ],
      now
    );
    expect(practices[0].summary).toMatchObject({ status: "in-progress", attempts: 1, bestPercent: 40 });
  });

  it("donne l'état d'un contrôle selon sa période", () => {
    const { controls } = buildLessonActivities(
      [
        row({ id: "todo" }),
        row({ id: "upcoming", opensAt: future }),
        row({ id: "closed", closesAt: past }),
      ],
      now
    );
    expect(controls.map((c) => [c.id, c.status])).toEqual([
      ["todo", "TODO"],
      ["upcoming", "UPCOMING"],
      ["closed", "CLOSED"],
    ]);
  });

  it("cache la note et la correction avant la clôture", () => {
    const [control] = buildLessonActivities(
      [row({ closesAt: future, studentExercices: [copy] })],
      now
    ).controls;
    expect(control).toMatchObject({ status: "DONE", note: null, canSeeCorrection: false });
  });

  it("montre la note et la correction quand elles sont visibles", () => {
    const [control] = buildLessonActivities(
      [row({ closesAt: past, studentExercices: [{ ...copy, isMissing: true, note: 0 }] })],
      now
    ).controls;
    expect(control).toMatchObject({
      status: "DONE",
      note: 0,
      isMissing: true,
      canSeeCorrection: true,
      studentExerciceId: "se1",
    });
  });
});
