"use server";

import { getAllExercicesByTypeData } from "@/data/exercice/exercice-data";
import { Exercice } from "@/type/exercice";
import { ExerciceType } from "@prisma/client";

export const getAllExercicesByTypeAction = async (type: ExerciceType): Promise<Exercice[]> => {
  try {
    const exercicesData = await getAllExercicesByTypeData(type);

    return exercicesData.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      lesson: exercice.lesson.title,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
    }));
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw Error("Échec de la récupération des exercices");
  }
};
