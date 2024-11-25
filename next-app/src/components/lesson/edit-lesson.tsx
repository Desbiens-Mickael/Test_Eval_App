"use client";

import useGetLessonBySlug from "@/hooks/queries/lesson/use-get-lesson-by-slug";
import { notFound } from "next/navigation";
import LessonForm from "./form/lesson-form";

interface EditLessonProps {
  slug: string;
}

export default function EditLesson({ slug }: EditLessonProps) {
  const { data, isLoading, isError } = useGetLessonBySlug(slug);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.error) {
    notFound();
  }

  return (
    <div className="w-full">
      <LessonForm
        id={data?.lesson.id}
        title={data?.lesson.title}
        content={data?.lesson.content}
        LessonSubjectID={data?.lesson.LessonSubjectID}
        GradeLevelsID={data?.lesson.GradeLevelsID}
      />
    </div>
  );
}
