"use server";

import {
  addExerciceResultData,
  addExerciceToGroupData,
  createExerciceData,
  deleteExercicesData,
  getAllExercicesByLessonIdData,
  getExercicesPageData,
  getExerciceByIdData,
  getExercicesInfoBeforeDelete,
  getExercicesWithAuthor,
  getExercisesByGroupIdAndSubjectData,
  getStudentExerciceByIdData,
  getStudentExerciceByStudentIdData,
  getStudentExercicesPageData,
  removeExerciceFromGroupData,
  updateExerciceData,
} from "@/data/exercice/exercice-data";
import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import {
  getExerciceTypeByIdData,
  getExerciceTypeByNameData,
} from "@/data/exercice/exercice-type.data";
import { PageQueryInput, pageQuerySchema } from "@/shema-zod/pagination.shema";
import { getLessonInGroupData } from "@/data/lesson/lesson-activities.data";
import { countExerciceSubmissionsData } from "@/data/exercice/practice-data";
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
import {
  getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData,
  getStudentByIdData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import {
  areResultsVisible,
  formatControlDate,
  getControlStatus,
} from "@/lib/control-period";
import { formatExercice } from "@/lib/exercice-format";
import { gradeExercice } from "@/lib/exercice-grading";
import { Prisma } from "@prisma/client";
import {
  globalExerciceCorectionShema,
  globalExerciceCorectionType,
} from "@/shema-zod/exercice-corection.shema";
import {
  contentSchemaByType,
  createExerciceFormInput,
  globalExerciceSchema,
} from "@/shema-zod/exercice.shema";
import { Exercice, ExerciceType, StudentExerciceCard } from "@/type/exercice";

/** Vérifie que le contenu correspond bien au type d'exercice choisi */
const isContentValidForType = async (typeId: string, content: unknown) => {
  const type = await getExerciceTypeByIdData(typeId);
  const schema = type && contentSchemaByType[type.name];
  return Boolean(schema?.safeParse(content).success);
};

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

    if (
      !(await isContentValidForType(
        validatedData.data.exerciceTypeId,
        validatedData.data.content
      ))
    ) {
      return { error: "Le contenu ne correspond pas au type d'exercice !" };
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
      success:
        newExercice.kind === "PRACTICE"
          ? "Exercice créé avec succès"
          : "Contrôle créé avec succès",
      data: newExercice,
    };
  } catch (error) {
    console.error("Error creating exercise:", error);
    return {
      error: "Une erreur est survenue lors de la création",
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

    if (
      !(await isContentValidForType(
        validatedData.data.exerciceTypeId,
        validatedData.data.content
      ))
    ) {
      return { error: "Le contenu ne correspond pas au type d'exercice !" };
    }

    // Le type (entraînement / contrôle) ne change plus une fois que des
    // élèves ont rendu une copie ou fait un essai
    const current = await getExerciceByIdData(id);
    if (!current || current.authorId !== user.id) {
      return { error: "Exercice non trouvé !" };
    }
    if (
      current.kind !== validatedData.data.kind &&
      (await countExerciceSubmissionsData(id)) > 0
    ) {
      return {
        error:
          "Des élèves ont déjà fait cet exercice : son usage (exercice ou contrôle) ne peut plus être changé.",
      };
    }

    // Une fois clos (copies manquantes notées, élèves notifiés),
    // un contrôle garde ses dates
    const sameDate = (a?: Date | null, b?: Date | null) =>
      (a?.getTime() ?? null) === (b?.getTime() ?? null);
    if (
      current.closedAt &&
      (!sameDate(current.opensAt, validatedData.data.opensAt) ||
        !sameDate(current.closesAt, validatedData.data.closesAt))
    ) {
      return {
        error:
          "Ce contrôle est clos : ses dates d'ouverture et de clôture ne peuvent plus être modifiées.",
      };
    }

    const exercice = await updateExerciceData(id, user.id, validatedData.data);
    return {
      success:
        exercice.kind === "PRACTICE"
          ? "Exercice mis à jour avec succès"
          : "Contrôle mis à jour avec succès",
      data: exercice,
    };
  } catch (error) {
    console.error("Error updating exercise:", error);
    return {
      error: "Une erreur est survenue lors de la mise à jour",
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
      return { error: "Certains exercices ou contrôles n'existent pas !" };
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
          ? `${exerciceIds.length} exercices ou contrôles ont été supprimés avec succès`
          : "Suppression réussie",
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
      message = `${exercice.kind === "PRACTICE" ? "Exercice retiré" : "Contrôle retiré"} du groupe`;
    } else {
      await addExerciceToGroupData(exerciceId, groupId);
      message = `${exercice.kind === "PRACTICE" ? "Exercice ajouté" : "Contrôle ajouté"} au groupe`;

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
        "Une erreur est survenue lors de la mise à jour du groupe",
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
    if (!exercice.groups?.some((g) => g.id === group.id)) {
      return {
        error: "Action non autorisée !",
      };
    }

    // Un entraînement ne donne jamais de copie notée
    if (exercice.kind !== "CONTROL") {
      return {
        error: "Cet exercice n'est pas un contrôle : il n'est pas noté.",
      };
    }

    // Le contrôle doit être ouvert
    const status = getControlStatus(exercice);
    if (status === "UPCOMING" && exercice.opensAt) {
      return {
        error: `Ce contrôle ouvrira le ${formatControlDate(exercice.opensAt)}.`,
      };
    }
    if (status === "CLOSED") {
      return {
        error: "Ce contrôle est clos : la copie ne peut plus être rendue.",
      };
    }

    // Calcul de la note côté serveur à partir de la solution stockée en base
    let result: { note: number; coeficient: number };
    try {
      result = gradeExercice({
        type: exercice.type.name,
        level: exercice.level.label,
        content: exercice.content,
        response: validatedData.data.response,
      });
    } catch {
      return {
        error: "Données non valide !",
      };
    }

    // Récupérer le sujet de la leçon associée à l'exercice
    const subject = exercice.lesson.LessonSubject.label;

    // Ajouter le résultat de l'exercice
    // (la contrainte unique [studentId, exerciceId] empêche une double soumission)
    let createdExerciceResult;
    try {
      createdExerciceResult = await addExerciceResultData(
        student.id,
        subject,
        validatedData.data,
        result
      );
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return {
          error: "Vous avez déjà réalisé ce contrôle !",
        };
      }
      throw err;
    }

    if (!createdExerciceResult) {
      return {
        error:
          "Une erreur est survenue lors de l'enregistrement du contrôle",
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
        "Une erreur est survenue lors de l'enregistrement du contrôle",
    };
  }
};

// Récupération de tous les exercices d'un type donné
// Une page des exercices ou contrôles du professeur pour un type donné
// (pagination, recherche, filtres et tri côté serveur)
export const getExercicesPageAction = async (
  type: ExerciceType,
  kind: "CONTROL" | "PRACTICE",
  input: PageQueryInput
) => {
  const user = await currentUser();
  if (!user || !user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const parsed = pageQuerySchema.safeParse(input);
  if (!parsed.success || !["CONTROL", "PRACTICE"].includes(kind)) {
    return { error: "Paramètres de pagination invalides." };
  }

  try {
    const exerciceType = await getExerciceTypeByNameData(type);
    if (!exerciceType) {
      return { error: `Type d'exercice ${type} non trouvé` };
    }
    const page = await getExercicesPageData(user.id, exerciceType, kind, parsed.data);
    return { success: "", data: page };
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return { error: "Échec de la récupération des exercices et contrôles" };
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
          error: "Vous avez déjà réalisé ce contrôle !",
          redirect: "/eleve/exercices",
          data: null,
        };
      }
    }

    const exercice = await getExerciceByIdData(id);

    // Un élève ne voit que les exercices de son groupe,
    // un professeur uniquement ses propres exercices.
    let isAllowed = false;
    if (exercice && user.role === "STUDENT") {
      const group = await getGroupByStudentIdData(user.id);
      isAllowed =
        !!group && !!exercice.groups?.some((g) => g.id === group.id);
    } else if (exercice && user.role === "ADMIN") {
      isAllowed = exercice.authorId === user.id;
    }

    // Un entraînement se joue depuis sa propre page
    if (exercice && isAllowed && user.role === "STUDENT" && exercice.kind !== "CONTROL") {
      return {
        error: "Cet exercice n'est pas un contrôle",
        redirect: `/eleve/entrainements/${exercice.id}`,
        data: null,
      };
    }

    if (exercice && isAllowed && user.role === "STUDENT") {
      const status = getControlStatus(exercice);
      if (status !== "OPEN") {
        return {
          error:
            status === "UPCOMING" && exercice.opensAt
              ? `Ce contrôle ouvrira le ${formatControlDate(exercice.opensAt)}.`
              : "Ce contrôle est clos.",
          redirect: "/eleve/exercices",
          data: null,
        };
      }
    }

    if (!exercice || !isAllowed) {
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

    // Les solutions ne sont jamais envoyées au navigateur d'un élève
    const exerciceModified = formatExercice(exercice, {
      withSolutions: user.role !== "STUDENT",
    });

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
        error: "Aucun exercice ni contrôle trouvé",
      };
    }

    const exercicesModified = exercices.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      kind: exercice.kind,
      description: exercice.description,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      type: exercice.type.name,
      groups: exercice.groups,
      opensAt: exercice.opensAt,
      closesAt: exercice.closesAt,
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

    // Les contrôles dont la date de clôture est passée sont clos d'abord
    // (copie non rendue notée 0) : ils quittent ainsi la liste « à faire »
    await closeExpiredControlsSafeData();

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
    // (les contrôles pas encore ouverts sont listés, sans pouvoir être commencés)
    const exercisesToDo = groupExercises.filter(
      (exercise) =>
        !studentExercises.some((e) => e.exerciceId === exercise.id) &&
        getControlStatus(exercise) !== "CLOSED"
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
// Copies affichées par page (grille de 4 colonnes × 3 lignes)
const DONE_PAGE_SIZE = 12;

export const getExercisesDoneAction = async (
  subject?: string,
  studentId?: string,
  pagination: { page?: number; pageSize?: number } = {}
) => {
  // Récupération de l'utilisateur connecté en session
  const user = await currentUser();
  // Vérification que l'utilisateur est connecté et qu'il est bien un élève
  if (
    !user ||
    !user?.id ||
    !(user.role === "STUDENT" || user.role === "ADMIN")
  ) {
    return {
      error: "Action non autoriser !",
    };
  }

  // Si l'utilisateur est un élève, on utilise son id
  let studentIdToUse = user.id;

  // Si l'utilisateur est un professeur et qu'il a spécifié un id d'élève
  if (user.role === "ADMIN" && studentId) {
    // Vérification que l'élève existe et que l'élève est bien relier au professeur connecté
    const student = await getStudentByIdData(studentId);
    if (!student || student.professorId !== user?.id) {
      return {
        error: "Action non autoriser !",
      };
    }
    studentIdToUse = student.id;
  }

  try {
    // Récupération du groupe de l'élève
    const groupStudent = await getGroupByStudentIdData(studentIdToUse);
    if (!groupStudent) {
      return {
        error: "Action non autorisée !",
      };
    }

    await closeExpiredControlsSafeData();

    const parsed = pageQuerySchema
      .pick({ page: true, pageSize: true })
      .safeParse({ page: pagination.page, pageSize: pagination.pageSize ?? DONE_PAGE_SIZE });
    if (!parsed.success) {
      return { error: "Paramètres de pagination invalides." };
    }

    // Une page des copies de l'élève, de la plus récente à la plus ancienne
    const page = await getStudentExercicesPageData(studentIdToUse, subject, parsed.data);

    // Copies, y compris celles dont l'exercice a été supprimé (exerciceId null)
    const exercisesDone = page.items
      .map((studentExercice) => {
        // L'élève ne voit sa note qu'à la clôture du contrôle ;
        // le professeur la voit toujours
        const closesAt = studentExercice.exercice?.closesAt ?? null;
        const hidden =
          user.role === "STUDENT" && !areResultsVisible({ closesAt });
        return {
          exerciceId: studentExercice.exerciceId || null,
          title: studentExercice.exercice?.title || null,
          lessonSubject:
            studentExercice.exercice?.lesson.LessonSubject.label || null,
          lessonSubjectColor:
            studentExercice.exercice?.lesson.LessonSubject.color || null,
          studentExerciceId: studentExercice.id,
          note: hidden ? null : studentExercice.note,
          coeficient: studentExercice.coeficient,
          createdAt: studentExercice.createdAt,
          isMissing: studentExercice.isMissing,
          resultsAvailableAt: hidden ? closesAt : null,
        };
      })
      .filter((exercise) => exercise !== undefined) as StudentExerciceCard[];

    return {
      success: "Exercices trouvés",
      data: { ...page, items: exercisesDone },
    };
  } catch (error) {
    console.error("Error fetching exercises by group ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche des exercices",
    };
  }
};

// Récupération d'un studentExercice par son ID
export const getStudentExerciceByIdAction = async (
  studentExerciceId: string
) => {
  const user = await currentUser();
  if (!user || !user?.id) {
    return {
      error: "Action non autoriser !",
      data: null,
    };
  }

  try {
    const studentExercice = await getStudentExerciceByIdData(studentExerciceId);

    // Seul l'élève concerné ou son professeur peuvent voir la correction
    const isOwner =
      (user.role === "STUDENT" && studentExercice?.studentId === user.id) ||
      (user.role === "ADMIN" &&
        studentExercice?.student.professorId === user.id);

    if (!studentExercice || !isOwner) {
      return {
        error: "Correction non trouvée",
        data: null,
      };
    }

    // Pas de note ni de correction pour l'élève avant la clôture
    const closesAt = studentExercice.exercice?.closesAt ?? null;
    if (user.role === "STUDENT" && !areResultsVisible({ closesAt })) {
      return {
        error: closesAt
          ? `La correction sera disponible le ${formatControlDate(closesAt)}.`
          : "Correction non disponible",
        data: null,
      };
    }

    // « Revoir la leçon » pour l'élève, si la leçon est attribuée à son groupe
    let lesson: { id: string; title: string } | null = null;
    if (user.role === "STUDENT" && studentExercice.exercice) {
      const group = await getGroupByStudentIdData(user.id);
      if (group) {
        lesson = await getLessonInGroupData(
          studentExercice.exercice.lessonID,
          group.id
        );
      }
    }

    return {
      success: "Correction trouvée",
      data: { ...studentExercice, lesson },
    };
  } catch (error) {
    console.error("Error fetching studentExercice by ID:", error);
    return {
      error: "Une erreur est survenue lors de la recherche de la correction",
      data: null,
    };
  }
};
