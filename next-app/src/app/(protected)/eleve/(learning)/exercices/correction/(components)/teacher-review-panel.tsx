"use client";

import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewStudentExercice } from "@/hooks/mutations/exercice/use-review-student-exercice";
import {
  ExerciceReviewInput,
  TEACHER_COMMENT_MAX_LENGTH,
  buildExerciceReviewSchema,
} from "@/shema-zod/exercice-review.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine, RotateCcw } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface TeacherReviewPanelProps {
  studentExerciceId: string;
  studentName: string;
  note: number;
  autoNote: number | null;
  coeficient: number;
  teacherComment: string | null;
  reviewedAt: Date | null;
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

/** Panneau du professeur : ajuster la note et laisser un commentaire à l'élève */
export default function TeacherReviewPanel({
  studentExerciceId,
  studentName,
  note,
  autoNote,
  coeficient,
  teacherComment,
  reviewedAt,
}: TeacherReviewPanelProps) {
  const { mutateAsync, isPending } = useReviewStudentExercice(studentExerciceId);
  const originalNote = autoNote ?? note;
  const schema = useMemo(() => buildExerciceReviewSchema(coeficient), [coeficient]);

  const form = useForm<ExerciceReviewInput>({
    resolver: zodResolver(schema),
    defaultValues: { note, comment: teacherComment ?? "" },
  });

  // Après enregistrement, le formulaire repart des valeurs sauvegardées
  useEffect(() => {
    form.reset({ note, comment: teacherComment ?? "" });
  }, [note, teacherComment, form]);

  const comment = form.watch("comment") ?? "";
  const currentNote = Number(form.watch("note"));
  const isAdjusted = autoNote !== null && autoNote !== note;

  const onSubmit = async (values: ExerciceReviewInput) => {
    await mutateAsync(values);
  };

  return (
    <section
      aria-labelledby="teacher-review-title"
      className="mx-4 mb-8 rounded-xl border bg-card p-5 shadow-sm sm:mx-6"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="teacher-review-title" className="flex items-center gap-2 text-lg font-semibold">
            <PenLine className="h-5 w-5 text-primary" aria-hidden="true" />
            Votre relecture
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajustez la note si besoin et laissez un mot à {studentName}. L&apos;élève
            sera prévenu par une notification.
          </p>
        </div>
        {reviewedAt && (
          <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            Relue le {dateFormat.format(new Date(reviewedAt))}
          </span>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        inputMode="decimal"
                        step={0.25}
                        min={0}
                        max={coeficient}
                        className="w-24 text-right text-lg font-semibold tabular-nums"
                      />
                    </FormControl>
                    <span className="text-lg text-muted-foreground">/ {coeficient}</span>
                  </div>
                  {currentNote !== originalNote && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        form.setValue("note", originalNote, { shouldDirty: true, shouldValidate: true })
                      }
                    >
                      <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                      Revenir à la note automatique
                    </Button>
                  )}
                </div>
                <FormDescription>
                  Note automatique : {originalNote}/{coeficient}
                  {isAdjusted && " — la note actuelle a été ajustée"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaire pour l&apos;élève</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    maxLength={TEACHER_COMMENT_MAX_LENGTH}
                    placeholder="Ex. : Très bon travail ! Relis la règle du participe passé avec avoir."
                  />
                </FormControl>
                <div className="flex justify-between gap-2">
                  <FormMessage />
                  <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                    {comment.length} / {TEACHER_COMMENT_MAX_LENGTH}
                  </span>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <SubmitButton
              texte="Enregistrer la relecture"
              loadindText="Enregistrement..."
              isLoading={isPending}
              disabled={!form.formState.isDirty}
              className="w-auto text-base"
            />
          </div>
        </form>
      </Form>
    </section>
  );
}
