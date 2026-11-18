import { freeResponseResponseType } from "@/shema-zod/exercice-corection.shema";
import { QuestionReview } from "@/shema-zod/exercice-review.shema";
import { Hourglass, MessageSquare } from "lucide-react";

interface ExerciceResultFreeResponseProps {
  /** Les réponses attendues sont absentes tant que la copie n'est pas corrigée */
  content: { question: string; points: number; modelAnswer?: string }[];
  response: freeResponseResponseType;
  pendingReview: boolean;
  questionReviews: QuestionReview[] | null;
}

const formatPoints = (points: number) =>
  points.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

/** Copie « Réponse libre » vue par l'élève : en attente, puis corrigée */
export default function ExerciceResultFreeResponse({
  content,
  response,
  pendingReview,
  questionReviews,
}: ExerciceResultFreeResponseProps) {
  const answers = new Map(
    (Array.isArray(response) ? response : []).map((r) => [r.index, r.answer])
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 sm:px-0">
      {pendingReview && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
          <Hourglass className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p>
            Ta copie est en attente de correction par ton professeur. Tu recevras une
            notification dès qu&apos;elle sera notée.
          </p>
        </div>
      )}

      {content.map((q, index) => {
        const review = pendingReview ? null : questionReviews?.[index];
        const answer = answers.get(index) ?? "";
        return (
          <section
            key={index}
            aria-labelledby={`free-result-${index}`}
            className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id={`free-result-${index}`} className="whitespace-pre-wrap font-medium">
                {index + 1}. {q.question}
              </h3>
              <span className="shrink-0 rounded-full border px-2.5 py-0.5 text-sm tabular-nums">
                {review ? (
                  <>
                    <span className="font-semibold">{formatPoints(review.points)}</span>
                    <span className="text-muted-foreground"> / {q.points}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">{q.points} pt{q.points > 1 ? "s" : ""}</span>
                )}
              </span>
            </div>

            <div>
              <p className="mb-1 text-sm text-muted-foreground">Ta réponse</p>
              <p className="whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-sm">
                {answer || <span className="italic text-muted-foreground">Pas de réponse</span>}
              </p>
            </div>

            {review?.comment && (
              <p className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="whitespace-pre-wrap">
                  <span className="sr-only">Commentaire du professeur : </span>
                  {review.comment}
                </span>
              </p>
            )}

            {!pendingReview && q.modelAnswer && (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Réponse attendue</p>
                <p className="whitespace-pre-wrap text-sm">{q.modelAnswer}</p>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
