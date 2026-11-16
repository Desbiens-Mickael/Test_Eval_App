"use client";

import { badgeItem, container, item } from "@/animations/show-exercise";
import Loader from "@/components/loader";
import { NoteDisplay } from "@/components/note-display";
import PageTitle from "@/components/page-title";
import { useGetStudentExerciceById } from "@/hooks/queries/exercice/use-get-student-exercice-by-id";
import { motion } from "framer-motion";
import ReviewLessonLink from "@/components/lesson/review-lesson-link";
import { FileX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CorrectionByType from "./correction-by-type";
import TeacherFeedback from "./teacher-feedback";
import TeacherReviewPanel from "./teacher-review-panel";

interface ShowCorrectionProps {
  studentExerciceId: string;
  /** "teacher" affiche le panneau de relecture (note ajustée, commentaire) */
  mode?: "student" | "teacher";
}

export default function ShowCorrection({
  studentExerciceId,
  mode = "student",
}: ShowCorrectionProps) {
  const router = useRouter();
  const { data, isLoading, error } = useGetStudentExerciceById({
    studentExerciceId,
  });

  useEffect(() => {
    if (!isLoading && !data) {
      router.replace(mode === "teacher" ? "/admin/eleves" : "/eleve/exercices");
    }
  }, [isLoading, data, router, mode]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return null;
  }

  if (error) {
    throw Error(
      "Une erreur est survenue lors de la recherche de la correction"
    );
  }

  return (
    <>
      <PageTitle title={data?.exercice?.title || "Correction"} />
      {mode === "student" && (
        <div className="px-4 sm:px-6">
          <ReviewLessonLink lesson={data.lesson} className="max-w-full" />
        </div>
      )}
      <motion.div
        className="space-y-4 mb-6 px-4 sm:px-6 py-8"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div
          className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words"
          variants={item}
        >
          {data?.exercice?.description}
        </motion.div>

        <motion.div
          className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3"
          variants={item}
        >
          <motion.div variants={badgeItem}>
            <NoteDisplay
              note={data?.note}
              coeficient={data?.coeficient}
              className="text-2xl font-bold"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {mode === "student" && (
        <TeacherFeedback
          note={data.note}
          autoNote={data.autoNote}
          coeficient={data.coeficient}
          teacherComment={data.teacherComment}
        />
      )}

      {data.isMissing && (
        <div className="mx-4 sm:mx-6 mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <FileX className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
          <p>
            {mode === "teacher"
              ? `${data.student.name} n'a pas rendu ce contrôle avant sa clôture : la copie est notée 0. Vous pouvez ajuster la note ci-dessous (absence justifiée, par exemple).`
              : "Tu n'as pas rendu ce contrôle avant sa clôture : il est noté 0."}
          </p>
        </div>
      )}

      {/* Une copie non rendue n'a pas de réponse à corriger */}
      {data.exercice && !data.isMissing && (
        <CorrectionByType
          type={data.exercice.type.name}
          content={data.exercice.content}
          response={data.response}
        />
      )}

      {mode === "teacher" && (
        <div className="mt-8">
          <TeacherReviewPanel
            studentExerciceId={studentExerciceId}
            studentName={data.student.name}
            note={data.note}
            autoNote={data.autoNote}
            coeficient={data.coeficient}
            teacherComment={data.teacherComment}
            reviewedAt={data.reviewedAt}
          />
        </div>
      )}
    </>
  );
}
