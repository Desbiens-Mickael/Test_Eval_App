import { StudentProgress } from "@/lib/student-progress";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatRate, rateTone } from "./format";

export default function ProgressSummary({ progress }: { progress: StudentProgress }) {
  const { summary, badges } = progress;
  const earned = badges.filter((b) => b.earnedAt).length;
  const completion =
    summary.completionRate === null ? null : Math.round(summary.completionRate * 100);
  const delta =
    summary.recentRate !== null && summary.previousRate !== null
      ? summary.recentRate - summary.previousRate
      : null;

  return (
    <div className="viz grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Réussite moyenne</h2>
        <p className={cn("mt-3 text-5xl font-semibold tracking-tight", rateTone(summary.successRate))}>
          {formatRate(summary.successRate)}
        </p>
        <Meter value={summary.successRate} label="Réussite moyenne" />
      </section>

      <section className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Contrôles à faire</h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {summary.assigned > 0 ? `${summary.assignedDone} / ${summary.assigned}` : "—"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.assigned === 0
            ? "Aucun contrôle attribué pour l'instant"
            : summary.assignedDone === summary.assigned
              ? "Tout est fait, bravo !"
              : `Encore ${summary.assigned - summary.assignedDone} à faire`}
        </p>
        <Meter value={completion} label="Contrôles attribués faits" />
      </section>

      <section className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Mes 5 derniers contrôles</h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight">
          {formatRate(summary.recentRate)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          {delta === null ? (
            "Fais encore quelques contrôles pour voir ta tendance"
          ) : (
            <>
              <Trend delta={delta} />
              <span>par rapport aux 5 d&apos;avant</span>
            </>
          )}
        </p>
      </section>

      <section className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium text-muted-foreground">Badges</h2>
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          {earned} / {badges.length}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {summary.perfect > 0
            ? `${summary.perfect} contrôle${summary.perfect > 1 ? "s" : ""} réussi${summary.perfect > 1 ? "s" : ""} à 100 %`
            : "Vise un 100 % pour un nouveau badge"}
        </p>
      </section>
    </div>
  );
}

function Meter({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="mt-auto pt-4">
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: "var(--viz-track)" }}
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ?? 0}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${value ?? 0}%`, background: "var(--viz-series)" }}
        />
      </div>
    </div>
  );
}

function Trend({ delta }: { delta: number }) {
  const Icon = delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus;
  return (
    <span
      className="inline-flex items-center gap-0.5 font-medium tabular-nums"
      style={{
        color:
          delta > 0 ? "var(--viz-delta-up)" : delta < 0 ? "var(--viz-delta-down)" : undefined,
      }}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {delta > 0 ? "+" : delta < 0 ? "−" : ""}
      {Math.abs(delta)} pt{Math.abs(delta) > 1 ? "s" : ""}
    </span>
  );
}
