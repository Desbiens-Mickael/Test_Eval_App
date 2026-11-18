/**
 * @jest-environment node
 */
import {
  gradeExercice,
  isTeacherGraded,
  stripExerciceSolutions,
} from "@/lib/exercice-grading";
import { buildLessonActivities } from "@/lib/lesson-activities";
import { buildTeacherDashboard } from "@/lib/teacher-dashboard";
import { freeResponseResponseShema } from "@/shema-zod/exercice-corection.shema";
import {
  QUESTION_COMMENT_MAX_LENGTH,
  buildFreeResponseReviewSchema,
  freeResponseNote,
} from "@/shema-zod/exercice-review.shema";
import { contentFreeResponseShema } from "@/shema-zod/exercice.shema";

const content = [
  { question: "Pourquoi le Soleil brille-t-il ?", points: 4, modelAnswer: "La fusion nucléaire" },
  { question: "Cite une étoile.", points: 1, modelAnswer: "" },
];

describe("contenu d'une réponse libre", () => {
  it("accepte des questions avec barème et réponse attendue facultative", () => {
    expect(contentFreeResponseShema.safeParse(content).success).toBe(true);
  });

  it("refuse un contrôle sans question", () => {
    expect(contentFreeResponseShema.safeParse([]).success).toBe(false);
  });

  it.each([
    [0, /au moins 1 point/],
    [21, /au plus 20 points/],
    [1.5, /entier/],
  ])("refuse un barème de %p point(s)", (points, message) => {
    const result = contentFreeResponseShema.safeParse([{ question: "Q", points, modelAnswer: "" }]);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(message);
  });

  it("refuse une question vide", () => {
    expect(
      contentFreeResponseShema.safeParse([{ question: "  ", points: 2, modelAnswer: "" }]).success
    ).toBe(false);
  });
});

describe("réponse de l'élève", () => {
  it("limite la longueur de chaque réponse", () => {
    expect(freeResponseResponseShema.safeParse([{ index: 0, answer: "a".repeat(5000) }]).success).toBe(
      true
    );
    expect(freeResponseResponseShema.safeParse([{ index: 0, answer: "a".repeat(5001) }]).success).toBe(
      false
    );
  });
});

describe("correction automatique", () => {
  it("la réponse libre est notée par le professeur", () => {
    expect(isTeacherGraded("Réponse libre")).toBe(true);
    expect(isTeacherGraded("Vrai ou Faux")).toBe(false);
  });

  it("ne se calcule pas automatiquement", () => {
    expect(() =>
      gradeExercice({ type: "Réponse libre", level: "Facile", content, response: [] })
    ).toThrow();
  });

  it("retire les réponses attendues pour l'élève", () => {
    const { content: stripped } = stripExerciceSolutions("Réponse libre", content);
    expect(stripped).toEqual([
      { question: "Pourquoi le Soleil brille-t-il ?", points: 4 },
      { question: "Cite une étoile.", points: 1 },
    ]);
    expect(JSON.stringify(stripped)).not.toContain("fusion");
  });
});

describe("buildFreeResponseReviewSchema", () => {
  const schema = buildFreeResponseReviewSchema([4, 1]);
  const reviews = (a: unknown, b: unknown = 1) => ({
    reviews: [
      { points: a, comment: "" },
      { points: b, comment: "" },
    ],
    comment: "",
  });

  it("accepte des points entre 0 et le barème, par quart de point", () => {
    expect(schema.safeParse(reviews(3.75)).success).toBe(true);
    expect(schema.safeParse(reviews(0, 0)).success).toBe(true);
    expect(schema.safeParse(reviews("2.5")).success).toBe(true);
  });

  it("refuse plus de points que le barème de la question", () => {
    const result = schema.safeParse(reviews(4.25));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Cette question est notée sur 4");
    expect(result.error?.issues[0].path).toEqual(["reviews", 0, "points"]);
  });

  it("refuse des points négatifs ou pas au quart de point", () => {
    expect(schema.safeParse(reviews(-1)).success).toBe(false);
    expect(schema.safeParse(reviews(1.1)).success).toBe(false);
  });

  it("exige une note pour chaque question", () => {
    expect(
      schema.safeParse({ reviews: [{ points: 2, comment: "" }], comment: "" }).success
    ).toBe(false);
    // Un champ vide n'est pas un 0
    const empty = schema.safeParse(reviews(""));
    expect(empty.success).toBe(false);
    expect(empty.error?.issues[0].message).toBe("Notez cette question");
    expect(schema.safeParse(reviews(undefined)).success).toBe(false);
  });

  it("limite la longueur des commentaires par question", () => {
    const result = schema.safeParse({
      reviews: [
        { points: 1, comment: "a".repeat(QUESTION_COMMENT_MAX_LENGTH + 1) },
        { points: 1, comment: "" },
      ],
      comment: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("freeResponseNote", () => {
  it("ramène les points obtenus sur le coefficient", () => {
    // 3 + 1 = 4 points sur 5, coefficient 10 → 8
    expect(freeResponseNote([{ points: 3 }, { points: 1 }], [4, 1], 10)).toBe(8);
    // 2,5 sur 5, coefficient 20 → 10
    expect(freeResponseNote([{ points: 2.5 }, { points: 0 }], [4, 1], 20)).toBe(10);
  });

  it("arrondit au centième", () => {
    // 1 sur 3, coefficient 5 → 1,666… → 1,67
    expect(freeResponseNote([{ points: 1 }], [3], 5)).toBe(1.67);
  });

  it("vaut 0 sans barème", () => {
    expect(freeResponseNote([], [], 10)).toBe(0);
  });
});

describe("tableau de bord : copies à corriger", () => {
  const input = {
    now: new Date("2026-11-12T14:00:00Z"),
    period: "30" as const,
    groupId: null,
    groups: [{ id: "g1", name: "CM1", studentIds: ["s1", "s2"], exerciceIds: ["e1"] }],
    students: [
      { id: "s1", name: "Alice", image: null, groupId: "g1" },
      { id: "s2", name: "Bob", image: null, groupId: "g1" },
    ],
    results: [
      {
        id: "r1",
        studentId: "s1",
        exerciceId: "e1",
        exerciceTitle: "Le Soleil",
        subject: "Physique",
        note: 5,
        coeficient: 10,
        createdAt: new Date("2026-11-10T10:00:00Z"),
      },
    ],
    toReview: [
      {
        id: "p1",
        studentId: "s2",
        exerciceId: "e1",
        exerciceTitle: "Le Soleil",
        createdAt: new Date("2026-11-11T10:00:00Z"),
      },
    ],
  };

  it("liste les copies à corriger", () => {
    const dashboard = buildTeacherDashboard(input);
    expect(dashboard.toReview).toEqual([
      {
        id: "p1",
        studentId: "s2",
        studentName: "Bob",
        title: "Le Soleil",
        createdAt: "2026-11-11T10:00:00.000Z",
      },
    ]);
  });

  it("compte la copie comme rendue sans fausser la moyenne", () => {
    const dashboard = buildTeacherDashboard(input);
    expect(dashboard.summary.done).toBe(2);
    expect(dashboard.summary.completionRate).toBe(1);
    expect(dashboard.summary.average).toBe(10);
    expect(dashboard.summary.submissions).toBe(1);
  });

  it("respecte le filtre de groupe", () => {
    const dashboard = buildTeacherDashboard({
      ...input,
      groups: [...input.groups, { id: "g2", name: "CM2", studentIds: ["s3"], exerciceIds: [] }],
      groupId: "g2",
    });
    expect(dashboard.toReview).toEqual([]);
  });
});

describe("activités d'une leçon : copie en attente", () => {
  it("n'affiche pas de note tant que la copie n'est pas corrigée", () => {
    const { controls } = buildLessonActivities(
      [
        {
          id: "c",
          title: "Le Soleil",
          kind: "CONTROL",
          opensAt: null,
          closesAt: null,
          level: { label: "Facile", color: "c" },
          type: { name: "Réponse libre" },
          practiceAttempts: [],
          practiceCorrections: [],
          studentExercices: [
            { id: "se1", note: 0, coeficient: 5, isMissing: false, pendingReview: true },
          ],
        },
      ],
      new Date("2026-11-16T12:00:00Z")
    );
    expect(controls[0]).toMatchObject({
      status: "DONE",
      note: null,
      pendingReview: true,
      canSeeCorrection: true,
    });
  });
});
