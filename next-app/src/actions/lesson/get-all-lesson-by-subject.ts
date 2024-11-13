"use server";

import { getAllLessonBySubject } from "@/data/lesson/lesson-data";
import { Lesson } from "@/type/lesson";

export const getAllLessonsBySubject = async (subject: string): Promise<Lesson[]> => {
  try {
    const lessonsData = await getAllLessonBySubject(subject);

    return lessonsData.map((lesson) => {
      return {
        id: lesson.id,
        title: lesson.name,
        subject: lesson.LessonSubject.label,
        subjectColor: lesson.LessonSubject.color,
      };
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw Error("Échec de la récupération des leçons");
  }
};
