"use client";

import SubmitButton from "@/components/form/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewFreeResponse } from "@/hooks/mutations/exercice/use-review-free-response";
import { freeResponseResponseType } from "@/shema-zod/exercice-corection.shema";
import {
  FreeResponseReviewInput,
  QUESTION_COMMENT_MAX_LENGTH,
  QuestionReview,
  TEACHER_COMMENT_MAX_LENGTH,
  buildFreeResponseReviewSchema,
  freeResponseNote,
} from "@/shema-zod/exercice-review.shema";
import { contentFreeResponseInput } from "@/shema-zod/exercice.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hourglass, PenLine } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface FreeResponseReviewPanelProps {
  studentExerciceId: string;
  studentName: string;
  content: contentFreeResponseInput;
  response: freeResponseResponseType;
  coeficient: number;
  pendingReview: boolean;
  questionReviews: QuestionReview[] | null;
  teacherComment: string | null;
}

const defaultValues = (
  content: contentFreeResponseInput,
  questionReviews: QuestionReview[] | null,
  teacherComment: string | null
): FreeResponseReviewInput => ({
  reviews: content.map((_, i) => ({
    points: questionReviews?.[i]?.points ?? (undefined as unknown as number),
    comment: questionReviews?.[i]?.comment ?? "",
  })),
  comment: teacherComment ?? "",
});

/**
 * Correction d'une copie « Réponse libre » par le professeur :
 * des points (par quart de point) et un commentaire par question,
 * plus un commentaire général. La note se calcule au fil de la saisie.
 */
export default function FreeResponseReviewPanel({
  studentExerciceId,
  studentName,
  content,
  response,
  coeficient,
  pendingReview,
  questionReviews,
  teacherComment,
}: FreeResponseReviewPanelProps) {
  const { mutateAsync, isPending } = useReviewFreeResponse(studentExerciceId);
  const maxPoints = useMemo(() => content.map((q) => q.points), [content]);
  const schema = useMemo(() => buildFreeResponseReviewSchema(maxPoints), [maxPoints]);
  const answers = new Map(
    (Array.isArray(response) ? response : []).map((r) => [r.index, r.answer])
  );

  const form = useForm<FreeResponseReviewInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(content, questionReviews, teacherComment),
  });

  // Après enregistrement, le formulaire repart des valeurs sauvegardées
  useEffect(() => {
    form.reset(defaultValues(content, questionReviews, teacherComment));
  }, [content, questionReviews, teacherComment, form]);

  const reviews = form.watch("reviews");
  const allGraded = reviews.every((r) => Number.isFinite(Number(r.points)) && `${r.points}` !== "");
  const liveNote = allGraded
    ? freeResponseNote(
        reviews.map((r) => ({ points: Number(r.points) })),
        maxPoints,
        coeficient
      )
    : null;
  const totalPoints = maxPoints.reduce((sum, p) => sum + p, 0);
  const obtained = reviews.reduce((sum, r) => sum + (Number(r.points) || 0), 0);

  return (
    <section aria-labelledby="free-review-title" className="mx-4 mb-8 space-y-4 sm:mx-6">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 id="free-review-title" className="flex items-center gap-2 text-lg font-semibold">
          <PenLine className="h-5 w-5 text-primary" aria-hidden="true" />
          Correction de la copie
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Donnez des points à chaque réponse de {studentName} (par quart de point) et ajoutez
          un commentaire si besoin. La note est ramenée sur {coeficient}.
        </p>
        {pendingReview && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Hourglass className="h-4 w-4" aria-hidden="true" />
            Copie à corriger : elle ne compte pas encore dans les moyennes.
          </p>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => mutateAsync(values))}
          noValidate
          className="space-y-4"
        >
          {content.map((q, index) => (
            <fieldset
              key={index}
              className="space-y-4 rounded-xl border bg-card p-5 shadow-sm"
            >
              <legend className="sr-only">Question {index + 1}</legend>
              <p className="whitespace-pre-wrap font-medium">
                {index + 1}. {q.question}
              </p>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Réponse de l&apos;élève</p>
                <p className="whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-sm">
                  {answers.get(index) || (
                    <span className="italic text-muted-foreground">Pas de réponse</span>
                  )}
                </p>
              </div>

              {q.modelAnswer && (
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Réponse attendue</p>
                  <p className="whitespace-pre-wrap text-sm">{q.modelAnswer}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name={`reviews.${index}.points`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          inputMode="decimal"
                          step={0.25}
                          min={0}
                          max={q.points}
                          className="w-24 text-right font-semibold tabular-nums"
                        />
                      </FormControl>
                      <span className="text-muted-foreground">/ {q.points}</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`reviews.${index}.comment`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commentaire sur cette réponse (facultatif)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={2} maxLength={QUESTION_COMMENT_MAX_LENGTH} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          ))}

          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaire général pour l&apos;élève (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} maxLength={TEACHER_COMMENT_MAX_LENGTH} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm" aria-live="polite">
                {liveNote === null ? (
                  <span className="text-muted-foreground">
                    Notez chaque question pour calculer la note.
                  </span>
                ) : (
                  <>
                    {obtained.toLocaleString("fr-FR")} / {totalPoints} points, soit{" "}
                    <span className="text-lg font-semibold tabular-nums">
                      {liveNote.toLocaleString("fr-FR")}
                    </span>{" "}
                    / {coeficient}
                  </>
                )}
              </p>
              <SubmitButton
                texte={pendingReview ? "Enregistrer la correction" : "Modifier la correction"}
                isLoading={isPending}
              />
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
