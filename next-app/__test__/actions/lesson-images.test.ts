/**
 * @jest-environment node
 */
import { deleteLessonsAction, updateLessonAction } from "@/actions/lesson.action";
import {
  deleteLessonsData,
  getLessonByIdData,
  getLessonsInfoBeforeDelete,
  getLessonsWithAuthor,
  updateLessonData,
} from "@/data/lesson/lesson-data";
import { cleanUpLessonImagesSafeData } from "@/data/lesson/lesson-images.data";
import { currentUser } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/group.data");
jest.mock("@/data/student-data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/lesson/lesson-images.data", () => ({ cleanUpLessonImagesSafeData: jest.fn() }));

const OLD = "11111111-2222-4333-8444-555555555555.webp";
const KEPT = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee.webp";
const NEW = "99999999-8888-4777-8666-555555555555.webp";
const src = (name: string) => `http://localhost:8000/lesson/${name}`;
const doc = (...names: string[]) => ({
  type: "doc",
  content: names.map((name) => ({ type: "image", attrs: { src: src(name) } })),
});

const cleanUp = cleanUpLessonImagesSafeData as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  (currentUser as jest.Mock).mockResolvedValue({ id: "t1", role: "ADMIN" });
});

describe("updateLessonAction", () => {
  const input = {
    title: "Leçon",
    imageBanner: src(NEW),
    LessonSubjectID: "s1",
    GradeLevelsID: "g1",
    content: JSON.stringify(doc(KEPT)),
  };

  beforeEach(() => {
    (getLessonByIdData as jest.Mock).mockResolvedValue({
      id: "l1",
      authorId: "t1",
      imageBanner: src(OLD),
      content: doc(KEPT, OLD.replace("1111", "2222")),
    });
  });

  it("supprime, après l'enregistrement, les images retirées de la leçon", async () => {
    (updateLessonData as jest.Mock).mockResolvedValue({ slug: "lecon", LessonSubject: { label: "Français" } });
    const result = await updateLessonAction("l1", input);
    expect(result.success).toBeDefined();
    const [candidates] = cleanUp.mock.calls[0];
    // Ancienne bannière et image retirée du contenu ; l'image conservée reste
    expect(candidates).toEqual(new Set([OLD, OLD.replace("1111", "2222")]));
    expect((updateLessonData as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
      cleanUp.mock.invocationCallOrder[0]
    );
  });

  it("ne supprime rien si l'enregistrement échoue", async () => {
    (updateLessonData as jest.Mock).mockRejectedValue(new Error("base indisponible"));
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    const result = await updateLessonAction("l1", input);
    expect(result.error).toBeDefined();
    expect(cleanUp).not.toHaveBeenCalled();
  });
});

it("deleteLessonsAction nettoie la bannière et les images du contenu des leçons supprimées", async () => {
  (getLessonsWithAuthor as jest.Mock).mockResolvedValue([
    { id: "l1", authorId: "t1", imageBanner: src(OLD), content: doc(KEPT) },
  ]);
  (getLessonsInfoBeforeDelete as jest.Mock).mockResolvedValue([]);
  (deleteLessonsData as jest.Mock).mockResolvedValue({ count: 1 });

  const result = await deleteLessonsAction(["l1"]);
  expect(result.success).toBeDefined();
  expect(cleanUp).toHaveBeenCalledWith(new Set([OLD, KEPT]));
});
