"use server";

import { getGroupByIdData } from "@/data/group.data";
import {
  getAllStudentsByAuthorIdData,
  getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";

// Récupérer tout les élèves de l'utilisateur connecté
export const getAllStudentsByAuthorIdAction = async () => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    const students = await getAllStudentsByAuthorIdData(user.id);
    return { success: "", data: students };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la récupération des élèves.",
    };
  }
};

// Récupérer tout les élèves de l'utilisateur connecté qui se trouvent dans le groupe demandé
export const getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdAction = async (
  groupId: string
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  const group = await getGroupByIdData(groupId, user.id);
  if (!group) {
    return { error: "Ce groupe n'existe pas !" };
  }

  try {
    const students =
      await getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdData(
        user.id,
        groupId
      );
    return {
      success: "",
      data: students,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la récupération des groupes.",
    };
  }
};
