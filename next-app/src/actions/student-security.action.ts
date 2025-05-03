"use server";

import {
  getStudentByIdentifierlData,
  UpdateStudentData,
} from "@/data/student-data";
import { currentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/hash-password";
import {
  studentSecurityFormSchema,
  studentSecurityFormType,
} from "@/shema-zod/auth.shema";

export const updateStudentSecurityAction = async (
  values: studentSecurityFormType
) => {
  const valuesValide = studentSecurityFormSchema.safeParse(values);
  if (!valuesValide.success) return { error: "Données non-valide!" };

  const student = await currentUser();
  if (!student || !student.identifier) return { error: "Action non autorisé!" };

  const existingStudent = await getStudentByIdentifierlData(student.identifier);
  if (!existingStudent || !existingStudent.password)
    return { error: "Action non autorisé!" };

  if (values.password && values.newPassword) {
    const veriedPassword = await verifyPassword(
      existingStudent.password,
      values.password
    );
    if (!veriedPassword) return { error: "Mot de passe invalide!" };

    const hashedPassword = await hashPassword(values.newPassword);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await UpdateStudentData(existingStudent.id, values);
  return { success: "Vos infos de sécurité ont bien été mise à jour." };
};
