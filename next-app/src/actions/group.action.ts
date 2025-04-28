"use server";

import {
  addLessonsToGroupData,
  addStudentToGroupData,
  createGroupData,
  deleteGroupData,
  getGroupByIdData,
  getGroupsByAuthorIdData,
  removeLessonFromGroupData,
} from "@/data/group.data";
import { getLessonsByIdsData } from "@/data/lesson/lesson-data";
import {
  createNotificationLessonData,
  createStudentNotificationData,
} from "@/data/notification/notification.data";
import {
  getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData,
  getStudentByIdentifierlData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { CreateGroupInput, createGroupSchema } from "@/shema-zod/group.shema";

// Récupérer tous les groupes de l'utilisateur connecté
export const getAllGroupsAction = async () => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const groups = await getGroupsByAuthorIdData(user.id);
    return { success: "Groupes trouvés.", data: groups };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la récupération des groupes.",
    };
  }
};

export const getGroupByIdAction = async (groupId: string) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const group = await getGroupByIdData(groupId, user.id);
    if (!group) {
      return { error: "Ce groupe n'existe pas !" };
    }

    const formattedGroup = {
      ...group,
      students: group.students.map((student) => ({
        id: student.id,
        name: student.name,
        identifier: student.identifier,
        isActive: student.isActive,
      })),
      lessons: group.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
        subject: lesson.LessonSubject.label,
        subjectColor: lesson.LessonSubject.color,
        gradeLevel: lesson.GradeLevels.label,
        gradeLevelColor: lesson.GradeLevels.color,
      })),
    };

    return { success: "Groupe trouvé.", data: formattedGroup };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la récupération du groupe.",
    };
  }
};

// Création d'un groupe
export const createGroupAction = async (data: CreateGroupInput) => {
  const isDataValide = createGroupSchema.safeParse(data);
  if (!isDataValide.success) return { error: "Données non valide !" };

  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const existingGroups = await getGroupsByAuthorIdData(user.id);
    // Vérifier si le groupe existe déja
    if (existingGroups.length > 0) {
      const existingGroup = existingGroups.find(
        (group) => group.name.toLowerCase() === data.name.toLowerCase()
      );

      if (existingGroup) {
        return { error: "Ce groupe existe déjà !" };
      }
    }

    // Créer le groupe
    const group = await createGroupData(data.name, user.id);
    return { success: "Groupe créer avec successe.", data: group };
  } catch (error) {
    console.error(error);
    return { error: "Une erreur est survenue lors de la création du groupe." };
  }
};

// Ajouter un élève à un groupe
export const addStudentToGroupAction = async (
  groupId: string,
  identifier: string
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const group = await getGroupByIdData(groupId, user.id);
    if (!group) {
      return { error: "Ce groupe n'existe pas !" };
    }

    // Vérifier si l'utilisateur est l'auteur du groupe
    if (group.authorId !== user.id) {
      return { error: "Action non autoriser !" };
    }

    // Vérifier si l'éleve existe
    const student = await getStudentByIdentifierlData(identifier);
    if (!student) {
      return { error: "Cet élève n'existe pas !" };
    }

    // Vérifier si l'éleve est deja dans le groupe
    if (group.students.some((student) => student.identifier === identifier)) {
      return { error: "Cet élève est déjà dans le groupe." };
    }

    // Ajouter l'éleve au groupe
    const response = await addStudentToGroupData(groupId, student.id);
    return { success: "Eleve ajouté au groupe avec successe.", data: response };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de l'ajout de l'éleve au groupe.",
    };
  }
};

export const deleteGroupAction = async (groupId: string) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    // Vérifier si le groupe existe
    const group = await getGroupByIdData(groupId, user.id);
    if (!group) {
      return { error: "Ce groupe n'existe pas !" };
    }

    // Vérifier si l'utilisateur est l'auteur du groupe
    if (group.authorId !== user.id) {
      return { error: "Action non autoriser !" };
    }

    // Supprimer le groupe
    await deleteGroupData(groupId, user.id);
    return { success: "Groupe supprimé avec succès." };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la suppression du groupe.",
    };
  }
};

export const addLessonsToGroupAction = async (
  groupId: string,
  lessonIds: string[]
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    // Vérifier si le groupe existe
    const group = await getGroupByIdData(groupId, user.id);
    if (!group) {
      return { error: "Ce groupe n'existe pas !" };
    }

    // Vérifier si l'utilisateur est l'auteur du groupe
    if (group.authorId !== user.id) {
      return { error: "Action non autoriser !" };
    }

    // Vérifier si les leçons existent
    const lessons = await getLessonsByIdsData(lessonIds);
    if (!lessons || lessons.length !== lessonIds.length) {
      return { error: "Certaines leçons n'existent pas !" };
    }

    // Ajouter les leçons au groupe
    const response = await addLessonsToGroupData(groupId, lessonIds);

    // Récupérer tout les ids des élèves du groupe
    const studentIds =
      await getAllStudentsByAuthorIdwhoBelongToTheGroupIdIdsData(
        user.id,
        groupId
      );

    // Créer des notifications pour chaque leçon ajoutée
    for (const lesson of lessons) {
      const notification = await createNotificationLessonData({
        lessonId: lesson.id,
        createdByTeacherId: user.id,
        message: lesson.title,
      });
      // Créer des notifications pour chaque élève
      await createStudentNotificationData(notification.id, studentIds);
    }

    return {
      success: "Leçons ajoutées au groupe avec succès.",
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de l'ajout des leçons au groupe.",
    };
  }
};

export const removeLessonFromGroupAction = async (
  groupId: string,
  lessonId: string
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    // Vérifier si le groupe existe
    const group = await getGroupByIdData(groupId, user.id);
    if (!group) {
      return { error: "Ce groupe n'existe pas !" };
    }

    // Vérifier si l'utilisateur est l'auteur du groupe
    if (group.authorId !== user.id) {
      return { error: "Action non autoriser !" };
    }

    // Supprimer la leçon du groupe
    const response = await removeLessonFromGroupData(groupId, lessonId);
    return {
      success: "Leçon retirée du groupe avec succès.",
      data: response,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors du retrait de la leçon.",
    };
  }
};
