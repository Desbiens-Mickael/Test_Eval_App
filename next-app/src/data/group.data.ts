import { prisma } from "@/lib/db";

export const getAuthorIdOfGroupByUserId = async (userId: string) => {
  return await prisma.group.findFirst({
    where: { users: { some: { id: userId } } },
    select: { author: { select: { id: true } } },
  });
};

export const getGroupsByAuthorId = async (authorId: string) => {
  return await prisma.group.findMany({
    where: { authorId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      authorId: true,
      users: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getGroupById = async (id: string, authorId: string) => {
  return await prisma.group.findUnique({
    where: { id, authorId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      authorId: true,
      users: {
        select: { id: true, name: true },
      },
    },
  });
};

export const createGroupData = async (name: string, authorId: string) => {
  return await prisma.group.create({ data: { name, authorId } });
};
