import { MessageSquareText } from "lucide-react";

interface TeacherFeedbackProps {
  note: number;
  autoNote: number | null;
  coeficient: number;
  teacherComment: string | null;
}

/** Ce que l'élève voit de la relecture : le mot du professeur et la note ajustée */
export default function TeacherFeedback({
  note,
  autoNote,
  coeficient,
  teacherComment,
}: TeacherFeedbackProps) {
  const isAdjusted = autoNote !== null && autoNote !== note;
  if (!teacherComment && !isAdjusted) return null;

  return (
    <section
      aria-labelledby="teacher-feedback-title"
      className="mx-4 mb-8 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:mx-6"
    >
      <h2
        id="teacher-feedback-title"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <MessageSquareText className="h-5 w-5 text-primary" aria-hidden="true" />
        Le mot de ton professeur
      </h2>
      {teacherComment && (
        <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">
          {teacherComment}
        </p>
      )}
      {isAdjusted && (
        <p className="mt-3 text-sm text-muted-foreground">
          Ton professeur a ajusté ta note : {note}/{coeficient} (au lieu de{" "}
          {autoNote}/{coeficient}).
        </p>
      )}
    </section>
  );
}
