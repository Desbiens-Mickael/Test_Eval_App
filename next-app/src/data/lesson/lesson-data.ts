import { prisma } from "@/lib/db";
import { stringToSlug } from "@/lib/utils";
import { CreateLessonType } from "@/type/lesson";

export type LessonOutput = {
  id: string;
  title: string;
  slug: string;
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
export const getAllLessonData = async (): Promise<LessonOutput[]> => {
  try {
    return await prisma.lesson.findMany({
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
export const getAllLessonBySubjectData = async (subject: string): Promise<LessonOutput[]> => {
  return prisma.lesson.findMany({
    where: {
      LessonSubject: {
        label: subject,
      },
    },
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
  });
};

// create lesson
export const createLessonData = async (data: CreateLessonType) => {
  return await prisma.lesson.create({
    data: {
      title: data.title,
      content: data.content,
      slug: stringToSlug(data.title),
      authorId: data.authorId,
      LessonSubjectID: data.LessonSubjectID,
      GradeLevelsID: data.GradeLevelsID,
    },select: {
      id: true,
      title: true,
      LessonSubject: {
        select: { label: true, color: true },
      },
      GradeLevels: {
        select: { label: true, color: true },
      },
    },
  });
};

// get lesson by id
export const getLessonByIdData = async (id: string) => {
  return await prisma.lesson.findUnique({ where: { id } });
};

// update lesson
export const updateLessonData = async (id: string, data: object) => {
  return await prisma.lesson.update({ where: { id: id }, data: { ...data } });
};

// delete lesson
export const deleteLessonByIdData = async (id: string) => {
  return await prisma.lesson.delete({ where: { id } });
};
