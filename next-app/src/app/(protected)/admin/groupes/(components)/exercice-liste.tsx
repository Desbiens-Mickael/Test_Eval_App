"use client";

import useGetAllExercicesByLessonId from "@/hooks/queries/exercice/use-get-all-lessons-by-lessonId";
import ExerciceListeItem from "./exercice-liste-item";

interface ExerciceListeProps {
  groupId: string;
  lessonId: string;
}

export default function ExerciceListe({
  groupId,
  lessonId,
}: ExerciceListeProps) {
  const { data, isLoading, error } = useGetAllExercicesByLessonId(lessonId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {data && data.length > 0 ? (
        data.map((exercice) => (
          <ExerciceListeItem
            key={exercice.id}
            id={exercice.id}
            title={exercice.title}
            description={exercice.description}
            level={exercice.level}
            levelColor={exercice.levelColor}
            type={exercice.type}
            isActive={true}
          />
        ))
      ) : (
        <div>Aucun exercice trouvé</div>
      )}
    </>
  );
}
