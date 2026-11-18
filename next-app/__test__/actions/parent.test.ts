/**
 * @jest-environment node
 */
import { getExercisesDoneAction, getStudentExerciceByIdAction } from "@/actions/exercice.action";
import { setStudentParentEmailAction } from "@/actions/parent-access.action";
import {
  changeParentPasswordAction,
  getChildProgressAction,
  setParentNotificationsAction,
} from "@/actions/parent.action";
import { getStudentProgressRawData } from "@/data/dashboard/student-progress.data";
import {
  getStudentExerciceByIdData,
  getStudentExercicesPageData,
} from "@/data/exercice/exercice-data";
import { getGroupByStudentIdData } from "@/data/group.data";
import { isParentOfStudentData, setParentNotificationsData } from "@/data/parent-data";
import { getStudentByIdData } from "@/data/student-data";
import { UpdateUserData, getUserByIdData } from "@/data/user-data";
import { currentUser } from "@/lib/auth";
import { verifyPassword } from "@/lib/hash-password";
import { applyStudentParentEmail } from "@/lib/parent-access";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/lib/parent-access", () => ({ applyStudentParentEmail: jest.fn() }));
jest.mock("@/lib/hash-password", () => ({
  hashPassword: jest.fn(async (p: string) => `hash:${p}`),
  verifyPassword: jest.fn(),
}));
jest.mock("@/data/exercice/control-closure.data", () => ({
  closeExpiredControlsSafeData: jest.fn(),
}));
jest.mock("@/data/parent-data", () => ({
  isParentOfStudentData: jest.fn(),
  getChildrenOfParentData: jest.fn(),
  getParentSettingsData: jest.fn(),
  setParentNotificationsData: jest.fn(),
}));
jest.mock("@/data/dashboard/student-progress.data");
jest.mock("@/data/exercice/exercice-data");
jest.mock("@/data/exercice/exercice-type.data");
jest.mock("@/data/exercice/practice-data");
jest.mock("@/data/group.data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/lesson/lesson-activities.data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");
jest.mock("@/data/user-data");

const mockedUser = currentUser as jest.Mock;
const asParent = () => mockedUser.mockResolvedValue({ id: "p1", role: "PARENT" });
const isParent = isParentOfStudentData as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  isParent.mockImplementation(async (_parentId: string, studentId: string) => studentId === "s1");
});

describe("e-mail du parent sur la fiche élève", () => {
  beforeEach(() => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN", email: "prof@ecole.fr" });
    (getStudentByIdData as jest.Mock).mockResolvedValue({ id: "s1", name: "Léa", professorId: "t1" });
    (applyStudentParentEmail as jest.Mock).mockResolvedValue({ message: "ok" });
  });

  it("le professeur de l'élève déclenche la création de l'accès", async () => {
    const result = await setStudentParentEmailAction("s1", " Maman@Exemple.fr ");
    expect(result).toEqual({ success: "ok", parentEmail: "maman@exemple.fr" });
    expect(applyStudentParentEmail).toHaveBeenCalledWith({
      studentId: "s1",
      studentName: "Léa",
      email: "maman@exemple.fr",
      teacherEmail: "prof@ecole.fr",
    });
  });

  it("un champ vide retire l'accès", async () => {
    await setStudentParentEmailAction("s1", "");
    expect(applyStudentParentEmail).toHaveBeenCalledWith(expect.objectContaining({ email: null }));
  });

  it("refuse l'élève d'un autre professeur", async () => {
    (getStudentByIdData as jest.Mock).mockResolvedValue({ id: "s1", name: "Léa", professorId: "t2" });
    expect((await setStudentParentEmailAction("s1", "maman@exemple.fr")).error).toBeDefined();
    expect(applyStudentParentEmail).not.toHaveBeenCalled();
  });

  it("refuse un parent ou un élève", async () => {
    asParent();
    expect((await setStudentParentEmailAction("s1", "x@y.fr")).error).toBeDefined();
    mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
    expect((await setStudentParentEmailAction("s1", "x@y.fr")).error).toBeDefined();
  });

  it("refuse une adresse invalide", async () => {
    expect((await setStudentParentEmailAction("s1", "pas-une-adresse")).error).toMatch(/invalide/);
  });
});

describe("espace parent : accès aux enfants", () => {
  beforeEach(asParent);

  it("voit la progression de son enfant", async () => {
    (getStudentProgressRawData as jest.Mock).mockResolvedValue({
      studentName: "Léa",
      results: [],
      assigned: [],
      subjectColors: {},
    });
    const result = await getChildProgressAction("s1");
    expect("data" in result && result.data?.studentName).toBe("Léa");
  });

  it("ne voit pas un enfant qui n'est pas le sien", async () => {
    expect("error" in (await getChildProgressAction("s2"))).toBe(true);
    expect(getStudentProgressRawData).not.toHaveBeenCalled();
  });

  it("liste les copies de son enfant, notes cachées avant la clôture", async () => {
    (getGroupByStudentIdData as jest.Mock).mockResolvedValue({ id: "g1" });
    (getStudentExercicesPageData as jest.Mock).mockResolvedValue({
      items: [
        {
          id: "se1",
          exerciceId: "ex1",
          note: 8,
          coeficient: 10,
          createdAt: new Date(),
          isMissing: false,
          pendingReview: false,
          exercice: {
            title: "Fractions",
            closesAt: new Date(Date.now() + 86_400_000),
            lesson: { LessonSubject: { label: "Maths", color: "c" } },
          },
        },
      ],
      total: 1,
      page: 1,
      pageSize: 12,
      pageCount: 1,
    });
    const result = await getExercisesDoneAction(undefined, "s1");
    expect(getStudentExercicesPageData).toHaveBeenCalledWith("s1", undefined, expect.anything());
    expect("data" in result && result.data?.items[0].note).toBeNull();
  });

  it("ne liste pas les copies d'un autre enfant", async () => {
    expect((await getExercisesDoneAction(undefined, "s2")).error).toBeDefined();
    expect((await getExercisesDoneAction(undefined)).error).toBeDefined();
  });

  it("voit une copie de son enfant, pas celle d'un autre", async () => {
    const copy = (studentId: string) => ({
      id: "se1",
      studentId,
      pendingReview: false,
      exercice: { closesAt: null, lessonID: "l1", type: { name: "Vrai ou Faux" }, content: [] },
      student: { id: studentId, name: "Léa", professorId: "t1" },
    });
    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy("s1"));
    const mine = await getStudentExerciceByIdAction("se1");
    expect(mine.data?.id).toBe("se1");
    // Pas de lien vers la leçon pour un parent
    expect(mine.data?.lesson).toBeNull();

    (getStudentExerciceByIdData as jest.Mock).mockResolvedValue(copy("s2"));
    expect((await getStudentExerciceByIdAction("se1")).data).toBeNull();
  });
});

describe("paramètres du parent", () => {
  beforeEach(asParent);

  it("active ou coupe les e-mails de notes", async () => {
    expect((await setParentNotificationsAction(false)).success).toMatch(/ne recevrez plus/);
    expect(setParentNotificationsData).toHaveBeenCalledWith("p1", false);
  });

  it("change son mot de passe avec le mot de passe actuel", async () => {
    (getUserByIdData as jest.Mock).mockResolvedValue({ id: "p1", password: "hash" });
    (verifyPassword as jest.Mock).mockResolvedValue(true);
    const values = { currentPassword: "Provisoire-12", newPassword: "nouveau-mdp", confirmPassword: "nouveau-mdp" };
    expect((await changeParentPasswordAction(values)).success).toBeDefined();
    expect(UpdateUserData).toHaveBeenCalledWith("p1", { password: "hash:nouveau-mdp" });
  });

  it("refuse un mot de passe actuel faux", async () => {
    (getUserByIdData as jest.Mock).mockResolvedValue({ id: "p1", password: "hash" });
    (verifyPassword as jest.Mock).mockResolvedValue(false);
    const values = { currentPassword: "faux", newPassword: "nouveau-mdp", confirmPassword: "nouveau-mdp" };
    expect((await changeParentPasswordAction(values)).error).toMatch(/incorrect/);
    expect(UpdateUserData).not.toHaveBeenCalled();
  });

  it("refuse un professeur", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    expect((await setParentNotificationsAction(true)).error).toBeDefined();
  });
});
