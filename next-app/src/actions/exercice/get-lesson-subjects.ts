"use server";
import { getALLLessonSubjectswithLabelAndColorOnly } from "@/data/lesson-subject/lesson-subject-data";

export const getLessonSubjects = async () => {
  try {
    return await getALLLessonSubjectswithLabelAndColorOnly();
  } catch (error) {
    throw new Error("Error while getting all lesson subjects");
  }
};
