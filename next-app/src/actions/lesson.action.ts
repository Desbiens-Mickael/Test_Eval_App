"use server";

import { getAuthorIdOfGroupByUserId } from "@/data/group.data";
import {
  createLessonData,
  deleteLessonsData,
  getAllLessonBySubjectData,
  getLessonByIdData,
  getLessonBySlugData,
  getLessonsInfoBeforeDelete,
  getLessonsWithAuthor,
  updateLessonData,
} from "@/data/lesson/lesson-data";
import { currentUser } from "@/lib/auth";
import { stringToSlug } from "@/lib/utils";
import {
  CreateLessonInput,
  createLessonSchema,
} from "@/shema-zod/lesson.shema";
import { Lesson } from "@/type/lesson";
import { Prisma } from "@prisma/client";

/**
 * Désérialise le contenu d'une leçon en convertissant le contenu JSON string en objet
 * @param {CreateLessonInput} data - Les données de la leçon à désérialiser
 * @returns {Object} Les données désérialisées avec le contenu parsé
 */
const serializeLessonContent = (data: CreateLessonInput) => {
  return {
    ...data,
    content:
      typeof data.content === "string"
        ? JSON.parse(data.content)
        : data.content,
  };
};

/**
 * Récupère toutes les leçons pour un sujet donné
 * @param {string} subject - Le sujet pour lequel récupérer les leçons
 * @returns {Promise<Lesson[]>} Un tableau des leçons formatées
 * @throws {Error} Si la récupération échoue
 */
export const getAllLessonsBySubjectAction = async (
  subject: string
): Promise<Lesson[]> => {
  try {
    const lessonsData = await getAllLessonBySubjectData(subject);

    return lessonsData.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        subject: lesson.LessonSubject.label,
        subjectColor: lesson.LessonSubject.color,
        gradeLevel: lesson.GradeLevels.label,
        gradeLevelColor: lesson.GradeLevels.color,
      };
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw Error("Échec de la récupération des leçons. Veuillez réessayer.");
  }
};

/**
 * Récupère une leçon spécifique par son slug
 * @param {string} slug - Le slug de la leçon à récupérer
 * @returns {Promise<Object>} Un objet contenant soit la leçon trouvée, soit une erreur
 * - success: Message de succès avec la leçon sérialisée
 * - error: Message d'erreur si la récupération échoue
 */
export const getLessonBySlugAction = async (slug: string) => {
  // Récupérer l'utilisateur actuellement connecté
  const user = await currentUser();
  if (!user || !user.id) return { error: "Action non autoriser !" };
  let authorId = user.id;

  try {
    // Si l'utilisateur connecté n'est pas un admin
    if (user.role !== "ADMIN") {
      // Récupérer l'authorId du groupe de l'utilisateur connecté
      const existingAuthor = await getAuthorIdOfGroupByUserId(user.id);
      if (!existingAuthor) return { error: "Action non autoriser !" };

      authorId = existingAuthor.author.id;
    }

    // Récupération de la leçon
    const lesson = await getLessonBySlugData(slug, authorId);
    if (!lesson) return { error: "Cette leçon n'existe pas !" };

    // Sérialiser le contenu
    const contentSerialized = JSON.stringify(lesson.content);
    const lessonSerialized = {
      ...lesson,
      content: contentSerialized,
    };

    return {
      success: "La leçon a été trouvée avec succès.",
      lesson: lessonSerialized,
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Une erreur est survenue lors de la récupération des données. Veuillez réessayer.",
    };
  }
};

/**
 * Crée une nouvelle leçon
 * @param {CreateLessonInput} data - Les données de la leçon à créer
 * @returns {Promise<Object>} Un objet contenant soit les données de la leçon créée, soit une erreur
 * - success: Message de succès avec les données de la leçon
 * - error: Message d'erreur si la création échoue
 * @throws {Prisma.PrismaClientKnownRequestError} Si une leçon avec le même titre existe déjà
 */
export const createLessonAction = async (data: CreateLessonInput) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN")
    return { error: "Action non autoriser !" };

  const isDataValide = createLessonSchema.safeParse(data);
  if (!isDataValide.success) return { error: "Données non valide !" };

  // Désérialiser le contenu de la leçon et cré le slug
  const parsedData = {
    ...serializeLessonContent(data),
    slug: stringToSlug(data.title),
  };

  try {
    const lesson = await createLessonData({ ...parsedData, authorId: user.id });
    return { success: "La leçon a été créée avec succès.", data: lesson };
  } catch (err) {
    console.error(err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "Une leçon avec ce titre existe deja !" };
    }
    return {
      error:
        "Une erreur est survenue lors de la création de la leçon. Veuillez réessayer.",
    };
  }
};

/**
 * Met à jour une leçon existante
 * @param {string} LessonId - L'ID de la leçon à mettre à jour
 * @param {CreateLessonInput} data - Les nouvelles données de la leçon
 * @returns {Promise<Object>} Un objet contenant soit les données de la leçon mise à jour, soit une erreur
 * - success: Message de succès avec les données mises à jour
 * - error: Message d'erreur si la mise à jour échoue
 * @throws {Prisma.PrismaClientKnownRequestError} Si une leçon avec le même titre existe déjà
 */
export const updateLessonAction = async (
  LessonId: string,
  data: CreateLessonInput
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN")
    return { error: "Action non autoriser !" };

  const isDataValide = createLessonSchema.safeParse(data);
  if (!isDataValide.success) return { error: "Données non valide !" };

  try {
    const existingLesson = await getLessonByIdData(LessonId);
    if (!existingLesson) return { error: "Cette leçon n'existe pas !" };
    if (existingLesson && existingLesson.authorId !== user.id)
      return { error: "Action non autoriser !" };

    // Désérialiser le contenu de la leçon et cré le slug
    const parsedData = {
      ...serializeLessonContent(data),
      slug: stringToSlug(data.title),
    };

    const lesson = await updateLessonData(LessonId, {
      ...parsedData,
      authorId: user.id,
    });
    return { success: "La leçon a bien été mise à jour.", data: lesson };
  } catch (err) {
    console.error(err);
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { error: "Une leçon existe déjà avec ce titre !" };
    }
    return {
      error:
        "Une erreur est survenue lors de la mise à jour de la leçon. Veuillez réessayer.",
    };
  }
};

// Suppression de la leçon
export async function deleteLessonsAction(lessonIds: string[]) {
  try {
    // Vérification de l'utilisateur
    const user = await currentUser();
    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Action non autorisée !" };
    }

    // Vérification que les leçons existent et appartiennent à l'utilisateur
    const lessons = await getLessonsWithAuthor(lessonIds);

    // Vérifier si toutes les leçons ont été trouvées
    if (lessons.length !== lessonIds.length) {
      return { error: "Certaines leçons n'existent pas !" };
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
    const lessonsInfo = await getLessonsInfoBeforeDelete(lessonIds);

    // Delete the lessons
    await deleteLessonsData(lessonIds);

    return {
      success:
        lessonIds.length > 1
          ? `${lessonIds.length} leçons ont été supprimées avec succès`
          : "La leçon a été supprimée avec succès",
      data: lessonsInfo,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression des leçons:", error);
    return {
      error:
        "Une erreur est survenue lors de la suppression, Veuillez réessayer.",
    };
  }
}
