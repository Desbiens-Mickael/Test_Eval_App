import { prisma } from "@/lib/db";

export const getAuthorIdOfGroupByUserId = async (userId: string) => {
  return await prisma.group.findFirst({where: {users: {some: {id: userId}}}, select: {author: {select: {id: true }}}});
};