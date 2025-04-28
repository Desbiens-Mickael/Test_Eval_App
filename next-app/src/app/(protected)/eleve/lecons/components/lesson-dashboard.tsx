"use client";

import useGetAllLessonsForStudent from "@/hooks/queries/lesson/use-get-all-lessons-for-student";
import LessonDashboardItem from "./lesson-dashboard-item";

export default function LessonDashboard() {
  const { data, isLoading, isError } = useGetAllLessonsForStudent();

  if (isLoading) return <div>Chargement...</div>;
  if (isError) return <div>Erreur</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.map((lesson) => (
        <LessonDashboardItem
          key={lesson.id}
          lessonTitle={lesson.title}
          lessonId={lesson.id}
        />
      ))}
    </div>
  );
}
