"use client";

import { getStudentPracticeTrackingAction } from "@/actions/practice-tracking.action";
import EmptyChart from "@/components/charts/empty-chart";
import LineChart from "@/components/charts/line-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackedPractice } from "@/lib/practice-tracking";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";

const percent = (value: number | null) => (value === null ? "—" : `${value} %`);

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});
const shortDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});

const STATUS = {
  "not-started": { label: "Pas commencé", icon: Circle, className: "text-muted-foreground" },
  "in-progress": { label: "En cours", icon: CircleDot, className: "text-sky-700 dark:text-sky-300" },
  "correction-seen": {
    label: "Correction vue",
    icon: CheckCircle2,
    className: "text-green-700 dark:text-green-400",
  },
} as const;

/**
 * Suivi des exercices (non notés) d'un élève : pour chacun, la courbe de
 * ses essais, le nombre d'essais et s'il a vu la correction.
 */
export default function PracticeTrackingSection({ studentId }: { studentId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["practice-tracking", studentId],
    queryFn: async () => {
      const response = await getStudentPracticeTrackingAction(studentId);
      return response.data;
    },
  });

  return (
    <section className="viz flex flex-col gap-4" aria-labelledby="practice-tracking-title">
      <div>
        <h2 id="practice-tracking-title" className="text-2xl font-bold">
          Suivi des exercices
        </h2>
        <p className="text-muted-foreground">
          Exercices non notés : chaque essai de l&apos;élève, de son premier à son dernier.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : !data || data.exercises.length === 0 ? (
        <EmptyChart message="Aucun exercice non noté n'est attribué au groupe de cet élève." />
      ) : (
        <>
          <p className="text-sm">
            <strong>{data.summary.started}</strong> exercice{data.summary.started > 1 ? "s" : ""}{" "}
            commencé{data.summary.started > 1 ? "s" : ""} sur {data.summary.assigned} ·{" "}
            <strong>{data.summary.totalAttempts}</strong> essai
            {data.summary.totalAttempts > 1 ? "s" : ""} au total ·{" "}
            <strong>{data.summary.finished}</strong> correction
            {data.summary.finished > 1 ? "s" : ""} vue{data.summary.finished > 1 ? "s" : ""}
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {data.exercises.map((exercise) => (
              <PracticeCard key={exercise.id} exercise={exercise} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function PracticeCard({ exercise }: { exercise: TrackedPractice }) {
  const status = STATUS[exercise.status];
  const StatusIcon = status.icon;

  return (
    <li className="flex flex-col rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight">{exercise.title}</h3>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn("h-2 w-2 shrink-0 rounded-full", exercise.subjectColor ?? "bg-muted-foreground")}
              aria-hidden="true"
            />
            {exercise.subject} · {exercise.type}
          </p>
        </div>
        <span className={cn("inline-flex shrink-0 items-center gap-1 text-xs font-medium", status.className)}>
          <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {status.label}
        </span>
      </header>

      {exercise.attempts.length === 0 ? (
        <p className="flex h-[160px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Aucun essai pour l&apos;instant.
        </p>
      ) : (
        <LineChart
          data={exercise.attempts.map((a) => ({
            key: String(a.n),
            label: `Essai ${a.n}`,
            value: a.percent,
            details: [dateFormat.format(new Date(a.createdAt))],
          }))}
          formatValue={(v) => `${v} %`}
          ariaLabel={`Réussite à chaque essai de l'exercice ${exercise.title}`}
        />
      )}

      <dl className="mt-4 grid grid-cols-4 gap-2 border-t pt-3 text-center text-xs">
        <Stat label="Essais" value={String(exercise.attempts.length)} />
        <Stat label="Dernier" value={percent(exercise.lastPercent)} />
        <Stat label="Meilleur" value={percent(exercise.bestPercent)} />
        <Stat
          label="Progression"
          value={
            exercise.progress === null
              ? "—"
              : `${exercise.progress > 0 ? "+" : exercise.progress < 0 ? "−" : ""}${Math.abs(exercise.progress)} pts`
          }
          tone={
            exercise.progress === null || exercise.progress === 0
              ? undefined
              : exercise.progress > 0
                ? "var(--viz-delta-up)"
                : "var(--viz-delta-down)"
          }
        />
      </dl>
      {exercise.correctionSeenAt && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Correction vue le {shortDate.format(new Date(exercise.correctionSeenAt))} : plus d&apos;essai possible.
        </p>
      )}
    </li>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold tabular-nums" style={tone ? { color: tone } : undefined}>
        {value}
      </dd>
    </div>
  );
}
