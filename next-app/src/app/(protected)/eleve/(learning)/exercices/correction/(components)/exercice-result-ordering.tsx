import { orderingResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentOrderingInput } from "@/shema-zod/exercice.shema";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface ExerciceResultOrderingProps {
  content: contentOrderingInput;
  response: orderingResponseType;
}

/**
 * Correction d'un exercice « Remettre dans l'ordre » : l'ordre de l'élève,
 * chaque élément marqué bien ou mal placé, à côté du bon ordre.
 */
export default function ExerciceResultOrdering({
  content,
  response,
}: ExerciceResultOrderingProps) {
  const orders = new Map(
    (Array.isArray(response) ? response : []).map((r) => [r.index, r.order])
  );

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {content.map((sequence, index) => {
        const order = orders.get(index) ?? [];
        return (
          <section
            key={index}
            className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="font-medium">{sequence.instruction}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Ton ordre</p>
                {order.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune réponse</p>
                ) : (
                  <ol className="space-y-1.5">
                    {order.map((item, rank) => {
                      const isCorrect = item.trim() === sequence.items[rank]?.trim();
                      return (
                        <li
                          key={rank}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                            isCorrect
                              ? "border-success/20 bg-success/10 text-success"
                              : "border-destructive/20 bg-destructive/5 text-destructive"
                          )}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 shrink-0" />
                          )}
                          <span className="sr-only">
                            {isCorrect ? "Bien placé : " : "Mal placé : "}
                          </span>
                          <span>
                            {rank + 1}. {item}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Bon ordre</p>
                <ol className="space-y-1.5">
                  {sequence.items.map((item, rank) => (
                    <li
                      key={rank}
                      className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
                    >
                      {rank + 1}. {item}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
