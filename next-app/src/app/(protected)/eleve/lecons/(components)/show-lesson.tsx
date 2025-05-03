"use client";

import LessonContent from "@/components/lesson/lesson-content";
import Loader from "@/components/loader";
import useGetLessonByIdForStudent from "@/hooks/queries/lesson/use-get-lesson-by-Id-for-student";
interface ShowLessonProps {
  id: string;
}

export default function ShowLesson({ id }: ShowLessonProps) {
  const { data: lesson, isLoading } = useGetLessonByIdForStudent(id);

  if (isLoading) {
    return <Loader />;
  }

  return <LessonContent content={lesson?.lesson.content} />;
}
