import { cn } from "@/lib/utils";
import { multipleChoiceInput } from "@/shema-zod/exercice.shema";
import { Check, X } from "lucide-react";

interface ShowPReviewMUltipleChoiceProps {
  content: multipleChoiceInput[];
}

export default function ShowPReviewMUltipleChoice({
  content,
}: ShowPReviewMUltipleChoiceProps) {
  if (content.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune question à afficher
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {content.map((question, index) => (
        <div key={index} className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-lg font-medium leading-none">
              {question.question || "Question sans titre"}
            </h4>
            <p className="text-sm text-muted-foreground">
              Sélectionnez la ou les bonnes réponses
            </p>
          </div>
          
          <div className="space-y-2">
            {question.answers.map((answer, answerIndex) => {
              const isCorrect = answer.isCorrect;
              return (
                <div
                  key={answerIndex}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-colors",
                    isCorrect 
                      ? "bg-green-50 border-green-200" 
                      : "bg-muted/30 border-border"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium",
                    isCorrect 
                      ? "bg-green-100 text-green-600 border border-green-200"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {String.fromCharCode(65 + answerIndex)}
                  </div>
                  
                  <span className={cn(
                    "flex-1 text-base",
                    isCorrect ? "font-medium text-foreground" : "text-muted-foreground"
                  )}>
                    {answer.answer || "(Réponse vide)"}
                  </span>
                  
                  {isCorrect ? (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Bonne réponse</span>
                    </div>
                  ) : (
                    <div className="h-4 w-4 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
