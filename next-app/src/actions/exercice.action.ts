"use server";

import {
  createExerciceData,
  deleteExercicesData,
  getAllExercicesByTypeData,
  getExerciceByIdData,
  getExercicesInfoBeforeDelete,
  getExercicesWithAuthor,
  updateExerciceData,
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
      description: exercice.description,
      content: exercice.content,
      lesson: exercice.lesson.title,
      levelId: exercice.level.id,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
      typeId: exercice.type.id,
      type: exercice.type.name,
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

export const getExerciceByIdAction = async (id: string) => {
  const user = await currentUser();
  if (!user || !user?.id) {
    return {
      error: "Action non autoriser !",
    };
  }

  try {
    const exercice = await getExerciceByIdData(id);

    if (!exercice) {
      return {
        error: "Exercice non trouvé",
      };
    }

    const exerciceModified = {
      id: exercice.id,
      title: exercice.title,
      description: exercice.description,
      content: exercice.content,
      lesson: exercice.lesson.title,
      levelId: exercice.level.id,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
      typeId: exercice.type.id,
      type: exercice.type.name,
    };

    return {
      success: "Exercice trouvé",
      data: exerciceModified,
    };
  } catch (error) {
    console.error("Error fetching exercise by ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche de l'exercice",
    };
  }
};

export const updateExerciceAction = async (
  id: string,
  data: createExerciceFormInput
) => {
  const validatedData = globalExerciceSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Données non valide !",
    };
  }

  try {
    const user = await currentUser();
    if (!user || !user?.id || user.role !== "ADMIN") {
      return {
        error: "Action non autoriser !",
      };
    }

    const exercice = await updateExerciceData(id, user.id, data);
    return {
      success: "Exercice mis à jour avec successe",
      data: exercice,
    };
  } catch (error) {
    console.error("Error updating exercise:", error);
    return {
      error: "Une erreur est survenue lors de la mise à jour de l'exercice",
    };
  }
};

export async function deleteExercicesAction(exerciceIds: string[]) {
  try {
    // Vérification de l'utilisateur
    const user = await currentUser();
    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Action non autorisée !" };
    }

    // Vérification que les leçons existent et appartiennent à l'utilisateur
    const lessons = await getExercicesWithAuthor(exerciceIds);

    // Vérifier si toutes les leçons ont été trouvées
    if (lessons.length !== exerciceIds.length) {
      return { error: "Certains exercices n'existent pas !" };
    }

    // Vérifier si l'utilisateur est l'auteur de toutes les leçons
    const unauthorizedLessons = lessons.filter(
      (lesson) => lesson.authorId !== user.id
    );
    if (unauthorizedLessons.length > 0) {
      return {
        error: "Vous n'avez pas les droits necessaires pour cette action !",
      };
    }

    // Get lesson info before deletion for cache invalidation
    const lessonsInfo = await getExercicesInfoBeforeDelete(exerciceIds);

    // Delete the lessons
    await deleteExercicesData(exerciceIds, user.id);

    return {
      success:
        exerciceIds.length > 1
          ? `${exerciceIds.length} exercices ont été supprimées avec succès`
          : "L'exercice a été supprimée avec succès",
      data: lessonsInfo,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression des exercices:", error);
    return {
      error:
        "Une erreur est survenue lors de la suppression, Veuillez réessayer.",
    };
  }
}
