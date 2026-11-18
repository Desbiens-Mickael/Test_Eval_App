import ChartCard from "@/components/charts/chart-card";
import EmptyChart from "@/components/charts/empty-chart";
import { StudentProgress } from "@/lib/student-progress";
import { cn } from "@/lib/utils";
import { formatRate, rateTone } from "./format";

/** Réussite par matière : barre sur l'échelle 0–100 %, valeur au bout */
export default function SubjectProgress({
  bySubject,
  forParent = false,
}: {
  bySubject: StudentProgress["bySubject"];
  /** Textes pour un parent (pas de tutoiement) */
  forParent?: boolean;
}) {
  return (
    <ChartCard
      title="Réussite par matière"
      description={
        forParent
          ? "Moyenne des contrôles dans chaque matière"
          : "Moyenne de tes contrôles dans chaque matière"
      }
      className="h-full"
      table={{
        headers: ["Matière", "Réussite", "Meilleur résultat", "Contrôles faits", "Attribués faits"],
        rows: bySubject.map((s) => [
          s.subject,
          formatRate(s.successRate),
          formatRate(s.best),
          s.done,
          s.assigned > 0 ? `${s.assignedDone} / ${s.assigned}` : "—",
        ]),
      }}
    >
      {bySubject.length === 0 ? (
        <EmptyChart message="Aucune matière pour l'instant." />
      ) : (
        <ul className="space-y-5" aria-label="Réussite par matière">
          {bySubject.map((s) => (
            <li key={s.subject} className="group">
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={cn("h-2.5 w-2.5 shrink-0 rounded-full", s.color ?? "bg-muted-foreground")}
                    aria-hidden="true"
                  />
                  {s.subject}
                </span>
                <span className="text-xs text-muted-foreground">
                  {s.done === 0
                    ? "pas encore commencé"
                    : `${s.done} contrôle${s.done > 1 ? "s" : ""} · meilleur ${formatRate(s.best)}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-4 flex-1">
                  <div className="absolute inset-y-0 left-0 w-px" style={{ background: "var(--viz-axis)" }} />
                  <div className="absolute inset-y-0 left-1/2 w-px" style={{ background: "var(--viz-grid)" }} />
                  <div
                    className="relative h-full rounded-r-[4px] transition-colors group-hover:[background:var(--viz-series-hover)]"
                    style={{ width: `${s.successRate ?? 0}%`, background: "var(--viz-series)" }}
                  />
                </div>
                <span className={cn("w-14 text-right text-sm font-semibold tabular-nums", rateTone(s.successRate))}>
                  {formatRate(s.successRate)}
                </span>
              </div>
              {s.assigned > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {s.assignedDone} contrôle{s.assignedDone > 1 ? "s" : ""} attribué
                  {s.assignedDone > 1 ? "s" : ""} fait{s.assignedDone > 1 ? "s" : ""} sur {s.assigned}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
