"use server";

import {
  getGroupGradeReportData,
  getStudentGradeReportData,
} from "@/data/grade-report.data";
import { currentUser } from "@/lib/auth";
import {
  buildGroupGradeReport,
  buildStudentGradeReport,
} from "@/lib/grade-report";

/** Relevé de notes d'un groupe du professeur connecté */
export const getGroupGradeReportAction = async (groupId: string) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") return { error: "Action non autoriser !" };

  try {
    const data = await getGroupGradeReportData(groupId, user.id);
    if (!data) return { error: "Ce groupe n'existe pas !" };
    return { data: buildGroupGradeReport({ ...data, generatedAt: new Date() }) };
  } catch (error) {
    console.error("Error building group grade report:", error);
    return { error: "Une erreur est survenue lors de la préparation du relevé." };
  }
};

/** Relevé de notes d'un élève du professeur connecté */
export const getStudentGradeReportAction = async (studentId: string) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") return { error: "Action non autoriser !" };

  try {
    const data = await getStudentGradeReportData(studentId, user.id);
    if (!data) return { error: "Cet élève n'existe pas !" };
    return { data: buildStudentGradeReport({ ...data, generatedAt: new Date() }) };
  } catch (error) {
    console.error("Error building student grade report:", error);
    return { error: "Une erreur est survenue lors de la préparation du relevé." };
  }
};
