import { DashboardPeriod, TeacherDashboard } from "@/lib/teacher-dashboard";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import {
  PREVIOUS_PERIOD_LABELS,
  formatInteger,
  formatPercent,
  formatScore,
  formatSigned,
} from "./format";

interface SummaryCardsProps {
  summary: TeacherDashboard["summary"];
  weeklyTrend: TeacherDashboard["weeklyTrend"];
  period: DashboardPeriod;
}

export default function SummaryCards({ summary, weeklyTrend, period }: SummaryCardsProps) {
  const comparison = PREVIOUS_PERIOD_LABELS[period];
  const averageDelta =
    summary.average !== null && summary.previousAverage !== null
      ? summary.average - summary.previousAverage
      : null;
  const submissionDelta =
    summary.previousSubmissions !== null
      ? summary.submissions - summary.previousSubmissions
      : null;

  return (
    <div className="viz grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Chiffre principal : un seul par vue */}
      <section className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm md:col-span-2 xl:col-span-1">
        <h2 className="text-sm font-medium text-muted-foreground">Moyenne générale</h2>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-5xl font-semibold tracking-tight">
            {formatScore(summary.average)}
          </span>
          <span className="text-lg text-muted-foreground">/20</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 text-sm">
          {averageDelta !== null ? (
            <>
              <Delta value={averageDelta} suffix=" pt" />
              <span className="text-muted-foreground">{comparison}</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              {summary.average === null
                ? "Aucune copie sur la période"
                : "Toutes les copies rendues"}
            </span>
          )}
        </div>
        <ScoreMeter value={summary.average} />
      </section>

      <StatTile
        label="Copies rendues"
        value={formatInteger(summary.submissions)}
        footer={
          submissionDelta !== null ? (
            <>
              <Delta value={submissionDelta} />
              <span className="text-muted-foreground">{comparison}</span>
            </>
          ) : (
            <span className="text-muted-foreground">sur toute la période</span>
          )
        }
        trend={weeklyTrend.map((w) => w.count)}
        trendLabel="Copies par semaine, 12 dernières semaines"
      />

      <StatTile
        label="Taux de complétion"
        value={formatPercent(summary.completionRate)}
        footer={
          <span className="text-muted-foreground">
            {summary.assigned > 0
              ? `${formatInteger(summary.done)} exercices faits sur ${formatInteger(summary.assigned)} attribués`
              : "Aucun exercice attribué à un groupe"}
          </span>
        }
        meter={summary.completionRate}
      />

      <StatTile
        label="Élèves actifs"
        value={
          <>
            {formatInteger(summary.activeStudents)}
            <span className="text-lg font-normal text-muted-foreground">
              {" "}
              / {formatInteger(summary.totalStudents)}
            </span>
          </>
        }
        footer={
          <span className="text-muted-foreground">
            {summary.studentsToHelp > 0
              ? `${summary.studentsToHelp} à accompagner`
              : "Aucun élève en difficulté"}
          </span>
        }
        meter={
          summary.totalStudents > 0
            ? summary.activeStudents / summary.totalStudents
            : null
        }
      />
    </div>
  );
}

function StatTile({
  label,
  value,
  footer,
  trend,
  trendLabel,
  meter,
}: {
  label: string;
  value: React.ReactNode;
  footer: React.ReactNode;
  trend?: number[];
  trendLabel?: string;
  meter?: number | null;
}) {
  return (
    <section className="flex flex-col rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
        {trend && <Sparkline values={trend} label={trendLabel ?? label} />}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-sm">{footer}</div>
      {meter !== undefined && <Meter value={meter} label={label} />}
    </section>
  );
}

/** Évolution signée ; la couleur suit le sens (ici, une hausse est toujours bonne) */
function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span
      className="inline-flex items-center gap-0.5 font-medium"
      style={{
        color:
          value > 0
            ? "var(--viz-delta-up)"
            : value < 0
              ? "var(--viz-delta-down)"
              : undefined,
      }}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {formatSigned(value)}
      {suffix}
    </span>
  );
}

/** Tendance sur 12 points : semaines passées en gris, semaine en cours en couleur */
function Sparkline({ values, label }: { values: number[]; label: string }) {
  const width = 96;
  const height = 28;
  const max = Math.max(1, ...values);
  const points = values.map((v, i) => [
    (i / Math.max(1, values.length - 1)) * (width - 6) + 3,
    height - 3 - (v / max) * (height - 6),
  ]);
  const last = points[points.length - 1];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${label} : ${values.join(", ")}`}
      className="shrink-0"
    >
      <polyline
        points={points.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke="var(--viz-axis)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {last && (
        <circle
          cx={last[0]}
          cy={last[1]}
          r={3.5}
          fill="var(--viz-series)"
          stroke="hsl(var(--card))"
          strokeWidth={2}
        />
      )}
    </svg>
  );
}

/** Jauge fine : remplissage bleu sur une piste du même bleu, plus clair */
function Meter({ value, label }: { value: number | null; label: string }) {
  const percent = value === null ? 0 : Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className="mt-auto pt-4"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--viz-track)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, background: "var(--viz-series)" }}
        />
      </div>
    </div>
  );
}

/** Position de la moyenne sur l'échelle 0–20, avec le seuil de 10 marqué */
function ScoreMeter({ value }: { value: number | null }) {
  const percent = value === null ? 0 : (value / 20) * 100;
  return (
    <div className="mt-4" aria-hidden="true">
      <div className="relative h-2 w-full rounded-full" style={{ background: "var(--viz-track)" }}>
        <div
          className={cn("h-full rounded-full")}
          style={{ width: `${percent}%`, background: "var(--viz-series)" }}
        />
        <div
          className="absolute -top-1 h-4 w-px"
          style={{ left: "50%", background: "hsl(var(--foreground) / 0.4)" }}
        />
      </div>
      <div className="relative mt-1 h-4 text-[11px] text-muted-foreground">
        <span className="absolute left-0">0</span>
        <span className="absolute left-1/2 -translate-x-1/2">10</span>
        <span className="absolute right-0">20</span>
      </div>
    </div>
  );
}
