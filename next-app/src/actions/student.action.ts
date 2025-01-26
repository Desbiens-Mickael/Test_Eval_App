"use server";

import { getGroupByIdData } from "@/data/group.data";
import { getAllStudentsByAuthorIdData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";

export const getAllStudentsByAuthorIdAction = async (
  authorId: string,
  groupId: string
) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN" || user.id !== authorId) {
    return { error: "Action non autoriser !" };
  }

  const group = await getGroupByIdData(groupId, user.id);
  if (!group) {
    return { error: "Ce groupe n'existe pas !" };
  }

  try {
    const students = await getAllStudentsByAuthorIdData(user.id, groupId);
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
