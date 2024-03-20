import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";

export const createUser = async (email: string, plainPassword: string, fullName: string) => {
  try {
    const hashedPassword = await hashPassword(plainPassword);

    return await prisma.user.create({ data: { email, password: hashedPassword, name: fullName } });
  } catch (error) {
    throw new Error("Echec de lors de la création de l'utilisateur");
  }
};

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    return null;
  }
};

export const UpdateUser = async (id: string, data: object) => {
  try {
    return await prisma.user.update({ where: { id: id }, data: { ...data } });
  } catch (error) {
    return null;
  }
};
