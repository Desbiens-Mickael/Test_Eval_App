"use server";

import { getAllExerciceByType } from "@/data/exercice/exercice-data";
import { Exercice } from "@/type/exercice";
import { ExerciceType } from "@prisma/client";

const getAllExercicesByType = async (type: ExerciceType): Promise<Exercice[]> => {
  try {
    const exercicesData = await getAllExerciceByType(type);

    const exercices: Exercice[] = exercicesData.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      lesson: exercice.lesson.name,
      level: exercice.level.label,
      levelColor: exercice.level.color,
      subject: exercice.lesson.LessonSubject.label,
      subjectColor: exercice.lesson.LessonSubject.color,
    }));

    return exercices;
  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw Error("Échec de la récupération des exercices");
  }
};

export default getAllExercicesByType;
