import prisma from "@/lib/db";

export const createUser = async ({ email, hashedPassword }: { email: string; hashedPassword: string }) => {
  return await prisma.user.create({ data: { email, password: hashedPassword } });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

export const UpdateUser = async (id: string | undefined, data: object) => {
  return await prisma.user.update({ where: { id: id }, data: { ...data } });
};
