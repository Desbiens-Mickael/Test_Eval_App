/**
 * @jest-environment node
 */
import {
  getPracticeAction,
  getPracticeListAction,
  revealPracticeCorrectionAction,
  submitPracticeAttemptAction,
} from "@/actions/exercice-practice.action";
import type { ExerciceOutput } from "@/data/exercice/exercice-data";
import { getExerciceByIdData } from "@/data/exercice/exercice-data";
import {
  createPracticeAttemptData,
  getPracticeExercisesForStudentData,
  getPracticeStateData,
  revealPracticeCorrectionData,
} from "@/data/exercice/practice-data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/group.data", () => ({ getGroupByStudentIdData: jest.fn() }));
jest.mock("@/data/exercice/exercice-data", () => ({ getExerciceByIdData: jest.fn() }));
jest.mock("@/data/exercice/practice-data", () => ({
  getPracticeStateData: jest.fn(),
  createPracticeAttemptData: jest.fn(),
  revealPracticeCorrectionData: jest.fn(),
  getPracticeExercisesForStudentData: jest.fn(),
}));

const mockedUser = currentUser as jest.Mock;
const mockedGroup = getGroupByStudentIdData as jest.Mock;
const mockedExercice = getExerciceByIdData as jest.Mock;
const mockedState = getPracticeStateData as jest.Mock;
const mockedCreate = createPracticeAttemptData as jest.Mock;
const mockedReveal = revealPracticeCorrectionData as jest.Mock;
const mockedList = getPracticeExercisesForStudentData as jest.Mock;

const content = [
  { question: "Le ciel est bleu", answer: true },
  { question: "2 + 2 = 5", answer: false },
];

const practice: ExerciceOutput = {
  id: "ex1",
  title: "Vrai ou faux",
  kind: "PRACTICE",
  description: "Réponds",
  content,
  lesson: { id: "l1", title: "Leçon", LessonSubject: { label: "Sciences", color: "bg-blue-500" } },
  level: { id: "lv1", label: "Facile", color: "bg-green-500" },
  type: { id: "t1", name: "Vrai ou Faux" },
  groups: [{ id: "g1" }],
};

const answers = {
  exerciceId: "ex1",
  response: [
    { index: 0, answer: true },
    { index: 1, answer: true }, // faux
  ],
};

const attempt = (note: number, day: number) => ({
  id: `a${day}`,
  note,
  coeficient: 5,
  response: answers.response,
  createdAt: new Date(`2026-11-0${day}T10:00:00Z`),
});

beforeEach(() => {
  mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT", name: "Léa" });
  mockedGroup.mockResolvedValue({ id: "g1", authorId: "t1" });
  mockedExercice.mockResolvedValue(practice);
  mockedState.mockResolvedValue({ attempts: [], correctionSeenAt: null });
  mockedCreate.mockResolvedValue({ id: "new" });
  mockedReveal.mockResolvedValue({ revealedAt: new Date() });
});

describe("accès", () => {
  it("refuse un professeur ou un visiteur", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    expect((await getPracticeAction("ex1")).error).toBe("Action non autorisée !");
    mockedUser.mockResolvedValue(undefined);
    expect((await submitPracticeAttemptAction(answers)).error).toBe("Action non autorisée !");
  });

  it("refuse un contrôle : il ne se joue pas en entraînement", async () => {
    mockedExercice.mockResolvedValue({ ...practice, kind: "CONTROL" });
    expect((await getPracticeAction("ex1")).error).toBe("Exercice non trouvé");
    expect((await submitPracticeAttemptAction(answers)).error).toBe("Exercice non trouvé");
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it("refuse un entraînement qui n'est pas attribué au groupe de l'élève", async () => {
    mockedExercice.mockResolvedValue({ ...practice, groups: [{ id: "autre" }] });
    expect((await getPracticeAction("ex1")).error).toBe("Exercice non trouvé");
    mockedGroup.mockResolvedValue(null);
    expect((await revealPracticeCorrectionAction("ex1")).error).toBe("Exercice non trouvé");
  });
});

describe("getPracticeAction", () => {
  it("renvoie l'exercice sans ses solutions et sans correction tant qu'elle n'est pas vue", async () => {
    mockedState.mockResolvedValue({ attempts: [attempt(2.5, 1)], correctionSeenAt: null });
    const result = await getPracticeAction("ex1");
    expect(result.data?.exercice.content).toEqual([
      { question: "Le ciel est bleu", answer: null },
      { question: "2 + 2 = 5", answer: null },
    ]);
    expect(result.data?.correction).toBeNull();
    expect(result.data?.summary).toMatchObject({ attempts: 1, canAttempt: true, canRevealCorrection: true });
  });

  it("renvoie la correction du dernier essai une fois vue", async () => {
    mockedState.mockResolvedValue({
      attempts: [attempt(0, 1), attempt(2.5, 2)],
      correctionSeenAt: new Date("2026-11-03T10:00:00Z"),
    });
    const result = await getPracticeAction("ex1");
    expect(result.data?.correction).toEqual({
      type: "Vrai ou Faux",
      content,
      response: answers.response,
      note: 2.5,
      coeficient: 5,
    });
    expect(result.data?.summary.canAttempt).toBe(false);
  });
});

describe("submitPracticeAttemptAction", () => {
  it("corrige côté serveur, enregistre l'essai et ne renvoie que la note", async () => {
    mockedState.mockResolvedValue({ attempts: [attempt(1, 1), attempt(2.5, 2)], correctionSeenAt: null });
    const result = await submitPracticeAttemptAction(answers);

    expect(mockedCreate).toHaveBeenCalledWith({
      studentId: "s1",
      exerciceId: "ex1",
      response: answers.response,
      note: 2.5,
      coeficient: 5,
    });
    expect("practice" in result && result.practice).toEqual({
      note: 2.5,
      coeficient: 5,
      attempt: 2,
      bestPercent: 50,
    });
    // Ni copie notée (pas de redirection) ni correction
    expect("data" in result && result.data).toBeNull();
    expect(JSON.stringify(result)).not.toContain("2 + 2 = 5");
  });

  it("refuse un essai après la correction", async () => {
    mockedCreate.mockResolvedValue(null);
    expect((await submitPracticeAttemptAction(answers)).error).toMatch(/déjà vu la correction/);
  });

  it("refuse une réponse mal formée", async () => {
    const result = await submitPracticeAttemptAction({ exerciceId: "ex1", response: "x" } as never);
    expect(result.error).toBe("Données non valide !");
    expect(mockedExercice).not.toHaveBeenCalled();
  });
});

describe("revealPracticeCorrectionAction", () => {
  it("exige au moins un essai", async () => {
    const result = await revealPracticeCorrectionAction("ex1");
    expect(result.error).toMatch(/au moins un essai/);
    expect(mockedReveal).not.toHaveBeenCalled();
  });

  it("enregistre que la correction est vue et la renvoie", async () => {
    mockedState.mockResolvedValue({ attempts: [attempt(2.5, 1)], correctionSeenAt: null });
    const result = await revealPracticeCorrectionAction("ex1");
    expect(mockedReveal).toHaveBeenCalledWith("s1", "ex1");
    expect(result.correction?.content).toEqual(content);
  });
});

describe("getPracticeListAction", () => {
  it("résume l'avancement de chaque entraînement", async () => {
    mockedList.mockResolvedValue([
      {
        id: "ex1",
        title: "Vrai ou faux",
        description: "Réponds",
        lesson: { LessonSubject: { label: "Sciences", color: "bg-blue-500" } },
        level: { label: "Facile", color: "bg-green-500" },
        type: { name: "Vrai ou Faux" },
        practiceAttempts: [attempt(2.5, 1), attempt(5, 2)],
        practiceCorrections: [],
      },
    ]);
    const result = await getPracticeListAction();
    expect(result.data?.[0].summary).toMatchObject({
      status: "in-progress",
      attempts: 2,
      bestPercent: 100,
      lastPercent: 100,
    });
  });

  it("renvoie une liste vide pour un élève sans groupe", async () => {
    mockedGroup.mockResolvedValue(null);
    expect((await getPracticeListAction()).data).toEqual([]);
  });
});
