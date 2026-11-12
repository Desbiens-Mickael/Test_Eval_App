"use server";

import { getGroupByIdAndAuthorIdData } from "@/data/group.data";
import {
  deleteStudentsData,
  getAllStudentsByAuthorIdData,
  getAllStudentsByAuthorIdwhoDontBelongToTheGroupIdData,
  getStudentByIdData,
  getStudentPublicByIdentifierData,
  UpdateStudentData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { z } from "zod";

// Seuls ces champs peuvent être modifiés par l'élève lui-même
const updateStudentSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
  })
  .partial()
  .strict();

// Mise à jour d'un élève (uniquement pour l'élève connecté)
export const updateStudentAction = async (data: object) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "STUDENT") {
    return { error: "Action non autoriser !" };
  }

  const parsed = updateStudentSchema.safeParse(data);
  if (!parsed.success) return { error: "Données non valide !" };

  try {
    const { password: _password, ...updatedStudent } =
      await UpdateStudentData(user.id, parsed.data);
    return { success: "Compte mis à jour avec succès.", data: updatedStudent };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la mise à jour du compte.",
    };
  }
};

// Supprimer un ou plusieurs élèves
export const deleteStudentsAction = async (studentIds: string[]) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" };
  }

  try {
    // Seuls les élèves du professeur connecté sont supprimés
    const deletedStudents = await deleteStudentsData(studentIds, user.id);
    if (deletedStudents.count !== studentIds.length) {
      return {
        error:
          "Certains élèves n'ont pas été supprimés car ils ne vous appartiennent pas.",
        data: deletedStudents,
      };
    }
    return {
      success:
        studentIds.length > 1
          ? "Les élèves ont bien été supprimés."
          : "L'élève a bien été supprimé.",
      data: deletedStudents,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Une erreur est survenue lors de la suppression des élèves.",
    };
  }
};

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

  const group = await getGroupByIdAndAuthorIdData(groupId, user.id);
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

// Récupérer l'élève connecté par son identifiant
export const getStudentByIdentifierAction = async (identifier: string) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "STUDENT") {
    return { error: "Action non autoriser !" };
  }

  // Un élève ne peut consulter que son propre profil
  if (identifier !== user.identifier) {
    return { error: "Action non autoriser !" };
  }

  try {
    const student = await getStudentPublicByIdentifierData(identifier);
    if (!student) {
      return { error: "Cet élève n'existe pas !" };
    }

    return { success: "Élève récupéré avec succès.", data: student };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Une erreur est survenue lors de la récupération des informations du compte.",
    };
  }
};

// Récupérer les informations d'un élève par son id
export const getStudentByIdAction = async (studentId: string) => {
  const user = await currentUser();
  if (!user || !user.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !", data: null };
  }

  try {
    // Récupération de l'élève
    const student = await getStudentByIdData(studentId);
    if (!student) {
      return { error: "Cet élève n'existe pas !", data: null };
    }

    // Vérifier si l'élève est bien rattaché au professeur connecté
    if (student.professorId !== user.id) {
      return { error: "Action non autoriser !", data: null };
    }

    return { success: "Élève récupéré avec succès.", data: student };
  } catch (error) {
    console.error(error);
    return {
      error:
        "Une erreur est survenue lors de la récupération des informations de l'élève.",
      data: null,
    };
  }
};
