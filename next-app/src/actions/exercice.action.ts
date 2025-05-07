"use server";

import {
  addExerciceResultData,
  addExerciceToGroupData,
  createExerciceData,
  deleteExercicesData,
  getAllExercicesByLessonIdData,
  getAllExercicesByTypeData,
  getExerciceByIdData,
  getExercicesInfoBeforeDelete,
  getExercicesWithAuthor,
  getExercisesByGroupIdAndSubjectData,
  getStudentExerciceByStudentIdData,
  removeExerciceFromGroupData,
  updateExerciceData,
} from "@/data/exercice/exercice-data";
import { getExerciceTypeByNameData } from "@/data/exercice/exercice-type.data";
import {
  getGroupByIdAndAuthorIdData,
  getGroupByStudentIdData,
} from "@/data/group.data";
import {
  getLessonByIdData,
  getLessonBySlugData,
} from "@/data/lesson/lesson-data";
import {
  createNotificationCompletionData,
  createNotificationExerciseData,
  createStudentNotificationData,
  createTeacherNotificationData,
} from "@/data/notification/notification.data";
import { getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import {
  globalExerciceCorectionShema,
  globalExerciceCorectionType,
} from "@/shema-zod/exercice-corection.shema";
import {
  createExerciceFormInput,
  globalExerciceSchema,
} from "@/shema-zod/exercice.shema";
import { Exercice, ExerciceType, StudentExerciceCard } from "@/type/exercice";

// Création d'un exercice
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

// Mise à jour d'un exercice
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

// Suppression d'un ou plusieurs exercices
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

// Ajoute ou retire un exercice d'un groupe
export const toggleExerciceGroupAction = async (
  exerciceId: string,
  groupId: string
) => {
  try {
    // Vérification de l'utilisateur
    const user = await currentUser();
    if (!user || !user.id || user.role !== "ADMIN") {
      return { error: "Action non autorisée !" };
    }

    // Vérification que le groupe existe et appartient à l'utilisateur
    const group = await getGroupByIdAndAuthorIdData(groupId, user.id);
    if (!group) {
      return { error: "Groupe non trouvé !" };
    }
    if (group.authorId !== user.id) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Vérification que l'exercice existe et appartient à l'utilisateur
    const exercice = await getExerciceByIdData(exerciceId);
    if (!exercice) {
      return { error: "Exercice non trouvé !" };
    }
    if (exercice.authorId !== user.id) {
      return {
        error: "Action non autorisée !",
      };
    }

    let message: string;
    // Ajoute ou retire l'exercice du groupe
    if (exercice?.groups?.some((group) => group.id === groupId)) {
      await removeExerciceFromGroupData(exerciceId, groupId);
      message = "Exercice retiré du groupe avec succes";
    } else {
      await addExerciceToGroupData(exerciceId, groupId);
      message = "Exercice ajouté au groupe avec succes";

      // Récupérer tout les ids des élèves du groupe
      const studentIds =
        await getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData(
          user.id,
          groupId
        );

      // Créer une notification pour l'exercice
      const notification = await createNotificationExerciseData({
        exerciseId: exercice.id,
        createdByTeacherId: user.id,
        message: exercice.title,
      });
      // Créer des notifications pour chaque élève
      await createStudentNotificationData(notification.id, studentIds);
    }

    return {
      success: message,
      data: exercice,
    };
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de l'exercice au groupe:",
      error
    );
    return {
      error:
        "Une erreur est survenue lors de la mise à jour de l'exercice au groupe",
    };
  }
};

// Ajout d'un résultat d'exercice pour un élève
export const addExerciceResultAction = async (
  data: globalExerciceCorectionType
) => {
  // Validation des données avec Zod
  const validatedData = globalExerciceCorectionShema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Données non valide !",
    };
  }

  try {
    // Vérifier que l'utilisateur est connecté
    const student = await currentUser();
    if (!student || !student?.id || student.role !== "STUDENT") {
      return {
        error: "Action non autorisée !",
      };
    }

    // Vérifier que l'exercice existe et qu'il est bien dans le groupe de l'élève
    const exercice = await getExerciceByIdData(validatedData.data.exerciceId);
    if (!exercice) {
      return {
        error: "Exercice non trouvé !",
      };
    }

    // Récupération du groupe de l'élève
    const group = await getGroupByStudentIdData(student.id);
    if (!group) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Vérifier que l'exercice appartient au groupe de l'élève
    if (!exercice.groups?.some((group) => group.id === group.id)) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Récupérer tout les réponses de l'élève
    const studentExercice = await getStudentExerciceByStudentIdData(student.id);

    // Vérifier que l'exercice n'a pas déjà été corrigé
    if (
      studentExercice.some(
        (e) => e.exerciceId === validatedData.data.exerciceId
      )
    ) {
      return {
        error: "Vous avez déjà réalisé cet exercice !",
      };
    }

    // Récupérer le sujet de la leçon associée à l'exercice
    const subject = exercice.lesson.LessonSubject.label;

    // Ajouter le résultat de l'exercice
    const createdExerciceResult = await addExerciceResultData(
      student.id,
      subject,
      validatedData.data
    );

    if (!createdExerciceResult) {
      return {
        error:
          "Une erreur est survenue lors de l'ajout du résultat de l'exercice",
      };
    }

    // Ajouter une notification pour le professeur
    const notification = await createNotificationCompletionData({
      completionId: createdExerciceResult.id,
      createdByStudentId: student.id,
      message: `${student.name} a réalisé l'exercice ${exercice.title}`,
    });

    if (!notification) {
      return {
        error: "Une erreur est survenue lors de la création de la notification",
      };
    }

    // Créer des notifications pour chaque professeur
    await createTeacherNotificationData(notification.id, group.authorId);

    return {
      success: "Votre réponse a bien été enregistrée",
      data: createdExerciceResult,
    };
  } catch (error) {
    console.error("Error adding exercise result:", error);
    return {
      error:
        "Une erreur est survenue lors de l'ajout du résultat de l'exercice",
    };
  }
};

// Récupération de tous les exercices d'un type donné
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

// Récupération d'un exercice par son ID
export const getExerciceByIdAction = async (id: string) => {
  const user = await currentUser();
  if (!user || !user?.id) {
    return {
      error: "Action non autoriser !",
      redirect: "/",
      data: null,
    };
  }

  try {
    if (user.role === "STUDENT") {
      const studentExercice = await getStudentExerciceByStudentIdData(user.id);
      if (studentExercice.some((e) => e.exerciceId === id)) {
        return {
          error: "Vous avez déjà réalisé cet exercice !",
          redirect: "/eleve/exercices",
          data: null,
        };
      }
    }

    const exercice = await getExerciceByIdData(id);

    if (!exercice) {
      if (user.role === "STUDENT") {
        return {
          error: "Exercice non trouvé",
          redirect: "/eleve/exercices",
          data: null,
        };
      }

      return {
        error: "Exercice non trouvé",
        redirect: "",
        data: null,
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
      data: null,
    };
  }
};

// Récupération de tout les exercices d'une leçon
export const getExercicesByLessonIdAction = async (lessonId: string) => {
  const user = await currentUser();
  if (!user || !user?.id) {
    return {
      error: "Action non autoriser !",
    };
  }

  // Vérification que la leçon existe
  const lesson = await getLessonByIdData(lessonId, user.id);
  if (!lesson) {
    return {
      error: "La leçon n'existe pas !",
    };
  }

  // Vérification que l'utilisateur est bien l'auteur de la leçon
  if (lesson.authorId !== user.id) {
    return {
      error: "Action non autorisée !",
    };
  }

  try {
    const exercices = await getAllExercicesByLessonIdData(lessonId);

    if (!exercices) {
      return {
        error: "Aucun exercice trouvé",
      };
    }

    const exercicesModified = exercices.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      description: exercice.description,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      type: exercice.type.name,
      groups: exercice.groups,
    }));

    return {
      success: "Exercices trouvés",
      data: exercicesModified,
    };
  } catch (error) {
    console.error("Error fetching exercises by lesson ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des exercices",
    };
  }
};

// Récupération de tout les exercices d'un groupe qui n'ont pas encore été fait par l'élève
export const getExercisesToDoAction = async (subject?: string) => {
  // Récupération de l'utilisateur connecté en session
  const student = await currentUser();

  // Vérification que l'utilisateur est connecté et qu'il est bien un élève
  if (!student || !student?.id || student.role !== "STUDENT") {
    return {
      error: "Action non autoriser !",
    };
  }

  try {
    // Récupération du groupe de l'élève
    const groupStudent = await getGroupByStudentIdData(student.id);
    if (!groupStudent) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Récupération des exercices du groupe
    const groupExercises = await getExercisesByGroupIdAndSubjectData(
      groupStudent.id,
      subject
    );

    // Récupération des exercices fait par l'élève
    const studentExercises = await getStudentExerciceByStudentIdData(
      student.id,
      subject
    );

    // Récupération des exercices qui n'ont pas été fait par l'élève
    const exercisesToDo = groupExercises.filter(
      (exercise) => !studentExercises.some((e) => e.exerciceId === exercise.id)
    );

    return {
      success: "Exercices trouvés",
      data: exercisesToDo,
    };
  } catch (error) {
    console.error("Error fetching exercises by group ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des exercices",
    };
  }
};

// Récupération de tout les exercices d'un groupe qui ont été fait par l'élève
export const getExercisesDoneAction = async (subject?: string) => {
  // Récupération de l'utilisateur connecté en session
  const student = await currentUser();

  // Vérification que l'utilisateur est connecté et qu'il est bien un élève
  if (!student || !student?.id || student.role !== "STUDENT") {
    return {
      error: "Action non autoriser !",
    };
  }

  try {
    // Récupération du groupe de l'élève
    const groupStudent = await getGroupByStudentIdData(student.id);
    if (!groupStudent) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Récupération des exercices du groupe
    const groupExercises = await getExercisesByGroupIdAndSubjectData(
      groupStudent.id,
      subject
    );

    // Récupération des exercices fait par l'élève
    const studentExercises = await getStudentExerciceByStudentIdData(
      student.id,
      subject
    );

    // Récupération des exercices qui ont été fait par l'élève
    const exercisesDone = groupExercises
      .map((exercise) => {
        const studentExercice = studentExercises.find(
          (e) => e.exerciceId === exercise.id
        );
        if (studentExercice) {
          return {
            exerciceId: exercise.id,
            title: exercise.title,
            lessonSubject: exercise.lesson.LessonSubject.label,
            lessonSubjectColor: exercise.lesson.LessonSubject.color,
            studentExerciceId: studentExercice.id,
            note: studentExercice.note,
            createdAt: studentExercice.createdAt,
          };
        }
      })
      .filter((exercise) => exercise !== undefined) as StudentExerciceCard[];

    return {
      success: "Exercices trouvés",
      data: exercisesDone,
    };
  } catch (error) {
    console.error("Error fetching exercises by group ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des exercices",
    };
  }
};
