import { prisma } from "@/lib/db";
import { createLessonSchema } from "@/shema-zod/lesson";
import { Lesson } from "@/type/lesson";
import { z } from "zod";

export type LessonOutput = {
  id: string;
  name: string;
  LessonSubject: {
    label: string;
    color: string;
  };
  GradeLevels: {
    label: string;
    color: string;
  };
};

/**
 * Get all lessons
 * @returns lesson list
 */
export const getAllLesson = async (): Promise<LessonOutput[]> => {
  try {
    return await prisma.lesson.findMany({
      select: {
        id: true,
        name: true,
        LessonSubject: {
          select: { label: true, color: true },
        },
        GradeLevels: {
          select: { label: true, color: true },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw new Error("Échec de la récupération des leçons");
  }
};

/**
 * Récupère tous les leçons selon leur sujet
 *
 * @param {string} subject - Le sujet de la leçon à récupérer. Valeurs possibles : "Mathématiques" | "Sciences" | "Histoire" | "Arts".
 * @returns {Promise<LessonOutput[]>} - Une promesse qui résout à une liste de leçons contenant l'ID, le nom et le sujet.
 *
 * @example
 * // Récupérer toutes les leçons d'histoire
 * const lessons = await getAllLessonBySubject("Histoire");
 *
 * @description
 * La fonction récupère une liste de leçons filtrée par le sujet donné. Les champs retournés pour chaque leçon sont :
 * - `id`: L'identifiant unique de la leçon
 * - `name`: Le nom de la leçon
 * - `LessonSubject.label`: Le sujet de la leçon
 */
export const getAllLessonBySubject = async (subject: string): Promise<LessonOutput[]> => {
  return prisma.lesson.findMany({
    where: {
      LessonSubject: {
        label: subject,
      },
    },
    select: {
      id: true,
      name: true,
      LessonSubject: {
        select: { label: true, color: true },
      },
      GradeLevels: {
        select: { label: true, color: true },
      },
    },
  });
};

// create lesson
export const createLesson = async (data: z.infer<typeof createLessonSchema>, userId: string) => {
  return await prisma.lesson.create({
    data: {
      name: data.name,
      LessonSubjectID: data.LessonSubjectID,
      GradeLevelsID : data.GradeLevelsID,
      authorId: userId,
      content: data.content,
    },
  });
};

// get lesson by id
export const getLessonById = async (id: string) => {
  return await prisma.lesson.findUnique({ where: { id } });
};

// update lesson
export const updateLesson = async (id: string, data: object) => {
  return await prisma.lesson.update({ where: { id: id }, data: { ...data } });
};

// delete lesson
export const deleteLessonById = async (id: string) => {
  return await prisma.lesson.delete({ where: { id } });
};
