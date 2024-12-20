"use server";

import {
  createExerciceData,
  getAllExercicesByTypeData,
} from "@/data/exercice/exercice-data";
import { getExerciceTypeByNameData } from "@/data/exercice/exercice-type.data";
import { getLessonBySlugData } from "@/data/lesson/lesson-data";
import { currentUser } from "@/lib/auth";
import {
  createExerciceFormInput,
  globalExerciceSchema,
} from "@/shema-zod/exercice.shema";
import { Exercice, ExerciceType } from "@/type/exercice";

export const getAllExercicesByTypeAction = async (
  type: ExerciceType
): Promise<Exercice[]> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const user = await currentUser();
    if (!user || !user?.id || user.role !== "ADMIN") {
      throw new Error("Action non autoriser !");
    }

    // Recherche du type d'exercice par son nom
    const exerciceType = await getExerciceTypeByNameData(type);
    if (!exerciceType) {
      throw new Error(`Type d'exercice ${type} non trouvé`);
    }

    // Récupération des exercices selon leur type
    const exercicesData = await getAllExercicesByTypeData(
      exerciceType,
      user.id
    );

    // Formatage des exercices
    return exercicesData.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      lesson: exercice.lesson.title,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw Error("Échec de la récupération des exercices");
  }
};

export const createExerciceAction = async (
  data: createExerciceFormInput,
  lessonSlug: string
) => {
  const validatedData = globalExerciceSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Données non valide !",
    };
  }

  try {
    // Vérifier que l'utilisateur est connecté
    const user = await currentUser();
    if (!user || !user?.id || user.role !== "ADMIN") {
      return {
        error: "Action non autoriser !",
      };
    }

    // Vérifier que la leçon existe
    const lesson = await getLessonBySlugData(lessonSlug, user.id);
    if (!lesson) {
      return {
        error: "La leçon n'existe pas !",
      };
    }

    // Créer l'exercice avec l'ID de l'auteur et l'ID de la leçon
    const newExercice = await createExerciceData(
      validatedData.data,
      user.id,
      lesson.id
    );

    return {
      success: "Exercice crée avec successe",
      data: newExercice,
    };
  } catch (error) {
    console.error("Error creating exercise:", error);
    return {
      error: "Une erreur est survenue lors de la création de l'exercice",
    };
  }
};
