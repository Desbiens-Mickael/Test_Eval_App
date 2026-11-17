/**
 * @jest-environment node
 */
import { getExercicesPageAction } from "@/actions/exercice.action";
import { getStudentsPageAction } from "@/actions/student.action";
import { getExercicesPageData } from "@/data/exercice/exercice-data";
import { getExerciceTypeByNameData } from "@/data/exercice/exercice-type.data";
import { getStudentsPageData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { ExerciceType } from "@/type/exercice";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/data/exercice/control-closure.data", () => ({ closeExpiredControlsSafeData: jest.fn() }));
jest.mock("@/data/exercice/exercice-data");
jest.mock("@/data/exercice/exercice-type.data");
jest.mock("@/data/exercice/practice-data");
jest.mock("@/data/group.data");
jest.mock("@/data/lesson/lesson-data");
jest.mock("@/data/notification/notification.data");
jest.mock("@/data/student-data");

const mockedUser = currentUser as jest.Mock;
const emptyPage = { items: [], total: 0, page: 1, pageSize: 10, pageCount: 1 };

beforeEach(() => {
  jest.clearAllMocks();
  (getStudentsPageData as jest.Mock).mockResolvedValue(emptyPage);
  (getExercicesPageData as jest.Mock).mockResolvedValue(emptyPage);
  (getExerciceTypeByNameData as jest.Mock).mockResolvedValue({ id: "type-1", name: "Carte" });
});

describe("getStudentsPageAction", () => {
  it("est réservée au professeur", async () => {
    mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
    expect(await getStudentsPageAction({})).toEqual({ error: "Action non autoriser !" });
    expect(getStudentsPageData).not.toHaveBeenCalled();
  });

  it("ne renvoie que les élèves du professeur connecté", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    const result = await getStudentsPageAction({ page: 2, pageSize: 20, search: " léa " });
    expect(getStudentsPageData).toHaveBeenCalledWith("t1", { page: 2, pageSize: 20, search: "léa" });
    expect(result.data).toEqual(emptyPage);
  });

  it("refuse des paramètres invalides", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    const result = await getStudentsPageAction({ pageSize: 10_000 });
    expect(result.error).toBeDefined();
    expect(getStudentsPageData).not.toHaveBeenCalled();
  });
});

describe("getExercicesPageAction", () => {
  it("est réservée au professeur", async () => {
    mockedUser.mockResolvedValue({ id: "s1", role: "STUDENT" });
    const result = await getExercicesPageAction(ExerciceType.Card, "CONTROL", {});
    expect(result.error).toBeDefined();
    expect(getExercicesPageData).not.toHaveBeenCalled();
  });

  it("transmet le type, l'usage et les filtres", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    await getExercicesPageAction(ExerciceType.Card, "PRACTICE", {
      filters: { Niveau: ["Facile"] },
      sort: { id: "Titre", desc: false },
    });
    expect(getExercicesPageData).toHaveBeenCalledWith(
      "t1",
      { id: "type-1", name: "Carte" },
      "PRACTICE",
      { page: 1, pageSize: 10, filters: { Niveau: ["Facile"] }, sort: { id: "Titre", desc: false } }
    );
  });

  it("refuse un usage inconnu", async () => {
    mockedUser.mockResolvedValue({ id: "t1", role: "ADMIN" });
    const result = await getExercicesPageAction(ExerciceType.Card, "AUTRE" as "CONTROL", {});
    expect(result.error).toBeDefined();
  });
});
