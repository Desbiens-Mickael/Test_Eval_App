"use server";

import { Exercice } from "@/components/table/exercice-table/exercices-table";
import { getAllExerciceByType } from "@/data/exercice/exercice-data";
import { ExerciceType } from "@prisma/client";

const getAllExercicesByType = async (type: ExerciceType) => {
  try {
    const exercices = await getAllExerciceByType(type);

    const exercicesCard: Exercice[] = exercices.map((exercice) => ({
      id: exercice.id,
      title: exercice.title,
      lesson: exercice.lesson.name,
      level: exercice.level.label,
      subject: exercice.lesson.LessonSubject.label,
    }));

    return exercicesCard;
  } catch (error) {
    console.error(error);
    throw new Error("Error while getting all exercices");
  }
};

export default getAllExercicesByType;
