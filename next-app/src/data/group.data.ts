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

export const getGroupByIdData = async (id: string, authorId: string) => {
  return await prisma.group.findUnique({
    where: { id, authorId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      authorId: true,
      students: {
        select: {
          id: true,
          name: true,
          identifier: true,
          isActive: true,
        },
      },
    },
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
