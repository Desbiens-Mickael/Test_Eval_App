"use client";

import BackButton from "@/components/back-button";
import LessonContent from "@/components/lesson/lesson-content";
import { Skeleton } from "@/components/ui/skeleton";
import useGetLessonByIdForStudent from "@/hooks/queries/lesson/use-get-lesson-by-Id-for-student";
import { notFound } from "next/navigation";

interface ShowLessonProps {
  id: string;
}

export default function ShowLesson({ id }: ShowLessonProps) {
  const { data: lesson, isLoading, isError } = useGetLessonByIdForStudent(id);

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8 space-y-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <div className="space-y-4 pt-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    notFound();
  }

  console.log(lesson);
  return (
    <div className="container max-w-5xl py-8">
      <BackButton text="Retour aux leçons" />

      <LessonContent
        content={lesson.content}
        title={lesson.title}
        subject={lesson.LessonSubject.label}
        subjectColor={lesson.LessonSubject.color}
        gradeLevel={lesson.GradeLevels.label}
        gradeLevelColor={lesson.GradeLevels.color}
        imageBanner={lesson.imageBanner}
      />
    </div>
  );
}
