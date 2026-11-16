/**
 * @jest-environment node
 */
import {
  addExerciceResultAction,
  getExerciceByIdAction,
  updateExerciceAction,
} from "@/actions/exercice.action";
import {
  addExerciceResultData,
  getExerciceByIdData,
  getStudentExerciceByStudentIdData,
  updateExerciceData,
} from "@/data/exercice/exercice-data";
import { countExerciceSubmissionsData } from "@/data/exercice/practice-data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/exercice-data");
jest.mock("@/data/exercice/exercice-type.data");
jest.mock("@/data/exercice/practice-data");
jest.mock("@/data/group.data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");

const mockedUser = currentUser as jest.Mock;
const mockedExercice = getExerciceByIdData as jest.Mock;

const exercice = {
  id: "ex1",
  authorId: "t1",
  title: "Vrai ou faux",
  kind: "PRACTICE",
  description: "Réponds",
  content: [{ question: "Le ciel est bleu", answer: true }],
  lesson: { id: "l1", title: "Leçon", LessonSubject: { label: "Sciences", color: "bg-blue-500" } },
  level: { id: "lv1", label: "Facile", color: "bg-green-500" },
  type: { id: "t1", name: "Vrai ou Faux" },
  groups: [{ id: "g1" }],
};

const formData = {
  title: "Vrai ou faux",
  kind: "CONTROL" as const,
  description: "Réponds",
  exerciceTypeId: "t1",
  exerciceLevelId: "lv1",
  content: [{ question: "Le ciel est bleu", answer: true }] as [
    { question: string; answer: boolean },
  ],
};

beforeEach(() => {
  mockedExercice.mockResolvedValue(exercice);
  (getGroupByStudentIdData as jest.Mock).mockResolvedValue({ id: "g1", authorId: "t1" });
  (getStudentExerciceByStudentIdData as jest.Mock).mockResolvedValue([]);
  (updateExerciceData as jest.Mock).mockResolvedValue({ id: "ex1" });
});

describe("un entraînement ne donne jamais de copie notée", () => {
  beforeEach(() => mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT", name: "Léa" }));

  it("refuse l'envoi d'une copie notée", async () => {
    const result = await addExerciceResultAction({
      exerciceId: "ex1",
      response: [{ index: 0, answer: true }],
    });
    expect(result.error).toMatch(/entraînement/);
    expect(addExerciceResultData).not.toHaveBeenCalled();
  });

  it("renvoie l'élève vers la page d'entraînement", async () => {
    const result = await getExerciceByIdAction("ex1");
    expect(result.data).toBeNull();
    expect(result.redirect).toBe("/eleve/entrainements/ex1");
  });
});

describe("changement de type par le professeur", () => {
  beforeEach(() => mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" }));

  it("est refusé quand des élèves ont déjà fait l'exercice", async () => {
    (countExerciceSubmissionsData as jest.Mock).mockResolvedValue(3);
    const result = await updateExerciceAction("ex1", formData);
    expect(result.error).toMatch(/ne peut plus être changé/);
    expect(updateExerciceData).not.toHaveBeenCalled();
  });

  it("est accepté tant que personne n'a fait l'exercice", async () => {
    (countExerciceSubmissionsData as jest.Mock).mockResolvedValue(0);
    const result = await updateExerciceAction("ex1", formData);
    expect(result.success).toBeDefined();
    expect(updateExerciceData).toHaveBeenCalledWith("ex1", "t1", formData);
  });

  it("les autres modifications restent possibles après des copies", async () => {
    (countExerciceSubmissionsData as jest.Mock).mockResolvedValue(3);
    const result = await updateExerciceAction("ex1", { ...formData, kind: "PRACTICE", title: "Nouveau titre" });
    expect(result.success).toBeDefined();
  });
});
