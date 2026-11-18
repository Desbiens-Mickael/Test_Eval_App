import { matchingPairsResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentMatchingPairsInput } from "@/shema-zod/exercice.shema";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExerciceResultMatchingPairsProps {
  content: contentMatchingPairsInput;
  response: matchingPairsResponseType;
}

/** Correction d'un exercice « Associer par paires » */
export default function ExerciceResultMatchingPairs({
  content,
  response,
}: ExerciceResultMatchingPairsProps) {
  const answers = new Map(
    (Array.isArray(response) ? response : []).map((r) => [r.index, r.answer])
  );

  return (
    <ul className="mx-auto w-full max-w-2xl space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
      {content.map((pair, index) => {
        const answer = answers.get(index) ?? "";
        const isCorrect = answer.trim() === pair.right.trim();
        return (
          <li
            key={index}
            className="space-y-2 rounded-xl border border-border bg-muted/30 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-medium">{pair.left}</span>
              <span
                className={cn(
                  "flex shrink-0 items-center gap-1.5 text-sm font-medium",
                  isCorrect ? "text-success" : "text-destructive"
                )}
              >
                {isCorrect ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {isCorrect ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="text-sm">
              <span className="text-muted-foreground">Ta réponse : </span>
              <span
                className={cn(
                  "font-medium",
                  isCorrect ? "text-success" : "text-destructive line-through"
                )}
              >
                {answer || "aucune"}
              </span>
            </p>
            {!isCorrect && (
              <p className="text-sm">
                <span className="text-muted-foreground">Bonne réponse : </span>
                <span className="font-medium text-foreground">{pair.right}</span>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
