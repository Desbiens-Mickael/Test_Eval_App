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
        data.map((exercice) => {
          const isActive = !!exercice.groups?.some(
            (group) => group.id === groupId
          );
          return (
            <ExerciceListeItem
              key={exercice.id}
              exerciceId={exercice.id}
              groupId={groupId}
              title={exercice.title}
              description={exercice.description}
              level={exercice.level}
              levelColor={exercice.levelColor}
              type={exercice.type}
              isActive={isActive}
            />
          );
        })
      ) : (
        <div>Aucun exercice trouvé</div>
      )}
    </>
  );
}
