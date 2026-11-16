import type { ExerciceOutput } from "@/data/exercice/exercice-data";
import { stripExerciceSolutions } from "@/lib/exercice-grading";
import { Exercice } from "@/type/exercice";

/**
 * Exercice tel qu'il est envoyé au navigateur.
 * Pour un élève (`withSolutions: false`), les solutions sont retirées.
 */
export const formatExercice = (
  exercice: ExerciceOutput,
  { withSolutions }: { withSolutions: boolean }
): Exercice => {
  const { content, cards } = withSolutions
    ? { content: exercice.content, cards: undefined }
    : stripExerciceSolutions(exercice.type.name, exercice.content);

  return {
    id: exercice.id,
    title: exercice.title,
    kind: exercice.kind,
    description: exercice.description,
    content,
    cards,
    lesson: exercice.lesson.title,
    levelId: exercice.level.id,
    level: exercice.level.label,
    levelColor: exercice.level.color,
    subject: exercice.lesson.LessonSubject.label,
    subjectColor: exercice.lesson.LessonSubject.color,
    typeId: exercice.type.id,
    type: exercice.type.name,
  };
};
