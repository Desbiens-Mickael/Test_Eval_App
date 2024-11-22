"use server"

import { createLessonData, getAllLessonBySubjectData } from "@/data/lesson/lesson-data";
import { currentUser } from "@/lib/auth";
import { createLessonSchema } from "@/shema-zod/lesson";
import { Lesson } from "@/type/lesson";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Création d'une nouvelle leçon
export const createLessonAction = async (data: z.infer<typeof createLessonSchema>) => {
    const user = await currentUser();
    if (!user || !user.id || user.role !== "ADMIN") return { error: "Action non autoriser !" };

    const isDataValide = createLessonSchema.safeParse(data);
    if (!isDataValide.success) return { error: "Données non valide !" };

    try {
        const lesson = await createLessonData({...data, authorId: user.id});
        return { success: "La leçon a été créée avec succès.", data: lesson };
    } catch (err) {
      console.error(err);
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return { error: "Une leçon avec ce titre existe deja !" };
      }
        return { error: "Une erreur est survenue lors de la création de la leçon." };
    }
}

// Récupérer toutes les leçons selon leur sujet
export const getAllLessonsBySubjectAction = async (subject: string): Promise<Lesson[]> => {
  try {
    const lessonsData = await getAllLessonBySubjectData(subject);

    return lessonsData.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.title,
        slug: lesson.slug,
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