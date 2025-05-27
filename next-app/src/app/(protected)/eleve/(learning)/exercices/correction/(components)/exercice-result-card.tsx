import { cn } from "@/lib/utils";
import { cardResponseItemType } from "@/shema-zod/exercice-corection.shema";
import { contentCardInput } from "@/shema-zod/exercice.shema";
import { ArrowRight, Check, X } from "lucide-react";

interface ExerciceResultCardProps {
  content: contentCardInput;
  response: cardResponseItemType[];
}

export default function ExerciceResultCard({
  content,
  response,
}: ExerciceResultCardProps) {
  return (
    <div className="md:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {response.map((col) => (
          <div
            key={col.column}
            className="bg-card rounded-xl shadow-sm overflow-hidden border"
          >
            <div
              className={cn(
                "px-4 py-3 border-b",
                "bg-gradient-to-r from-primary/5 to-primary/10",
                "dark:bg-gradient-to-r dark:from-accent/20 dark:to-accent/90",
                "border-border/50"
              )}
            >
              <h3 className="font-bold text-foreground">{col.column}</h3>
            </div>
            <div className="p-4 space-y-3 bg-card">
              {col.cards.map((card) => {
                const correctColumn = content.find((contentCol) =>
                  contentCol.cards.some(
                    (contentCard) => contentCard.id === card.id
                  )
                );
                const isCorrect = correctColumn?.column === col.column;

                return (
                  <div
                    key={card.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 shadow-sm",
                      isCorrect
                        ? "bg-success/10 border-success/40 hover:bg-success/30 hover:shadow-success/20 hover:shadow-sm"
                        : "bg-destructive/20 border-destructive/40 hover:bg-destructive/30 hover:shadow-destructive/20 hover:shadow-sm"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-sm",
                        isCorrect
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {isCorrect ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        <X className="w-4 h-4" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-grow flex justify-between items-center">
                      <span
                        className={cn(
                          "flex-grow",
                          isCorrect ? "text-success" : "text-destructive"
                        )}
                      >
                        {card.content}
                      </span>
                      {!isCorrect && correctColumn && (
                        <div className="flex items-center gap-1.5">
                          <ArrowRight className="w-4 h-4 text-destructive" />
                          <span className="text-destructive-foreground font-medium px-3 py-1 rounded-md bg-destructive text-sm shadow-sm border border-destructive/20">
                            {correctColumn.column}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
