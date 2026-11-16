"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { niceTicks } from "./nice-ticks";

export type ColumnDatum = {
  key: string;
  label: string;
  value: number;
  /** Lignes secondaires affichées dans l'infobulle */
  details?: string[];
};

interface ColumnChartProps {
  data: ColumnDatum[];
  formatValue: (value: number) => string;
  ariaLabel: string;
  height?: number;
  /** Nombre maximum d'étiquettes sur l'axe horizontal */
  maxXLabels?: number;
  /** Haut de l'échelle imposé (ex. 100 pour des pourcentages) */
  scaleMax?: number;
}

/**
 * Histogramme en colonnes, en HTML (responsive sans déformation du texte).
 * Colonnes fines (24 px max), coins arrondis côté valeur, une seule ligne de base,
 * grille en filets discrets et infobulle au survol comme au clavier.
 */
export default function ColumnChart({
  data,
  formatValue,
  ariaLabel,
  height = 180,
  maxXLabels = 8,
  scaleMax,
}: ColumnChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(0, ...data.map((d) => d.value));
  const ticks = niceTicks(scaleMax ?? max);
  const top = ticks[ticks.length - 1];
  const labelEvery = Math.max(1, Math.ceil(data.length / maxXLabels));
  const activeDatum = active !== null ? data[active] : null;

  return (
    <div className="w-full" role="figure" aria-label={ariaLabel}>
      <div className="relative mt-3" style={{ height }}>
        {/* Grille et graduations */}
        {ticks.map((tick) => (
          <div
            key={tick}
            className="pointer-events-none absolute inset-x-0 flex items-center"
            style={{ bottom: `${(tick / top) * 100}%` }}
          >
            <span className="w-8 -translate-y-1/2 pr-2 text-right text-[11px] tabular-nums text-muted-foreground">
              {tick}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: tick === 0 ? "var(--viz-axis)" : "var(--viz-grid)" }}
            />
          </div>
        ))}

        {/* Colonnes */}
        <div className="absolute inset-y-0 left-8 right-0 flex items-end gap-[2px]">
          {data.map((d, i) => {
            const isActive = active === i;
            return (
              <button
                key={d.key}
                type="button"
                className="group relative flex h-full flex-1 items-end justify-center focus-visible:outline-none"
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${d.label} : ${formatValue(d.value)}`}
              >
                <span
                  className={cn(
                    "block w-full max-w-[24px] rounded-t-[4px] transition-colors",
                    "group-focus-visible:ring-2 group-focus-visible:ring-ring"
                  )}
                  style={{
                    height: d.value > 0 ? `max(2px, ${(d.value / top) * 100}%)` : 0,
                    background: isActive ? "var(--viz-series-hover)" : "var(--viz-series)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Infobulle : la valeur d'abord, l'étiquette ensuite */}
        {activeDatum && active !== null && (
          <div
            className={cn(
              "pointer-events-none absolute z-10 -translate-y-full whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md",
              (active + 0.5) / data.length < 0.2
                ? "-translate-x-4"
                : (active + 0.5) / data.length > 0.8
                  ? "-translate-x-[calc(100%-1rem)]"
                  : "-translate-x-1/2"
            )}
            style={{
              left: `calc(2rem + (100% - 2rem) * ${(active + 0.5) / data.length})`,
              bottom: `calc(${(activeDatum.value / top) * 100}% + 8px)`,
            }}
          >
            <div className="text-sm font-semibold">{formatValue(activeDatum.value)}</div>
            <div className="text-xs text-muted-foreground">{activeDatum.label}</div>
            {activeDatum.details?.map((line) => (
              <div key={line} className="text-xs text-muted-foreground">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Axe horizontal : étiquettes centrées sous leur colonne, sans troncature */}
      <div className="relative ml-8 mt-2 h-4" aria-hidden="true">
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          const show =
            isLast ||
            (i % labelEvery === 0 && data.length - 1 - i > labelEvery / 2);
          if (!show) return null;
          const position = (i + 0.5) / data.length;
          return (
            <span
              key={d.key}
              className={cn(
                "absolute whitespace-nowrap text-[11px] text-muted-foreground",
                position < 0.08
                  ? "translate-x-0"
                  : position > 0.92
                    ? "-translate-x-full"
                    : "-translate-x-1/2"
              )}
              style={{ left: `${position * 100}%` }}
            >
              {d.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
