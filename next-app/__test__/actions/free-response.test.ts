/**
 * @jest-environment node
 */
import {
  addExerciceResultAction,
  createExerciceAction,
  getStudentExerciceByIdAction,
} from "@/actions/exercice.action";
import {
  reviewFreeResponseAction,
  reviewStudentExerciceAction,
} from "@/actions/exercice-review.action";
import {
  addExerciceResultData,
  createExerciceData,
  getExerciceByIdData,
  getStudentExerciceByIdData,
  saveFreeResponseReviewData,
  updateStudentExerciceReviewData,
} from "@/data/exercice/exercice-data";
import { getExerciceTypeByIdData } from "@/data/exercice/exercice-type.data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { getLessonBySlugData } from "@/data/lesson/lesson-data";
import {
  createNotificationCompletionData,
  createNotificationCorrectionData,
  createStudentNotificationData,
} from "@/data/notification/notification.data";
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
jest.mock("@/data/lesson/lesson-activities.data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");

const mockedUser = currentUser as jest.Mock;
const asStudent = () => mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT", name: "Léa" });
const asTeacher = () => mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });

const DAY = 24 * 60 * 60 * 1000;

const content = [
  { question: "Pourquoi le Soleil brille-t-il ?", points: 4, modelAnswer: "La fusion nucléaire" },
  { question: "Cite une étoile.", points: 1, modelAnswer: "" },
];

const control = {
  id: "ex1",
  authorId: "t1",
  title: "Le Soleil",
  kind: "CONTROL",
  description: "Réponds",
  content,
  opensAt: null,
  closesAt: null,
  closedAt: null,
  lesson: { id: "l1", title: "Leçon", LessonSubject: { label: "Physique", color: "bg-blue-500" } },
  level: { id: "lv1", label: "Difficile", color: "bg-yellow-500" },
  type: { id: "ty-free", name: "Réponse libre" },
  groups: [{ id: "g1" }],
};

const copy = (over: Record<string, unknown> = {}) => ({
  id: "se1",
  studentId: "s1",
  exerciceId: "ex1",
  note: 0,
  autoNote: null,
  coeficient: 10,
  teacherComment: null,
  reviewedAt: null,
  isMissing: false,
  pendingReview: true,
  questionReviews: null,
  response: [
    { index: 0, answer: "Grâce à la fusion" },
    { index: 1, answer: "Sirius" },
  ],
  exercice: {
    id: "ex1",
    title: "Le Soleil",
    description: "Réponds",
    content,
    closesAt: null,
    lessonID: "l1",
    type: { name: "Réponse libre" },
  },
  student: { id: "s1", name: "Léa", professorId: "t1" },
  ...over,
});

beforeEach(() => {
  jest.clearAllMocks();
  (getExerciceTypeByIdData as jest.Mock).mockResolvedValue({ id: "ty-free", name: "Réponse libre" });
  (getGroupByStudentIdData as jest.Mock).mockResolvedValue({ id: "g1", authorId: "t1" });
  (getExerciceByIdData as jest.Mock).mockResolvedValue(control);
  (addExerciceResultData as jest.Mock).mockResolvedValue({ id: "se1" });
  (createNotificationCompletionData as jest.Mock).mockResolvedValue({ id: "n1" });
  (createNotificationCorrectionData as jest.Mock).mockResolvedValue({ id: "n2" });
  (saveFreeResponseReviewData as jest.Mock).mockResolvedValue({ id: "se1" });
});

describe("créer une réponse libre", () => {
  const formData = (kind: "CONTROL" | "PRACTICE") => ({
    title: "Le Soleil",
    kind,
    description: "Réponds",
    exerciceTypeId: "ty-free",
    exerciceLevelId: "lv1",
    opensAt: null,
    closesAt: null,
    content,
  });

  beforeEach(() => {
    asTeacher();
    (getLessonBySlugData as jest.Mock).mockResolvedValue({ id: "l1" });
    (createExerciceData as jest.Mock).mockResolvedValue({ id: "ex1", kind: "CONTROL" });
  });

  it("refuse d'en faire un exercice (entraînement)", async () => {
    const result = await createExerciceAction(formData("PRACTICE"), "lecon");
    expect(result.error).toMatch(/qu'un contrôle/);
    expect(createExerciceData).not.toHaveBeenCalled();
  });

  it("accepte un contrôle", async () => {
    const result = await createExerciceAction(formData("CONTROL"), "lecon");
    expect(result.success).toBeDefined();
  });
});

describe("rendre une copie", () => {
  beforeEach(asStudent);

  it("enregistre une copie en attente, sans note", async () => {
    const response = [
      { index: 0, answer: "Grâce à la fusion" },
      { index: 1, answer: "" },
    ];
    const result = await addExerciceResultAction({ exerciceId: "ex1", response });
    expect(result.success).toBeDefined();
    expect(addExerciceResultData).toHaveBeenCalledWith(
      "s1",
      "Physique",
      { exerciceId: "ex1", response },
      { note: 0, coeficient: 10, pendingReview: true }
    );
    expect(createNotificationCompletionData).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Léa a rendu « Le Soleil » : copie à corriger" })
    );
  });

  it("refuse une réponse à une question qui n'existe pas", async () => {
    const result = await addExerciceResultAction({
      exerciceId: "ex1",
      response: [{ index: 5, answer: "?" }],
    });
    expect(result.error).toBeDefined();
    expect(addExerciceResultData).not.toHaveBeenCalled();
  });

  it("refuse une réponse trop longue", async () => {
    const result = await addExerciceResultAction({
      exerciceId: "ex1",
      response: [{ index: 0, answer: "a".repeat(5001) }],
    });
    expect(result.error).toBeDefined();
    expect(addExerciceResultData).not.toHaveBeenCalled();
  });
});

describe("copie vue par l'élève", () => {
  beforeEach(asStudent);

  it("cache les réponses attendues tant que la copie n'est pas corrigée", async () => {
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy());
    const { data } = await getStudentExerciceByIdAction("se1");
    expect(data?.exercice?.content).toEqual([
      { question: "Pourquoi le Soleil brille-t-il ?", points: 4 },
      { question: "Cite une étoile.", points: 1 },
    ]);
  });

  it("montre les réponses attendues une fois la copie corrigée", async () => {
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy({ pendingReview: false }));
    const { data } = await getStudentExerciceByIdAction("se1");
    expect(data?.exercice?.content).toEqual(content);
  });

  it("le professeur voit toujours les réponses attendues", async () => {
    asTeacher();
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy());
    const { data } = await getStudentExerciceByIdAction("se1");
    expect(data?.exercice?.content).toEqual(content);
  });
});

describe("corriger une copie", () => {
  const input = {
    reviews: [
      { points: 3, comment: "Précise le rôle de l'hydrogène" },
      { points: 1, comment: "" },
    ],
    comment: "Bon travail",
  };

  beforeEach(() => {
    asTeacher();
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy());
  });

  it("refuse un élève qui n'est pas le sien", async () => {
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(
      copy({ student: { id: "s1", name: "Léa", professorId: "autre" } })
    );
    expect((await reviewFreeResponseAction("se1", input)).error).toBeDefined();
    expect(saveFreeResponseReviewData).not.toHaveBeenCalled();
  });

  it("refuse un élève", async () => {
    asStudent();
    expect((await reviewFreeResponseAction("se1", input)).error).toBeDefined();
  });

  it("refuse plus de points que le barème", async () => {
    const result = await reviewFreeResponseAction("se1", {
      ...input,
      reviews: [input.reviews[0], { points: 2, comment: "" }],
    });
    expect(result.error).toBe("Cette question est notée sur 1");
    expect(saveFreeResponseReviewData).not.toHaveBeenCalled();
  });

  it("calcule la note sur le coefficient et enregistre les commentaires", async () => {
    const result = await reviewFreeResponseAction("se1", input);
    expect(result.success).toBeDefined();
    // 4 points sur 5, coefficient 10
    expect(saveFreeResponseReviewData).toHaveBeenCalledWith("se1", {
      note: 8,
      teacherComment: "Bon travail",
      questionReviews: [
        { points: 3, comment: "Précise le rôle de l'hydrogène" },
        { points: 1, comment: null },
      ],
    });
  });

  it("prévient l'élève quand ses résultats sont visibles", async () => {
    await reviewFreeResponseAction("se1", input);
    expect(createNotificationCorrectionData).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Ta copie « Le Soleil » a été corrigée : 8/10" })
    );
    expect(createStudentNotificationData).toHaveBeenCalledWith("n2", [{ id: "s1" }]);
  });

  it("ne prévient pas l'élève avant la clôture du contrôle", async () => {
    const base = copy();
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue({
      ...base,
      exercice: { ...base.exercice, closesAt: new Date(Date.now() + DAY) },
    });
    expect((await reviewFreeResponseAction("se1", input)).success).toBeDefined();
    expect(createNotificationCorrectionData).not.toHaveBeenCalled();
  });

  it("signale une correction modifiée", async () => {
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy({ pendingReview: false }));
    await reviewFreeResponseAction("se1", input);
    expect(createNotificationCorrectionData).toHaveBeenCalledWith(
      expect.objectContaining({ message: "La correction de « Le Soleil » a été modifiée : 8/10" })
    );
  });

  it("la relecture globale est refusée pour une réponse libre", async () => {
    const result = await reviewStudentExerciceAction("se1", { note: 10, comment: "" });
    expect(result.error).toMatch(/question par question/);
    expect(updateStudentExerciceReviewData).not.toHaveBeenCalled();
  });
});
