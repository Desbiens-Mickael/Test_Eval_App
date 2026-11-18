// Couche d'accès aux données : uniquement côté serveur.
// Ne pas ajouter "use server" ici (voir user-data.ts).
import "server-only";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { generateStudentPassword } from "@/lib/student-password";

/** Erreur à montrer telle quelle au professeur */
export class ParentEmailError extends Error {}

export type ParentAccessResult =
  /** Pas de changement */
  | { status: "unchanged" }
  /** E-mail effacé : l'accès parent est retiré */
  | { status: "removed" }
  /** Nouveau compte parent : le mot de passe provisoire est à envoyer */
  | { status: "created"; email: string; password: string }
  /** Compte parent existant : l'enfant est ajouté à son espace */
  | { status: "linked"; email: string };

/**
 * Applique l'e-mail du parent saisi sur la fiche d'un élève :
 * - vide : l'accès des parents de cet élève est retiré ;
 * - nouvelle adresse sans compte : un compte parent est créé, avec un mot
 *   de passe provisoire, et relié à l'élève ;
 * - adresse d'un compte parent : l'élève est ajouté à son espace.
 * L'ancien parent perd l'accès à cet élève (ses autres enfants restent).
 * @throws {ParentEmailError} si l'adresse est celle d'un compte professeur
 */
export const setStudentParentEmailData = async ({
  studentId,
  email,
  teacherEmail,
}: {
  studentId: string;
  email: string | null;
  teacherEmail: string | null;
}): Promise<ParentAccessResult> => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { parentEmail: true, parents: { select: { parent: { select: { email: true } } } } },
  });
  if (!student) throw new Error("Élève introuvable");

  const existing = email
    ? await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        select: { id: true, role: true },
      })
    : null;

  if (email && existing && existing.role !== "PARENT") {
    throw new ParentEmailError(
      teacherEmail && email === teacherEmail.toLowerCase()
        ? "C'est votre propre adresse : laissez le champ vide si vous suivez vous-même cet élève."
        : "Cette adresse est déjà celle d'un compte professeur."
    );
  }

  const alreadyLinked =
    !!email && student.parents.some((link) => link.parent.email?.toLowerCase() === email);
  if (student.parentEmail === email && (email === null || alreadyLinked)) {
    return { status: "unchanged" };
  }

  return prisma.$transaction(async (tx) => {
    // Les autres parents de cet élève perdent l'accès
    await tx.parentLink.deleteMany({
      where: {
        studentId,
        ...(existing ? { parentId: { not: existing.id } } : {}),
      },
    });
    await tx.student.update({ where: { id: studentId }, data: { parentEmail: email } });

    if (!email) return { status: "removed" as const };

    if (existing) {
      await tx.parentLink.upsert({
        where: { parentId_studentId: { parentId: existing.id, studentId } },
        create: { parentId: existing.id, studentId },
        update: {},
      });
      return { status: "linked" as const, email };
    }

    const password = generateStudentPassword();
    const parent = await tx.user.create({
      data: {
        email,
        role: "PARENT",
        password: await hashPassword(password),
        // L'adresse vient du professeur et le parent se connecte avec les
        // accès reçus à cette adresse
        emailVerified: new Date(),
      },
    });
    await tx.parentLink.create({ data: { parentId: parent.id, studentId } });
    return { status: "created" as const, email, password };
  });
};

/** Le parent suit-il cet élève ? */
export const isParentOfStudentData = async (parentId: string, studentId: string) =>
  (await prisma.parentLink.count({ where: { parentId, studentId } })) > 0;

/** Enfants suivis par un parent, avec leur groupe et leur professeur */
export const getChildrenOfParentData = async (parentId: string) => {
  const links = await prisma.parentLink.findMany({
    where: { parentId },
    select: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
          disabledAt: true,
          groupStudent: { select: { name: true } },
          professor: { select: { name: true } },
        },
      },
    },
    orderBy: { student: { name: "asc" } },
  });
  return links.map(({ student }) => ({
    id: student.id,
    name: student.name,
    image: student.image,
    groupName: student.groupStudent?.name ?? null,
    teacherName: student.professor.name ?? null,
  }));
};

/**
 * Parents à prévenir par e-mail pour ces élèves (notifications activées),
 * avec les enfants concernés de chacun.
 */
export const getParentsToNotifyData = async (studentIds: string[]) => {
  if (studentIds.length === 0) return [];
  const links = await prisma.parentLink.findMany({
    where: { studentId: { in: studentIds }, parent: { parentEmailNotifications: true } },
    select: {
      studentId: true,
      parent: { select: { id: true, email: true } },
    },
  });
  const byParent = new Map<string, { email: string; studentIds: string[] }>();
  links.forEach(({ studentId, parent }) => {
    if (!parent.email) return;
    const entry = byParent.get(parent.id) ?? { email: parent.email, studentIds: [] };
    entry.studentIds.push(studentId);
    byParent.set(parent.id, entry);
  });
  return Array.from(byParent.values());
};

/** Préférences du parent connecté */
export const getParentSettingsData = (parentId: string) =>
  prisma.user.findUnique({
    where: { id: parentId },
    select: { email: true, name: true, parentEmailNotifications: true },
  });

export const setParentNotificationsData = (parentId: string, enabled: boolean) =>
  prisma.user.update({
    where: { id: parentId },
    data: { parentEmailNotifications: enabled },
    select: { parentEmailNotifications: true },
  });
