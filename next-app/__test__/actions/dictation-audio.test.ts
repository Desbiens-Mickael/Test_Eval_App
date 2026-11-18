/**
 * @jest-environment node
 */
import { deleteExercicesAction, updateExerciceAction } from "@/actions/exercice.action";
import {
  cleanUpDictationAudioSafeData,
  getDictationAudioOfExercicesData,
} from "@/data/exercice/dictation-audio.data";
import {
  deleteExercicesData,
  getExerciceByIdData,
  getExercicesInfoBeforeDelete,
  getExercicesWithAuthor,
  updateExerciceData,
} from "@/data/exercice/exercice-data";
import { getExerciceTypeByIdData } from "@/data/exercice/exercice-type.data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/control-closure.data", () => ({
  closeExpiredControlsSafeData: jest.fn(),
}));
jest.mock("@/data/exercice/dictation-audio.data", () => ({
  ...jest.requireActual("@/data/exercice/dictation-audio.data"),
  cleanUpDictationAudioSafeData: jest.fn(),
  getDictationAudioOfExercicesData: jest.fn(),
}));
jest.mock("@/data/exercice/exercice-data");
jest.mock("@/data/exercice/exercice-type.data");
jest.mock("@/data/exercice/practice-data");
jest.mock("@/data/group.data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");

const OLD = "11111111-1111-4111-8111-111111111111.webm";
const NEW = "22222222-2222-4222-8222-222222222222.m4a";

const formData = (audio: string) => ({
  title: "Dictée",
  kind: "PRACTICE" as const,
  description: "Écoute",
  exerciceTypeId: "ty-dictee",
  exerciceLevelId: "lv1",
  opensAt: null,
  closesAt: null,
  content: { audio, text: "Le chat dort." },
});

beforeEach(() => {
  jest.clearAllMocks();
  (currentUser as jest.Mock).mockResolvedValue({ id: "t1", role: "ADMIN" });
  (getExerciceTypeByIdData as jest.Mock).mockResolvedValue({ id: "ty-dictee", name: "Dictée" });
  (getExerciceByIdData as jest.Mock).mockResolvedValue({
    id: "ex1",
    authorId: "t1",
    kind: "PRACTICE",
    closedAt: null,
    opensAt: null,
    closesAt: null,
    content: { audio: OLD, text: "Le chat dort." },
  });
  (updateExerciceData as jest.Mock).mockResolvedValue({ id: "ex1", kind: "PRACTICE" });
});

describe("audio d'une dictée", () => {
  it("une dictée peut servir d'exercice (corrigée automatiquement)", async () => {
    const result = await updateExerciceAction("ex1", formData(OLD));
    expect(result.success).toBeDefined();
  });

  it("supprime l'ancien audio quand il est remplacé", async () => {
    await updateExerciceAction("ex1", formData(NEW));
    expect(cleanUpDictationAudioSafeData).toHaveBeenCalledWith(new Set([OLD]));
  });

  it("garde l'audio quand il ne change pas", async () => {
    await updateExerciceAction("ex1", formData(OLD));
    expect(cleanUpDictationAudioSafeData).not.toHaveBeenCalled();
  });

  it("supprime l'audio des dictées supprimées", async () => {
    (getExercicesWithAuthor as jest.Mock).mockResolvedValue([{ id: "ex1", authorId: "t1" }]);
    (getExercicesInfoBeforeDelete as jest.Mock).mockResolvedValue([]);
    (getDictationAudioOfExercicesData as jest.Mock).mockResolvedValue(new Set([OLD]));

    const result = await deleteExercicesAction(["ex1"]);
    expect(result.success).toBeDefined();
    expect(deleteExercicesData).toHaveBeenCalled();
    expect(cleanUpDictationAudioSafeData).toHaveBeenCalledWith(new Set([OLD]));
  });
});
