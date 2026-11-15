"use client";

import { DashboardPeriod, TeacherDashboard } from "@/lib/teacher-dashboard";
import ChartCard from "./chart-card";
import ColumnChart from "./column-chart";
import { PERIOD_LABELS, formatInteger, formatScore } from "./format";

const UNIT_LABEL = { day: "par jour", week: "par semaine", month: "par mois" };

const copies = (value: number) =>
  `${formatInteger(value)} copie${value > 1 ? "s" : ""}`;

export function ActivityChart({
  activity,
  period,
}: {
  activity: TeacherDashboard["activity"];
  period: DashboardPeriod;
}) {
  const total = activity.buckets.reduce((sum, b) => sum + b.count, 0);
  return (
    <ChartCard
      title="Activité des élèves"
      description={`Copies rendues ${UNIT_LABEL[activity.unit]} · ${PERIOD_LABELS[period].toLowerCase()}`}
      className="xl:col-span-2"
      table={{
        headers: ["Période", "Copies", "Moyenne /20"],
        rows: activity.buckets.map((b) => [b.label, b.count, formatScore(b.average)]),
      }}
    >
      {total === 0 ? (
        <EmptyChart message="Aucune copie rendue sur cette période." />
      ) : (
        <ColumnChart
          ariaLabel={`Copies rendues ${UNIT_LABEL[activity.unit]}`}
          formatValue={copies}
          height={200}
          data={activity.buckets.map((b) => ({
            key: b.key,
            label: b.label,
            value: b.count,
            details:
              b.average !== null ? [`Moyenne : ${formatScore(b.average)}/20`] : undefined,
          }))}
        />
      )}
    </ChartCard>
  );
}

export function ScoreDistribution({
  distribution,
}: {
  distribution: TeacherDashboard["distribution"];
}) {
  const total = distribution.reduce((sum, b) => sum + b.count, 0);
  const below = distribution.filter((b) => b.max <= 10).reduce((s, b) => s + b.count, 0);
  return (
    <ChartCard
      title="Répartition des notes"
      description={
        total > 0
          ? `${Math.round((below / total) * 100)} % des copies sous la moyenne`
          : "Notes ramenées sur 20"
      }
      table={{
        headers: ["Tranche /20", "Copies"],
        rows: distribution.map((b) => [b.label, b.count]),
      }}
    >
      {total === 0 ? (
        <EmptyChart message="Pas encore de notes." />
      ) : (
        <ColumnChart
          ariaLabel="Nombre de copies par tranche de notes sur 20"
          formatValue={copies}
          height={200}
          maxXLabels={5}
          data={distribution.map((b) => ({
            key: b.label,
            label: b.label,
            value: b.count,
            details: [`Notes de ${b.min} à ${b.max} /20`],
          }))}
        />
      )}
    </ChartCard>
  );
}

export function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      {message}
    </div>
  );
}
