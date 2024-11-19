"use server"

import { createLessonData, getAllLessonBySubjectData } from "@/data/lesson/lesson-data";
import { currentUser } from "@/lib/auth";
import { createLessonSchema } from "@/shema-zod/lesson";
import { Lesson } from "@/type/lesson";
import { z } from "zod";

export const createLessonAction = async (data: z.infer<typeof createLessonSchema>) => {
    const user = await currentUser();
    if (!user || !user.id || user.role !== "ADMIN") return { error: "Action non autoriser !" };

    const isDataValide = createLessonSchema.safeParse(data);
    if (!isDataValide.success) return { error: "Données non valide !" };

    try {
        await createLessonData({...data, authorId: user.id});
        return { success: "La leçon a été créée avec succès." };
    } catch (error) {
        console.error(error);
        return { error: "Une erreur est survenue lors de la création de la leçon." };
    }
}

export const getAllLessonsBySubjectAction = async (subject: string): Promise<Lesson[]> => {
  try {
    const lessonsData = await getAllLessonBySubjectData(subject);

    return lessonsData.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.name,
        subject: lesson.LessonSubject.label,
        subjectColor: lesson.LessonSubject.color,
        gradeLevel: lesson.GradeLevels.label,
        gradeLevelColor: lesson.GradeLevels.color,
      };
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw Error("Échec de la récupération des leçons");
  }
};