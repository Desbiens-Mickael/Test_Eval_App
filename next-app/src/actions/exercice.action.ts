"use server";

import { getAllExercicesByTypeData } from "@/data/exercice/exercice-data";
import { getExerciceTypeByNameData } from "@/data/exercice/exercice-type.data";
import { Exercice, ExerciceType } from "@/type/exercice";

export const getAllExercicesByTypeAction = async (
  type: ExerciceType
): Promise<Exercice[]> => {
  try {
    // Recherche du type d'exercice par son nom
    const exerciceType = await getExerciceTypeByNameData(type);
    if (!exerciceType) {
      throw new Error(`Type d'exercice ${type} non trouvé`);
    }

    // Récupération des exercices selon leur type
    const exercicesData = await getAllExercicesByTypeData(exerciceType);

    // Formatage des exercices
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
