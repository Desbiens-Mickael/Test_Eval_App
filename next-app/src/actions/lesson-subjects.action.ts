"use server";
import { getALLLessonSubjectswithLabelAndColorOnlyData } from "@/data/lesson-subject/lesson-subject-data";

export const getAllLessonsSubjectsAction = async () => {
  try {
    return await getALLLessonSubjectswithLabelAndColorOnlyData();
  } catch (error) {
    throw new Error("Error while getting all lesson subjects");
  }
};
