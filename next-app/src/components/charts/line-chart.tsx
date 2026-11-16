"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export type LinePoint = {
  key: string;
  /** Étiquette de l'axe horizontal */
  label: string;
  value: number;
  /** Lignes secondaires affichées dans l'infobulle */
  details?: string[];
};

interface LineChartProps {
  data: LinePoint[];
  formatValue: (value: number) => string;
  ariaLabel: string;
  /** Haut de l'échelle (100 pour des pourcentages) */
  scaleMax?: number;
  height?: number;
}

const TICKS = [0, 50, 100];

/**
 * Courbe simple sur une échelle fixe (0–100 par défaut).
 * Le tracé est en SVG étiré ; points, graduations et infobulle sont en HTML
 * pour que le texte ne soit jamais déformé. Chaque point est focusable.
 */
export default function LineChart({
  data,
  formatValue,
  ariaLabel,
  scaleMax = 100,
  height = 160,
}: LineChartProps) {
  const [active, setActive] = useState<number | null>(null);
  // Un seul point : on le centre
  const xOf = (i: number) => (data.length === 1 ? 50 : (i / (data.length - 1)) * 100);
  const yOf = (v: number) => 100 - (Math.min(v, scaleMax) / scaleMax) * 100;
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(d.value)}`).join(" ");
  const activePoint = active !== null ? data[active] : null;

  return (
    <div className="w-full" role="figure" aria-label={ariaLabel}>
      <div className="flex">
        {/* Graduations */}
        <div className="relative w-9 shrink-0" style={{ height }} aria-hidden="true">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-muted-foreground"
              style={{ top: `${yOf((tick / 100) * scaleMax)}%` }}
            >
              {tick}
            </span>
          ))}
        </div>

        <div className="relative flex-1 px-2" style={{ height }}>
          <div className="absolute inset-y-0 left-2 right-2">
            {TICKS.map((tick) => (
              <div
                key={tick}
                className="absolute inset-x-0 h-px"
                style={{
                  top: `${yOf((tick / 100) * scaleMax)}%`,
                  background: tick === 0 ? "var(--viz-axis)" : "var(--viz-grid)",
                }}
              />
            ))}

            {data.length > 1 && (
              <svg
                className="absolute inset-0 h-full w-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={path}
                  fill="none"
                  stroke="var(--viz-series)"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {data.map((d, i) => (
              <button
                key={d.key}
                type="button"
                className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ left: `${xOf(i)}%`, top: `${yOf(d.value)}%` }}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${d.label} : ${formatValue(d.value)}`}
              >
                <span
                  className={cn(
                    "block rounded-full border-2 bg-card transition-all",
                    active === i ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                  )}
                  style={{ borderColor: "var(--viz-series)" }}
                />
              </button>
            ))}

            {activePoint && active !== null && (
              <div
                className={cn(
                  "pointer-events-none absolute z-10 -translate-y-full whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-popover-foreground shadow-md",
                  xOf(active) < 20
                    ? "-translate-x-2"
                    : xOf(active) > 80
                      ? "-translate-x-[calc(100%-0.5rem)]"
                      : "-translate-x-1/2"
                )}
                style={{ left: `${xOf(active)}%`, top: `calc(${yOf(activePoint.value)}% - 10px)` }}
              >
                <div className="text-sm font-semibold">{formatValue(activePoint.value)}</div>
                <div className="text-xs text-muted-foreground">{activePoint.label}</div>
                {activePoint.details?.map((line) => (
                  <div key={line} className="text-xs text-muted-foreground">
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Axe horizontal */}
      <div className="relative ml-9 mt-2 h-4 px-2" aria-hidden="true">
        <div className="relative h-full">
          {data.map((d, i) => {
            // Au plus ~8 étiquettes, toujours la première et la dernière
            const every = Math.max(1, Math.ceil(data.length / 8));
            if (i !== 0 && i !== data.length - 1 && i % every !== 0) return null;
            return (
              <span
                key={d.key}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] text-muted-foreground"
                style={{ left: `${xOf(i)}%` }}
              >
                {d.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
