"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/hash-password";

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

// Récupérer tout les élèves de l'utilisateur connecté
export const getAllStudentsByAuthorIdData = async (authorId: string) => {
  return await prisma.student.findMany({
    where: { professorId: authorId },
    select: {
      id: true,
      identifier: true,
      name: true,
      isActive: true,
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

// Récupérer tout les élèves de l'utilisateur connecté qui se trouvent dans le groupe demandé
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
