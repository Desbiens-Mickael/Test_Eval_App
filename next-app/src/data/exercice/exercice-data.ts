import { prisma } from "@/lib/db";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { Exercice, ExerciceType } from "@prisma/client";

export type ExerciceOutput = {
  id: string;
  title: string;
  lesson: {
    title: string;
    LessonSubject: {
      label: string;
      color: string;
    };
  };
  level: {
    label: string;
    color: string;
  };
};

/**
 * Get all exercice
 * @returns exercice list
 */
export const getAllExercicesData = async (): Promise<ExerciceOutput[]> => {
  try {
    return await prisma.exercice.findMany({
      select: {
        id: true,
        title: true,
        lesson: {
          select: {
            title: true,
            LessonSubject: {
              select: { label: true, color: true },
            },
          },
        },
        level: {
          select: {
            label: true,
            color: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error("Échec de la récupération des exercices");
  }
};

/**
 * Récupère tous les exercices selon leur type
 *
 * @param {ExerciceType} type - Le type d'exercice à récupérer. Valeurs possibles : "Card" | "True_or_False" | "List" | "Fill_blank".
 * @returns {Promise<ExerciceOutput[]>} - Une promesse qui résout à une liste d'exercices contenant l'ID, le titre, le nom de la leçon, le sujet de la leçon et le niveau.
 *
 * @example
 * // Récupérer tous les exercices de type "Card"
 * const exercises = await getAllExerciceByType("Card");
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par le type donné. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `lesson.name`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const getAllExercicesByTypeData = async (
  type: ExerciceType,
  authorId: string
): Promise<ExerciceOutput[]> => {
  return prisma.exercice.findMany({
    where: {
      type: type,
      authorId: authorId,
    },
    select: {
      id: true,
      title: true,
      lesson: {
        select: {
          title: true,
          LessonSubject: {
            select: { label: true, color: true },
          },
        },
      },
      level: {
        select: {
          label: true,
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// get exercice by id
export const getExerciceByIdData = async (
  id: string
): Promise<Exercice | null> => {
  return await prisma.exercice.findUnique({ where: { id } });
};

// create exercice
export const createExerciceData = async (
  data: createExerciceFormInput,
  authorId: string,
  lessonID: string
): Promise<Exercice> => {
  return await prisma.exercice.create({
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      authorId: authorId,
      levelID: data.exerciceLevelId,
      typeID: data.exerciceTypeId,
      lessonID: lessonID,
    },
  });
};

// update exercice
export const updateExerciceData = async (
  id: string,
  data: object
): Promise<Exercice> => {
  return await prisma.exercice.update({ where: { id: id }, data: { ...data } });
};

// delete exercice
export const deleteExerciceByIdData = async (id: string): Promise<Exercice> => {
  return await prisma.exercice.delete({ where: { id } });
};
