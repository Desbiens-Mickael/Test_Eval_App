"use client";

import ChartCard from "@/components/charts/chart-card";
import ColumnChart from "@/components/charts/column-chart";
import EmptyChart from "@/components/charts/empty-chart";
import { StudentProgress } from "@/lib/student-progress";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatLongDate, formatRate, formatShortDate, rateTone } from "./format";

/** Nombre de résultats affichés dans le graphique et dans la liste */
const CHART_SIZE = 20;
const LIST_SIZE = 8;

export function ResultsChart({
  history,
  forParent = false,
}: {
  history: StudentProgress["history"];
  /** Textes pour un parent (pas de tutoiement) */
  forParent?: boolean;
}) {
  const shown = history.slice(-CHART_SIZE);

  return (
    <ChartCard
      title={forParent ? "Résultats au fil du temps" : "Mes résultats au fil du temps"}
      description={
        history.length > CHART_SIZE
          ? `Tes ${CHART_SIZE} derniers contrôles, du plus ancien au plus récent`
          : "Chaque colonne est un contrôle, du plus ancien au plus récent"
      }
      className="h-full"
      table={{
        headers: ["Date", "Contrôle", "Matière", "Réussite"],
        rows: [...shown]
          .reverse()
          .map((h) => [formatShortDate(h.createdAt), h.title, h.subject, formatRate(h.percent)]),
      }}
    >
      {shown.length === 0 ? (
        <EmptyChart message="Tes résultats s'afficheront ici." />
      ) : (
        <ColumnChart
          data={shown.map((h) => ({
            key: h.id,
            label: formatShortDate(h.createdAt),
            value: h.percent,
            details: [h.title, h.subject],
          }))}
          formatValue={formatRate}
          ariaLabel="Réussite de chaque contrôle, en pourcentage"
          scaleMax={100}
          height={200}
        />
      )}
    </ChartCard>
  );
}

export function RecentResults({
  history,
  allHref = "/eleve/exercices/faits",
  copyBasePath = "/eleve/exercices/correction/",
  forParent = false,
}: {
  history: StudentProgress["history"];
  /** Liste de toutes les copies */
  allHref?: string;
  /** Début du lien vers une copie corrigée (suivi de son id) */
  copyBasePath?: string;
  /** Textes pour un parent (pas de tutoiement) */
  forParent?: boolean;
}) {
  const recent = [...history].reverse().slice(0, LIST_SIZE);

  return (
    <section className="flex h-full flex-col rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold leading-tight">Historique</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {forParent ? "Derniers contrôles corrigés" : "Tes derniers contrôles corrigés"}
          </p>
        </div>
        {history.length > 0 && (
          <Link
            href={allHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Tout voir <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </header>

      {recent.length === 0 ? (
        <EmptyChart message="Aucun contrôle fait pour l'instant." />
      ) : (
        <ul className="-mx-2 divide-y">
          {recent.map((h) => (
            <li key={h.id}>
              <Link
                href={`${copyBasePath}${h.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", h.color ?? "bg-muted-foreground")}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{h.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {h.subject} · <time dateTime={h.createdAt}>{formatLongDate(h.createdAt)}</time>
                  </span>
                </span>
                <span className={cn("text-sm font-semibold tabular-nums", rateTone(h.percent))}>
                  {formatRate(h.percent)}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
