/**
 * @jest-environment node
 */
import {
  addExerciceResultAction,
  getExerciceByIdAction,
  getExercisesDoneAction,
  getExercisesToDoAction,
  getStudentExerciceByIdAction,
  updateExerciceAction,
} from "@/actions/exercice.action";
import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import {
  addExerciceResultData,
  getExerciceByIdData,
  getExercisesByGroupIdAndSubjectData,
  getStudentExerciceByIdData,
  getStudentExerciceByStudentIdData,
  updateExerciceData,
} from "@/data/exercice/exercice-data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { createNotificationCompletionData } from "@/data/notification/notification.data";
import { getStudentByIdData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/control-closure.data", () => ({
  closeExpiredControlsSafeData: jest.fn(),
}));
jest.mock("@/data/exercice/exercice-data");
jest.mock("@/data/exercice/exercice-type.data");
jest.mock("@/data/exercice/practice-data");
jest.mock("@/data/group.data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");

const mockedUser = currentUser as jest.Mock;
const mockedExercice = getExerciceByIdData as jest.Mock;

const DAY = 24 * 60 * 60 * 1000;
const past = () => new Date(Date.now() - DAY);
const future = () => new Date(Date.now() + DAY);

const control = (period: {
  opensAt?: Date | null;
  closesAt?: Date | null;
  closedAt?: Date | null;
}) => ({
  id: "ex1",
  authorId: "t1",
  title: "Contrôle",
  kind: "CONTROL",
  description: "Réponds",
  content: [{ question: "Le ciel est bleu", answer: true }],
  opensAt: null,
  closesAt: null,
  closedAt: null,
  lesson: { id: "l1", title: "Leçon", LessonSubject: { label: "Sciences", color: "bg-blue-500" } },
  level: { id: "lv1", label: "Facile", color: "bg-green-500" },
  type: { id: "ty1", name: "Vrai ou Faux" },
  groups: [{ id: "g1" }],
  ...period,
});

const asStudent = () => mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT", name: "Léa" });
const asTeacher = () => mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });

beforeEach(() => {
  jest.clearAllMocks();
  (getGroupByStudentIdData as jest.Mock).mockResolvedValue({ id: "g1", authorId: "t1" });
  (getStudentExerciceByStudentIdData as jest.Mock).mockResolvedValue([]);
  (addExerciceResultData as jest.Mock).mockResolvedValue({ id: "se1" });
  (createNotificationCompletionData as jest.Mock).mockResolvedValue({ id: "n1" });
});

describe("rendre une copie", () => {
  beforeEach(asStudent);
  const submit = () =>
    addExerciceResultAction({ exerciceId: "ex1", response: [{ index: 0, answer: true }] });

  it("refuse un contrôle pas encore ouvert", async () => {
    mockedExercice.mockResolvedValue(control({ opensAt: future() }));
    expect((await submit()).error).toMatch(/ouvrira le/);
    expect(addExerciceResultData).not.toHaveBeenCalled();
  });

  it("refuse un contrôle clos", async () => {
    mockedExercice.mockResolvedValue(control({ closesAt: past() }));
    expect((await submit()).error).toMatch(/clos/);
    expect(addExerciceResultData).not.toHaveBeenCalled();
  });

  it("accepte un contrôle ouvert", async () => {
    mockedExercice.mockResolvedValue(control({ opensAt: past(), closesAt: future() }));
    expect((await submit()).success).toBeDefined();
    expect(addExerciceResultData).toHaveBeenCalled();
  });
});

describe("ouvrir un contrôle", () => {
  beforeEach(asStudent);

  it("renvoie l'élève à la liste hors de la période", async () => {
    mockedExercice.mockResolvedValue(control({ opensAt: future() }));
    const result = await getExerciceByIdAction("ex1");
    expect(result.data).toBeNull();
    expect(result.redirect).toBe("/eleve/exercices");
  });

  it("le professeur l'ouvre toujours", async () => {
    asTeacher();
    mockedExercice.mockResolvedValue(control({ opensAt: future() }));
    expect((await getExerciceByIdAction("ex1")).data).not.toBeNull();
  });
});

describe("contrôles à faire", () => {
  beforeEach(asStudent);

  it("clôture d'abord les contrôles expirés et retire les contrôles clos", async () => {
    (getExercisesByGroupIdAndSubjectData as jest.Mock).mockResolvedValue([
      { id: "open", opensAt: null, closesAt: future() },
      { id: "upcoming", opensAt: future(), closesAt: null },
      { id: "closed", opensAt: null, closesAt: past() },
    ]);
    const result = await getExercisesToDoAction();
    expect(closeExpiredControlsSafeData).toHaveBeenCalled();
    expect(result.data?.map((e) => e.id)).toEqual(["open", "upcoming"]);
  });
});

describe("notes avant la clôture", () => {
  const copy = (closesAt: Date | null) => ({
    id: "se1",
    studentId: "s1",
    exerciceId: "ex1",
    note: 4,
    coeficient: 5,
    isMissing: false,
    createdAt: new Date(),
    exercice: { title: "Contrôle", closesAt, lesson: { LessonSubject: { label: "Sciences", color: "c" } } },
  });

  it("l'élève ne voit pas sa note avant la clôture", async () => {
    asStudent();
    const closesAt = future();
    (getStudentExerciceByStudentIdData as jest.Mock).mockResolvedValue([copy(closesAt)]);
    const [card] = (await getExercisesDoneAction()).data ?? [];
    expect(card.note).toBeNull();
    expect(card.resultsAvailableAt).toEqual(closesAt);
  });

  it("l'élève voit sa note après la clôture", async () => {
    asStudent();
    (getStudentExerciceByStudentIdData as jest.Mock).mockResolvedValue([copy(past())]);
    const [card] = (await getExercisesDoneAction()).data ?? [];
    expect(card.note).toBe(4);
    expect(card.resultsAvailableAt).toBeNull();
  });

  it("le professeur voit toujours la note", async () => {
    asTeacher();
    (getStudentByIdData as jest.Mock).mockResolvedValue({ id: "s1", professorId: "t1" });
    (getStudentExerciceByStudentIdData as jest.Mock).mockResolvedValue([copy(future())]);
    const [card] = (await getExercisesDoneAction(undefined, "s1")).data ?? [];
    expect(card.note).toBe(4);
  });

  it("l'élève ne peut pas ouvrir la correction avant la clôture", async () => {
    asStudent();
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue({
      ...copy(future()),
      student: { id: "s1", name: "Léa", professorId: "t1" },
    });
    const result = await getStudentExerciceByIdAction("se1");
    expect(result.data).toBeNull();
    expect(result.error).toMatch(/disponible le/);
  });
});

describe("modifier les dates", () => {
  beforeEach(asTeacher);
  const formData = {
    title: "Contrôle",
    kind: "CONTROL" as const,
    description: "Réponds",
    exerciceTypeId: "ty1",
    exerciceLevelId: "lv1",
    content: [{ question: "Le ciel est bleu", answer: true }] as [
      { question: string; answer: boolean },
    ],
  };

  it("refuse de changer les dates d'un contrôle clos", async () => {
    const closesAt = past();
    mockedExercice.mockResolvedValue(control({ closesAt, closedAt: closesAt }));
    const result = await updateExerciceAction("ex1", {
      ...formData,
      opensAt: null,
      closesAt: future(),
    });
    expect(result.error).toMatch(/clos/);
    expect(updateExerciceData).not.toHaveBeenCalled();
  });

  it("accepte de modifier un contrôle clos sans toucher aux dates", async () => {
    const closesAt = past();
    mockedExercice.mockResolvedValue(control({ closesAt, closedAt: closesAt }));
    (updateExerciceData as jest.Mock).mockResolvedValue({ id: "ex1", kind: "CONTROL" });
    const result = await updateExerciceAction("ex1", {
      ...formData,
      opensAt: null,
      closesAt: new Date(closesAt),
    });
    expect(result.success).toBeDefined();
  });
});
