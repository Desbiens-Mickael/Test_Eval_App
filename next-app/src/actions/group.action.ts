"use server";

import {
  addStudentToGroupData,
  createGroupData,
  deleteGroupData,
  getGroupByIdData,
  getGroupsByAuthorIdData,
} from "@/data/group.data";
import { getStudentByIdentifierlData } from "@/data/student-data";
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

    return { success: "Groupe trouvé.", data: group };
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
  console.log(data);
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
