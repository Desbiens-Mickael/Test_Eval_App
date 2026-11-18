// Couche d'accès aux données : uniquement côté serveur.
// Ne pas ajouter "use server" ici, sinon chaque fonction exportée devient
// une server action appelable depuis le navigateur sans contrôle d'accès.
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";
import { orderByFrom, paginate } from "@/lib/pagination";
import { PageQuery } from "@/type/pagination";
import { Prisma } from "@prisma/client";

export const createStudentData = async (
  professorId: string,
  identifier: string,
  plainPassword: string,
  name: string
) => {
  try {
    const hashedPassword = await hashPassword(plainPassword);

    return await prisma.student.create({
      data: {
        professorId,
        identifier,
        password: hashedPassword,
        name,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getStudentByIdData = async (id: string) => {
  return await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      identifier: true,
      name: true,
      image: true,
      role: true,
      professorId: true,
      isActive: true,
      disabledAt: true,
      parentEmail: true,
      createdAt: true,
      groupStudent: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

// Profil d'un élève sans le hash du mot de passe (pour l'envoyer au navigateur)
export const getStudentPublicByIdentifierData = async (identifier: string) => {
  return await prisma.student.findUnique({
    where: { identifier },
    select: {
      id: true,
      identifier: true,
      name: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      professorId: true,
      groupId: true,
    },
  });
};

export const getStudentByIdentifierlData = async (identifier: string) => {
  try {
    return await prisma.student.findUnique({ where: { identifier } });
  } catch (error) {
    throw error;
  }
};

// Récupérer tout les élèves de l'utilisateur connecté
const studentRowSelect = {
  id: true,
  identifier: true,
  name: true,
  isActive: true,
  disabledAt: true,
  createdAt: true,
  groupStudent: { select: { id: true, name: true } },
} satisfies Prisma.StudentSelect;

// Colonnes triables du tableau des élèves
const studentSortColumns: Record<string, (d: Prisma.SortOrder) => Prisma.StudentOrderByWithRelationInput> = {
  Nom: (d) => ({ name: d }),
  Identifiant: (d) => ({ identifier: d }),
  Groupe: (d) => ({ groupStudent: { name: d } }),
  Compte: (d) => ({ isActive: d }),
  "Date de création": (d) => ({ createdAt: d }),
};

/** Une page des élèves d'un professeur, avec recherche sur le nom et l'identifiant */
export const getStudentsPageData = async (authorId: string, query: PageQuery) => {
  const where: Prisma.StudentWhereInput = {
    professorId: authorId,
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" } },
        { identifier: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };
  const orderBy = orderByFrom(query.sort, studentSortColumns, { name: "asc" });

  return paginate(
    query,
    () => prisma.student.count({ where }),
    ({ skip, take }) => prisma.student.findMany({ where, select: studentRowSelect, orderBy, skip, take })
  );
};

// Récupérer tout les élèves de l'utilisateur connecté qui ne se trouvent dans le groupe demandé
export const getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdData = async (
  authorId: string,
  groupId: string
) => {
  return await prisma.student.findMany({
    where: {
      professorId: authorId,
      OR: [{ groupId: { not: groupId } }, { groupId: null }],
    },
    select: {
      id: true,
      identifier: true,
      name: true,
      isActive: true,
    },
  });
};

// Récupère tout les ids des élèves de l'utilisateur connecté qui se trouvent dans le groupe demandé
export const getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData = async (
  authorId: string,
  groupId: string
) => {
  return await prisma.student.findMany({
    where: {
      professorId: authorId,
      groupId: groupId,
    },
    select: {
      id: true,
    },
  });
};

// Mise à jour d'un élève
export const UpdateStudentData = async (id: string, data: object) => {
  try {
    return await prisma.student.update({
      where: { id: id },
      data: { ...data },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Identifiants déjà pris qui commencent par l'une des bases données
 * (« l.martin », « l.martin-02 »…). Les identifiants sont uniques pour
 * toute l'application, pas seulement pour un professeur.
 */
export const getTakenIdentifiersData = async (bases: string[]) => {
  if (bases.length === 0) return [];
  const students = await prisma.student.findMany({
    where: { OR: bases.map((base) => ({ identifier: { startsWith: base } })) },
    select: { identifier: true },
  });
  return students.map((s) => s.identifier);
};

// Création de plusieurs élèves en une seule requête (mots de passe déjà hashés)
export const createStudentsData = async (
  students: {
    name: string;
    identifier: string;
    password: string;
    professorId: string;
    groupId: string | null;
  }[]
) => {
  return await prisma.student.createMany({ data: students });
};

/** Élèves à partir de leurs identifiants (juste après un import) */
export const getStudentsByIdentifiersData = async (identifiers: string[]) => {
  return await prisma.student.findMany({
    where: { identifier: { in: identifiers } },
    select: { id: true, identifier: true },
  });
};

// Nouveau mot de passe (déjà hashé) pour un élève
export const updateStudentPasswordData = async (
  studentId: string,
  hashedPassword: string
) => {
  return await prisma.student.update({
    where: { id: studentId },
    data: { password: hashedPassword },
    select: { id: true, identifier: true, name: true },
  });
};

// Désactive (date) ou réactive (null) le compte d'un élève
export const setStudentDisabledData = async (
  studentId: string,
  disabledAt: Date | null
) => {
  return await prisma.student.update({
    where: { id: studentId },
    data: { disabledAt },
    select: { id: true, disabledAt: true },
  });
};

// Suppression d'un ou plusieurs élèves appartenant au professeur donné
export const deleteStudentsData = async (
  studentIds: string[],
  professorId: string
) => {
  try {
    return await prisma.student.deleteMany({
      where: { id: { in: studentIds }, professorId },
    });
  } catch (error) {
    throw error;
  }
};
