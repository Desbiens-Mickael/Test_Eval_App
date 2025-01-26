"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";

export const createStudentData = async (
  professorId: string,
  identifier: string,
  plainPassword: string,
  firstName: string,
  lastName: string
) => {
  try {
    const hashedPassword = await hashPassword(plainPassword);

    return await prisma.student.create({
      data: {
        professorId,
        identifier,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getStudentByIdData = async (id: string) => {
  try {
    return await prisma.student.findUnique({ where: { id } });
  } catch (error) {
    throw error;
  }
};

export const getStudentByIdentifierlData = async (identifier: string) => {
  try {
    return await prisma.student.findUnique({ where: { identifier } });
  } catch (error) {
    throw error;
  }
};

export const getCountAllStudentsByIdentifierData = async (
  identifier: string
) => {
  try {
    return await prisma.student.count({ where: { identifier } });
  } catch (error) {
    throw error;
  }
};

// Récupérer les élèves de l'utilisateur connecté
export const getAllStudentsByAuthorIdData = async (
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
      firstName: true,
      lastName: true,
      isActive: true,
    },
  });
};

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
