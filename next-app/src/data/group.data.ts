import { prisma } from "@/lib/db";

export const getAuthorIdOfGroupByUserIdData = async (userId: string) => {
  return await prisma.group.findFirst({
    where: { students: { some: { id: userId } } },
    select: { author: { select: { id: true } } },
  });
};

export const getGroupsByAuthorIdData = async (authorId: string) => {
  return await prisma.group.findMany({
    where: { authorId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      authorId: true,
      students: {
        select: { id: true, identifier: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

// Récupération d'un groupe par son id
export const getGroupByIdData = async (id: string, authorId: string) => {
  return await prisma.group.findUnique({
    where: { id, authorId },
    include: {
      students: {
        select: {
          id: true,
          name: true,
          identifier: true,
          isActive: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          slug: true,
          LessonSubject: {
            select: { label: true, color: true },
          },
          GradeLevels: {
            select: { label: true, color: true },
          },
        },
        orderBy: { title: "asc" },
      },
    },
  });
};

// Récupération d'un groupe à partir de l'id de l'élève
export const getGroupByStudentIdData = async (studentId: string) => {
  return await prisma.group.findFirst({
    where: { students: { some: { id: studentId } } },
  });
};

export const createGroupData = async (name: string, authorId: string) => {
  return await prisma.group.create({ data: { name, authorId } });
};

export const addStudentToGroupData = async (
  groupId: string,
  studentId: string
) => {
  return await prisma.group.update({
    where: { id: groupId },
    data: { students: { connect: { id: studentId } } },
  });
};

export const deleteGroupData = async (id: string, authorId: string) => {
  return await prisma.group.delete({ where: { id, authorId } });
};

// Ajouter un tableau de leçons au groupe
export const addLessonsToGroupData = async (
  groupId: string,
  lessonIds: string[]
) => {
  return await prisma.group.update({
    where: { id: groupId },
    data: { lessons: { connect: lessonIds.map((id) => ({ id })) } },
  });
};

// Supprimer une leçon du groupe
export const removeLessonFromGroupData = async (
  groupId: string,
  lessonId: string
) => {
  return await prisma.group.update({
    where: { id: groupId },
    data: { lessons: { disconnect: { id: lessonId } } },
  });
};
