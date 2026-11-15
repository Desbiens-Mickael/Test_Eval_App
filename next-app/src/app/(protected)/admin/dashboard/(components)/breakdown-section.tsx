"use client";

import {
  RHYTHM_DAYS,
  RHYTHM_SLOTS,
  TeacherDashboard,
} from "@/lib/teacher-dashboard";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EmptyChart } from "./activity-section";
import ChartCard from "./chart-card";
import { formatInteger, formatPercent, formatScore } from "./format";

/** Barres horizontales sur l'échelle 0–20, valeur au bout de la barre */
export function SubjectAverages({
  bySubject,
}: {
  bySubject: TeacherDashboard["bySubject"];
}) {
  return (
    <ChartCard
      title="Moyenne par matière"
      description="Sur 20, copies de la période"
      table={{
        headers: ["Matière", "Moyenne /20", "Copies"],
        rows: bySubject.map((s) => [s.subject, formatScore(s.average), s.count]),
      }}
    >
      {bySubject.length === 0 ? (
        <EmptyChart message="Aucune copie sur cette période." />
      ) : (
        <ul className="space-y-4" aria-label="Moyenne sur 20 par matière">
          {bySubject.map((s) => (
            <li key={s.subject} className="group">
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{s.subject}</span>
                <span className="text-xs text-muted-foreground">
                  {formatInteger(s.count)} copie{s.count > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative h-4 flex-1">
                  <div
                    className="absolute inset-y-0 left-0 w-px"
                    style={{ background: "var(--viz-axis)" }}
                  />
                  <div
                    className="absolute inset-y-0 left-1/2 w-px"
                    style={{ background: "var(--viz-grid)" }}
                  />
                  <div
                    className="relative h-full rounded-r-[4px] transition-colors group-hover:[background:var(--viz-series-hover)]"
                    style={{
                      width: `${(s.average / 20) * 100}%`,
                      background: "var(--viz-series)",
                    }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-semibold tabular-nums">
                  {formatScore(s.average)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

export function GroupProgress({ groups }: { groups: TeacherDashboard["groups"] }) {
  return (
    <ChartCard
      title="Avancement des groupes"
      description="Exercices faits sur exercices attribués"
      table={{
        headers: ["Groupe", "Élèves", "Faits / attribués", "Complétion", "Moyenne /20"],
        rows: groups.map((g) => [
          g.name,
          g.studentCount,
          `${g.done} / ${g.assigned}`,
          formatPercent(g.completionRate),
          formatScore(g.average),
        ]),
      }}
    >
      {groups.length === 0 ? (
        <EmptyChart message="Aucun groupe pour l'instant." />
      ) : (
        <ul className="-mx-2 divide-y">
          {groups.map((g) => {
            const percent = Math.round((g.completionRate ?? 0) * 100);
            return (
              <li key={g.id}>
                <Link
                  href={`/admin/groupes/${g.id}`}
                  className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-medium">{g.name}</span>
                      <span className="text-sm font-semibold tabular-nums">
                        {g.completionRate === null ? "—" : `${percent} %`}
                      </span>
                    </div>
                    <div
                      className="mt-2 h-2 overflow-hidden rounded-full"
                      style={{ background: "var(--viz-track)" }}
                      role="meter"
                      aria-label={`Complétion du groupe ${g.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${percent}%`, background: "var(--viz-series)" }}
                      />
                    </div>
                    <div className="mt-1.5 text-xs text-muted-foreground">
                      {g.studentCount} élève{g.studentCount > 1 ? "s" : ""} ·{" "}
                      {g.exerciceCount} exercice{g.exerciceCount > 1 ? "s" : ""} ·
                      moyenne {formatScore(g.average)}/20
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </ChartCard>
  );
}

const DAY_NAMES = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

/** Carte de chaleur jour × moment de la journée (rampe séquentielle bleue) */
export function WorkRhythm({ rhythm }: { rhythm: TeacherDashboard["rhythm"] }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(0, ...rhythm.map((c) => c.count));
  const level = (count: number) => (count === 0 ? 0 : Math.max(1, Math.ceil((count / max) * 5)));
  const peak = rhythm.reduce((best, c) => (c.count > best.count ? c : best), rhythm[0]);
  const activeCell = rhythm.find((c) => `${c.day}:${c.slot}` === active);

  return (
    <ChartCard
      title="Rythme de travail"
      description={
        max > 0
          ? `Pic d'activité le ${DAY_NAMES[peak.day]} ${RHYTHM_SLOTS[peak.slot].label.toLowerCase()}`
          : "Quand vos élèves rendent leurs copies"
      }
      table={{
        headers: ["Jour", ...RHYTHM_SLOTS.map((s) => s.label)],
        rows: RHYTHM_DAYS.map((day, d) => [
          day,
          ...RHYTHM_SLOTS.map((_, s) => rhythm.find((c) => c.day === d && c.slot === s)?.count ?? 0),
        ]),
      }}
    >
      {max === 0 ? (
        <EmptyChart message="Pas encore assez d'activité." />
      ) : (
        <div>
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: "5.5rem repeat(7, minmax(0, 1fr))" }}
            role="grid"
            aria-label="Nombre de copies par jour et moment de la journée"
          >
            <span />
            {RHYTHM_DAYS.map((day) => (
              <span key={day} className="pb-1 text-center text-[11px] text-muted-foreground">
                {day}
              </span>
            ))}
            {RHYTHM_SLOTS.map((slot, s) => (
              <div key={slot.label} className="contents" role="row">
                <span className="flex flex-col justify-center pr-2 text-[11px] leading-tight text-muted-foreground">
                  <span className="text-foreground/80">{slot.label}</span>
                  <span>{slot.hint}</span>
                </span>
                {RHYTHM_DAYS.map((_, d) => {
                  const cell = rhythm.find((c) => c.day === d && c.slot === s)!;
                  const key = `${d}:${s}`;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="gridcell"
                      aria-label={`${DAY_NAMES[d]} ${slot.label.toLowerCase()} : ${cell.count} copie${cell.count > 1 ? "s" : ""}`}
                      onPointerEnter={() => setActive(key)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(key)}
                      onBlur={() => setActive(null)}
                      className={cn(
                        "h-9 rounded-[4px] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active === key && "scale-105 ring-2 ring-foreground/30"
                      )}
                      style={{ background: `var(--viz-seq-${level(cell.count)})` }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <span className="min-h-4" aria-live="polite">
              {activeCell
                ? `${DAY_NAMES[activeCell.day]} ${RHYTHM_SLOTS[activeCell.slot].label.toLowerCase()} · ${activeCell.count} copie${activeCell.count > 1 ? "s" : ""}`
                : "Survolez une case pour le détail"}
            </span>
            <span className="flex items-center gap-1" aria-hidden="true">
              Moins
              {[0, 1, 2, 3, 4, 5].map((l) => (
                <span
                  key={l}
                  className="h-3 w-3 rounded-[3px]"
                  style={{ background: `var(--viz-seq-${l})` }}
                />
              ))}
              Plus
            </span>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
