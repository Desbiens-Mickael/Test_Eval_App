"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";

export const createUserData = async (email: string, plainPassword: string, fullName: string) => {
  try {
    const hashedPassword = await hashPassword(plainPassword);

    return await prisma.user.create({ data: { email, password: hashedPassword, name: fullName } });
  } catch (error) {
    throw error;
  }
};

export const getUserByIdData = async (id: string) => {
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    throw error;
  }
};

export const getUserByEmailData = async (email: string) => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    throw error;
  }
};

export const UpdateUserData = async (id: string, data: object) => {
  try {
    return await prisma.user.update({ where: { id: id }, data: { ...data } });
  } catch (error) {
    throw error;
  }
};
