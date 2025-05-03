"use server";

// src/actions/student.action.ts
import { UpdateStudentData } from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { capitalize } from "@/lib/utils";
import {
  studentInfosFormSchema,
  studentInfosFormType,
} from "@/shema-zod/auth.shema";

// Action pour modifier les infos d'un étudiant (prénom/nom)
export const updateStudentInfosAction = async (infos: studentInfosFormType) => {
  const infosValide = studentInfosFormSchema.safeParse(infos);
  if (!infosValide.success) return { error: "Données non-valide!" };

  const student = await currentUser();
  if (!student || !student.id) return { error: "Action non autoriser!" };

  try {
    const name = `${capitalize(infos.firstname)} ${capitalize(infos.lastname)}`;
    const updated = await UpdateStudentData(student.id, { name });
    return { success: "Informations modifiées avec succès.", data: updated };
  } catch (error) {
    return { error: "Erreur lors de la modification des informations." };
  }
};
