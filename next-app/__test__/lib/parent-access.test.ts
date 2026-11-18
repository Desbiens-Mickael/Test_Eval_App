/**
 * @jest-environment node
 */
import { ParentEmailError, setStudentParentEmailData } from "@/data/parent-data";
import { prisma } from "@/lib/db";
import { sendParentAccessEmail, sendParentChildAddedEmail } from "@/lib/mail";
import { applyStudentParentEmail } from "@/lib/parent-access";
import { parentEmailShema, parentPasswordFormSchema } from "@/shema-zod/parent.shema";

jest.mock("@/lib/mail", () => ({
  sendParentAccessEmail: jest.fn(),
  sendParentChildAddedEmail: jest.fn(),
}));
jest.mock("@/lib/hash-password", () => ({ hashPassword: jest.fn(async (p: string) => `hash:${p}`) }));
jest.mock("@/lib/db", () => {
  const client = {
    student: { findUnique: jest.fn(), update: jest.fn() },
    user: { findFirst: jest.fn(), create: jest.fn() },
    parentLink: { deleteMany: jest.fn(), upsert: jest.fn(), create: jest.fn() },
  };
  return {
    prisma: {
      ...client,
      $transaction: jest.fn((fn: (tx: typeof client) => unknown) => fn(client)),
    },
  };
});

type Mocked = {
  student: { findUnique: jest.Mock; update: jest.Mock };
  user: { findFirst: jest.Mock; create: jest.Mock };
  parentLink: { deleteMany: jest.Mock; upsert: jest.Mock; create: jest.Mock };
};
const db = prisma as unknown as Mocked;

const student = (parentEmail: string | null, linkedEmails: string[] = []) => ({
  parentEmail,
  parents: linkedEmails.map((email) => ({ parent: { email } })),
});

beforeEach(() => {
  jest.clearAllMocks();
  db.student.findUnique.mockResolvedValue(student(null));
  db.user.findFirst.mockResolvedValue(null);
  db.user.create.mockResolvedValue({ id: "p1" });
});

describe("parentEmailShema", () => {
  it("un champ vide veut dire : pas d'accès parent", () => {
    expect(parentEmailShema.parse("")).toBeNull();
    expect(parentEmailShema.parse("   ")).toBeNull();
    expect(parentEmailShema.parse(undefined)).toBeNull();
  });

  it("normalise l'adresse", () => {
    expect(parentEmailShema.parse("  Maman@Exemple.FR ")).toBe("maman@exemple.fr");
  });

  it("refuse une adresse invalide", () => {
    expect(parentEmailShema.safeParse("maman@").success).toBe(false);
  });
});

describe("parentPasswordFormSchema", () => {
  it("exige 8 caractères et une confirmation identique", () => {
    const base = { currentPassword: "Provisoire-12", newPassword: "nouveau-mdp", confirmPassword: "nouveau-mdp" };
    expect(parentPasswordFormSchema.safeParse(base).success).toBe(true);
    expect(parentPasswordFormSchema.safeParse({ ...base, newPassword: "court", confirmPassword: "court" }).success).toBe(false);
    expect(parentPasswordFormSchema.safeParse({ ...base, confirmPassword: "autre-mdp" }).success).toBe(false);
  });
});

describe("setStudentParentEmailData", () => {
  const call = (email: string | null) =>
    setStudentParentEmailData({ studentId: "s1", email, teacherEmail: "prof@ecole.fr" });

  it("crée automatiquement le compte parent avec un mot de passe provisoire", async () => {
    const result = await call("maman@exemple.fr");
    expect(result).toMatchObject({ status: "created", email: "maman@exemple.fr" });
    const { data } = db.user.create.mock.calls[0][0];
    expect(data).toMatchObject({ email: "maman@exemple.fr", role: "PARENT" });
    expect(data.emailVerified).toBeInstanceOf(Date);
    expect(data.password).toBe(`hash:${(result as { password: string }).password}`);
    expect(db.parentLink.create).toHaveBeenCalledWith({ data: { parentId: "p1", studentId: "s1" } });
    expect(db.student.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { parentEmail: "maman@exemple.fr" },
    });
  });

  it("ajoute l'enfant à un compte parent existant (frères et sœurs)", async () => {
    db.user.findFirst.mockResolvedValue({ id: "p9", role: "PARENT" });
    expect(await call("maman@exemple.fr")).toEqual({ status: "linked", email: "maman@exemple.fr" });
    expect(db.user.create).not.toHaveBeenCalled();
    expect(db.parentLink.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: { parentId: "p9", studentId: "s1" } })
    );
    // L'ancien parent éventuel perd l'accès, pas celui-ci
    expect(db.parentLink.deleteMany).toHaveBeenCalledWith({
      where: { studentId: "s1", parentId: { not: "p9" } },
    });
  });

  it("retire l'accès quand l'adresse est effacée", async () => {
    db.student.findUnique.mockResolvedValue(student("maman@exemple.fr", ["maman@exemple.fr"]));
    expect(await call(null)).toEqual({ status: "removed" });
    expect(db.parentLink.deleteMany).toHaveBeenCalledWith({ where: { studentId: "s1" } });
    expect(db.student.update).toHaveBeenCalledWith({ where: { id: "s1" }, data: { parentEmail: null } });
  });

  it("ne fait rien si l'adresse ne change pas", async () => {
    db.student.findUnique.mockResolvedValue(student("maman@exemple.fr", ["maman@exemple.fr"]));
    db.user.findFirst.mockResolvedValue({ id: "p9", role: "PARENT" });
    expect(await call("maman@exemple.fr")).toEqual({ status: "unchanged" });
    expect(db.student.update).not.toHaveBeenCalled();
  });

  it("champ vide sans parent : rien à faire (le professeur est le parent)", async () => {
    expect(await call(null)).toEqual({ status: "unchanged" });
    expect(db.parentLink.deleteMany).not.toHaveBeenCalled();
  });

  it("refuse l'adresse du professeur lui-même", async () => {
    db.user.findFirst.mockResolvedValue({ id: "t1", role: "ADMIN" });
    await expect(call("prof@ecole.fr")).rejects.toThrow(/votre propre adresse/);
    expect(db.student.update).not.toHaveBeenCalled();
  });

  it("refuse l'adresse d'un autre compte professeur", async () => {
    db.user.findFirst.mockResolvedValue({ id: "t2", role: "ADMIN" });
    await expect(call("collegue@ecole.fr")).rejects.toThrow(ParentEmailError);
  });
});

describe("applyStudentParentEmail : envoi automatique", () => {
  const apply = (email: string | null) =>
    applyStudentParentEmail({ studentId: "s1", studentName: "Léa Martin", email, teacherEmail: "prof@ecole.fr" });

  it("envoie les accès au nouveau parent", async () => {
    const result = await apply("maman@exemple.fr");
    expect(result).toEqual({ message: "Espace parent créé : les accès ont été envoyés à maman@exemple.fr." });
    expect(sendParentAccessEmail).toHaveBeenCalledWith("maman@exemple.fr", "Léa Martin", expect.any(String));
  });

  it("garde l'accès et le signale si l'e-mail ne part pas", async () => {
    (sendParentAccessEmail as jest.Mock).mockRejectedValueOnce(new Error("SMTP"));
    const result = await apply("maman@exemple.fr");
    expect("message" in result && result.message).toMatch(/n'a pas pu être envoyé/);
    expect(db.parentLink.create).toHaveBeenCalled();
  });

  it("prévient un parent existant qu'un enfant est ajouté", async () => {
    db.user.findFirst.mockResolvedValue({ id: "p9", role: "PARENT" });
    await apply("maman@exemple.fr");
    expect(sendParentChildAddedEmail).toHaveBeenCalledWith("maman@exemple.fr", "Léa Martin");
    expect(sendParentAccessEmail).not.toHaveBeenCalled();
  });

  it("renvoie l'erreur au professeur sans rien envoyer", async () => {
    db.user.findFirst.mockResolvedValue({ id: "t1", role: "ADMIN" });
    expect(await apply("prof@ecole.fr")).toEqual({
      error: "C'est votre propre adresse : laissez le champ vide si vous suivez vous-même cet élève.",
    });
    expect(sendParentAccessEmail).not.toHaveBeenCalled();
  });
});
