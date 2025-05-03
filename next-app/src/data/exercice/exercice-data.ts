import { prisma } from "@/lib/db";
import { globalExerciceCorectionType } from "@/shema-zod/exercice-corection.shema";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { Exercice, ExerciceType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type ExerciceOutput = {
  id: string;
  authorId?: string;
  title: string;
  description: string;
  content: JsonValue;
  lesson: {
    id: string;
    title: string;
    LessonSubject: {
      label: string;
      color: string;
    };
  };
  level: {
    id: string;
    label: string;
    color: string;
  };
  type: {
    id: string;
    name: string;
  };
  groups?: {
    id: string;
  }[];
};

/**
 * Création d'un exercice
 *
 * @param {createExerciceFormInput} data - Les données de l'exercice à créer.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @param {string} lessonID - L'identifiant de la leçon associée à l'exercice.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice créé.
 *
 * @example
 * // Créer un exercice
 * const newExercise = await createExercice({ title: "New title" }, "1", "1");
 *
 * @description
 * La fonction crée un nouvel exercice avec les données données. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
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

/**
 * Mise à jour d'un exercice
 *
 * @param {string} id - L'identifiant de l'exercice à mettre à jour.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @param {createExerciceFormInput} data - Les données de l'exercice à mettre à jour.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice mis à jour.
 *
 * @example
 * // Mettre à jour l'exercice avec l'identifiant "1"
 * const updatedExercise = await updateExercice("1", "1", { title: "New title" });
 *
 * @description
 * La fonction met à jour l'exercice correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const updateExerciceData = async (
  id: string,
  authorId: string,
  data: createExerciceFormInput
): Promise<Exercice> => {
  return await prisma.exercice.update({
    where: { id: id, authorId: authorId },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      authorId: authorId,
      levelID: data.exerciceLevelId,
      typeID: data.exerciceTypeId,
    },
  });
};

/**
 * Delete multiple exercices
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à supprimer.
 * @param {string} authorId - L'identifiant de l'auteur de l'exercice.
 * @returns {Promise<{ count: number }>} - Une promesse qui résout à l'objet contenant le nombre de lignes supprimées.
 *
 * @example
 * // Supprimer les exercices avec les identifiants "1", "2" et "3"
 * const result = await deleteExercices(["1", "2", "3"]);
 *
 * @description
 * La fonction supprime les exercices correspondant aux identifiants donnés. La fonction retourne l'objet contenant le nombre de lignes supprimées.
 */
export const deleteExercicesData = async (
  exerciceIds: string[],
  authorId: string
) => {
  return await prisma.exercice.deleteMany({
    where: {
      authorId,
      id: {
        in: exerciceIds,
      },
    },
  });
};

/**
 * Ajoute un exercice à un groupe
 *
 * @param {string} exerciceId - L'identifiant de l'exercice à ajouter.
 * @param {string} groupId - L'identifiant du groupe à ajouter.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice ajouté.
 *
 * @example
 * // Ajouter l'exercice avec l'identifiant "1" au groupe avec l'identifiant "2"
 * const addedExercise = await addExerciceToGroup("1", "2");
 *
 * @description
 * La fonction ajoute l'exercice correspondant à l'identifiant donné au groupe correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const addExerciceToGroupData = async (
  exerciceId: string,
  groupId: string
) => {
  return await prisma.exercice.update({
    where: { id: exerciceId },
    data: { groups: { connect: { id: groupId } } },
  });
};

/**
 * Supprime un exercice d'un groupe
 *
 * @param {string} exerciceId - L'identifiant de l'exercice à supprimer.
 * @param {string} groupId - L'identifiant du groupe à supprimer.
 * @returns {Promise<Exercice>} - Une promesse qui résout à l'exercice supprimé.
 *
 * @example
 * // Supprimer l'exercice avec l'identifiant "1" du groupe avec l'identifiant "2"
 * const removedExercise = await removeExerciceFromGroup("1", "2");
 *
 * @description
 * La fonction supprime l'exercice correspondant à l'identifiant donné du groupe correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const removeExerciceFromGroupData = async (
  exerciceId: string,
  groupId: string
) => {
  return await prisma.exercice.update({
    where: { id: exerciceId },
    data: { groups: { disconnect: { id: groupId } } },
  });
};

/**
 * Ajoute le résultat d'un exercice pour un élève ainsi que sa note
 *
 * @param {string} exerciceId - L'identifiant de l'exercice.
 * @param {string} studentId - L'identifiant de l'élève.
 * @param {string} subject - Le sujet de l'exercice.
 * @param {string} response - La réponse de l'élève.
 * @param {number} note - La note de l'élève.
 * @param {number} coeficient - Le coeficient de l'exercice.
 * @returns {Promise<StudentExercice>} - Une promesse qui résout à l'exercice ajouté.
 *
 * @example
 * // Ajouter le résultat de l'exercice avec l'identifiant "1" pour l'élève avec l'identifiant "2"
 * const addedExerciseResult = await addExerciceResult("1", "2", "Mathématiques", "1", "2", "3", "4");
 *
 * @description
 * La fonction ajoute le résultat de l'exercice correspondant à l'identifiant donné pour l'élève correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const addExerciceResultData = async (
  studentId: string,
  subject: string,
  data: globalExerciceCorectionType
) => {
  return await prisma.studentExercice.create({
    data: {
      studentId,
      exerciceId: data.exerciceId,
      subject,
      response: data.response,
      note: data.note,
      coeficient: data.coeficient,
    },
  });
};

/**
 * Get exercices info before delete
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à supprimer.
 * @returns {Promise<ExerciceOutput[]>} - Une promesse qui résout à une liste d'exercices.
 *
 * @example
 * // Récupérer les exercices avec les identifiants "1", "2" et "3"
 * const exercises = await getExercicesInfoBeforeDelete(["1", "2", "3"]);
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par les identifiants donnés. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getExercicesInfoBeforeDelete = async (exerciceIds: string[]) => {
  return await prisma.exercice.findMany({
    where: {
      id: {
        in: exerciceIds,
      },
    },
    select: {
      id: true,
      type: {
        select: { name: true },
      },
    },
  });
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
        description: true,
        content: true,
        lesson: {
          select: {
            id: true,
            title: true,
            LessonSubject: {
              select: { label: true, color: true },
            },
          },
        },
        level: {
          select: {
            id: true,
            label: true,
            color: true,
          },
        },
        type: {
          select: {
            id: true,
            name: true,
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
      description: true,
      content: true,
      lesson: {
        select: {
          id: true,
          title: true,
          LessonSubject: {
            select: { label: true, color: true },
          },
        },
      },
      level: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Récupère un exercice par son identifiant
 *
 * @param {string} id - L'identifiant de l'exercice à récupérer.
 * @returns {Promise<ExerciceOutput | null>} - Une promesse qui résout à l'exercice correspondant à l'identifiant donné, ou null si l'exercice n'existe pas.
 *
 * @example
 * // Récupérer l'exercice avec l'identifiant "1"
 * const exercise = await getExerciceById("1");
 *
 * @description
 * La fonction récupère l'exercice correspondant à l'identifiant donné. Les champs retournés pour l'exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `content`: Le contenu de l'exercice
 * - `lesson.title`: Le nom de la leçon associée à l'exercice
 * - `lesson.LessonSubject.label`: Le sujet de la leçon
 * - `level.label`: Le niveau de difficulté de l'exercice
 */
export const getExerciceByIdData = async (
  id: string
): Promise<ExerciceOutput | null> => {
  return await prisma.exercice.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      authorId: true,
      lesson: {
        select: {
          id: true,
          title: true,
          LessonSubject: {
            select: { label: true, color: true },
          },
        },
      },
      level: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      groups: {
        select: {
          id: true,
        },
      },
    },
  });
};

/**
 * Récupère les auteurs des exercices
 *
 * @param {string[]} exerciceIds - Les identifiants des exercices à récupérer.
 * @returns {Promise<{ id: string; authorId: string }[]>} - Une promesse qui résout à une liste d'objets contenant l'ID de l'exercice et l'ID de l'auteur.
 *
 * @example
 * // Récupérer les auteurs des exercices avec les identifiants "1", "2" et "3"
 * const authors = await getExercicesWithAuthor(["1", "2", "3"]);
 *
 * @description
 * La fonction récupère une liste d'objets contenant l'ID de l'exercice et l'ID de l'auteur. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `authorId`: L'identifiant unique de l'auteur de l'exercice
 */
export const getExercicesWithAuthor = async (exerciceIds: string[]) => {
  return await prisma.exercice.findMany({
    where: {
      id: {
        in: exerciceIds,
      },
    },
    select: {
      id: true,
      authorId: true,
    },
  });
};

/**
 * Récupère tous les exercices d'une leçon
 *
 * @param {string} lessonId - L'identifiant de la leçon.
 * @returns {Promise<ExerciceOutput[]>} - Une promesse qui résout à une liste d'exercices.
 *
 * @example
 * // Récupérer tous les exercices d'une leçon avec l'identifiant "1"
 * const exercises = await getAllExercicesByLessonId("1");
 *
 * @description
 * La fonction récupère une liste d'exercices filtrée par la leçon donnée. Les champs retournés pour chaque exercice sont :
 * - `id`: L'identifiant unique de l'exercice
 * - `title`: Le titre de l'exercice
 * - `description`: La description de l'exercice
 * - `level.label`: Le niveau de difficulté de l'exercice
 * - `type.name`: Le type de l'exercice
 */
export const getAllExercicesByLessonIdData = async (lessonId: string) => {
  return await prisma.exercice.findMany({
    where: {
      lessonID: lessonId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      level: {
        select: {
          id: true,
          label: true,
          color: true,
        },
      },
      type: {
        select: {
          id: true,
          name: true,
        },
      },
      groups: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  });
};

export const getStudentExerciceByStudentIdData = async (studentId: string) => {
  return await prisma.studentExercice.findMany({
    where: {
      studentId: studentId,
    },
  });
};
