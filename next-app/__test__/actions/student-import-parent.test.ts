/**
 * @jest-environment node
 */
import { importStudentsAction } from "@/actions/student-import.action";
import { getGroupsByAuthorIdData } from "@/data/group.data";
import {
  createStudentsData,
  getStudentsByIdentifiersData,
  getTakenIdentifiersData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { applyStudentParentEmail } from "@/lib/parent-access";

jest.mock("@/lib/auth", () => ({ currentUser: jest.fn() }));
jest.mock("@/lib/parent-access", () => ({ applyStudentParentEmail: jest.fn() }));
jest.mock("@/lib/mail", () => ({ sendImportedStudentsCredentialsEmail: jest.fn() }));
jest.mock("@/lib/hash-password", () => ({ hashPassword: jest.fn(async () => "hash") }));
jest.mock("@/data/group.data");
jest.mock("@/data/student-data");

const row = (line: number, firstname: string, lastname: string, parentEmail = "") => ({
  line,
  firstname,
  lastname,
  group: "",
  parentEmail,
});

beforeEach(() => {
  jest.clearAllMocks();
  (currentUser as jest.Mock).mockResolvedValue({ id: "t1", role: "ADMIN", email: "prof@ecole.fr" });
  (getGroupsByAuthorIdData as jest.Mock).mockResolvedValue([]);
  (getTakenIdentifiersData as jest.Mock).mockResolvedValue([]);
  (createStudentsData as jest.Mock).mockResolvedValue({ count: 3 });
  (getStudentsByIdentifiersData as jest.Mock).mockImplementation(async (identifiers: string[]) =>
    identifiers.map((identifier) => ({ id: `id-${identifier}`, identifier }))
  );
  (applyStudentParentEmail as jest.Mock).mockResolvedValue({ message: "Espace parent créé." });
});

describe("import d'élèves avec l'e-mail du parent", () => {
  it("crée l'espace parent des seules lignes où l'e-mail est renseigné", async () => {
    const result = await importStudentsAction([
      row(2, "Léa", "Martin", "Maman.Martin@Exemple.fr"),
      row(3, "Hugo", "Bernard"),
      row(4, "Tom", "Martin", "maman.martin@exemple.fr"),
    ]);

    expect(result.success).toBeDefined();
    // Les frères et sœurs sont traités l'un après l'autre, adresse normalisée
    expect((applyStudentParentEmail as jest.Mock).mock.calls.map(([arg]) => arg)).toEqual([
      {
        studentId: "id-l.martin",
        studentName: "Léa Martin",
        email: "maman.martin@exemple.fr",
        teacherEmail: "prof@ecole.fr",
      },
      {
        studentId: "id-t.martin",
        studentName: "Tom Martin",
        email: "maman.martin@exemple.fr",
        teacherEmail: "prof@ecole.fr",
      },
    ]);
    expect(result.data?.parents).toEqual([
      { student: "Léa Martin", email: "maman.martin@exemple.fr", ok: true, message: "Espace parent créé." },
      { student: "Tom Martin", email: "maman.martin@exemple.fr", ok: true, message: "Espace parent créé." },
    ]);
  });

  it("aucun e-mail de parent : aucun espace parent", async () => {
    const result = await importStudentsAction([row(2, "Léa", "Martin"), row(3, "Hugo", "Bernard")]);
    expect(result.data?.parents).toEqual([]);
    expect(applyStudentParentEmail).not.toHaveBeenCalled();
    expect(getStudentsByIdentifiersData).not.toHaveBeenCalled();
  });

  it("refuse l'import si une adresse est invalide", async () => {
    const result = await importStudentsAction([row(2, "Léa", "Martin", "maman@")]);
    expect(result.error).toMatch(/ligne 2/);
    expect(createStudentsData).not.toHaveBeenCalled();
  });

  it("garde les élèves créés et signale une adresse refusée", async () => {
    (applyStudentParentEmail as jest.Mock).mockResolvedValue({
      error: "C'est votre propre adresse : laissez le champ vide si vous suivez vous-même cet élève.",
    });
    const result = await importStudentsAction([row(2, "Léa", "Martin", "prof@ecole.fr")]);
    expect(result.success).toBeDefined();
    expect(result.data?.students).toHaveLength(1);
    expect(result.data?.parents[0]).toMatchObject({ ok: false, message: expect.stringMatching(/propre adresse/) });
  });

  it("une erreur sur un parent n'annule pas l'import", async () => {
    (applyStudentParentEmail as jest.Mock).mockRejectedValueOnce(new Error("base indisponible"));
    const result = await importStudentsAction([row(2, "Léa", "Martin", "maman@exemple.fr")]);
    expect(result.success).toBeDefined();
    expect(result.data?.parents[0]).toMatchObject({ ok: false, message: expect.stringMatching(/fiche de l'élève/) });
  });
});
