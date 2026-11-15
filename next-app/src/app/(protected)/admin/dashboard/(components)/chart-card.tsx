"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { BarChart3, Table2 } from "lucide-react";
import { useState } from "react";

export type ChartTable = {
  headers: string[];
  rows: (string | number)[][];
};

interface ChartCardProps {
  title: string;
  description?: string;
  /** Vue tableau équivalente au graphique (accessibilité) */
  table?: ChartTable;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function ChartCard({
  title,
  description,
  table,
  action,
  className,
  children,
}: ChartCardProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <section
      className={cn(
        "viz flex flex-col rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
        className
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {action}
          {table && (
            <div className="inline-flex rounded-md border p-0.5" role="group" aria-label="Affichage">
              <ViewButton
                active={view === "chart"}
                onClick={() => setView("chart")}
                label="Graphique"
                icon={<BarChart3 className="h-3.5 w-3.5" />}
              />
              <ViewButton
                active={view === "table"}
                onClick={() => setView("table")}
                label="Tableau"
                icon={<Table2 className="h-3.5 w-3.5" />}
              />
            </div>
          )}
        </div>
      </header>

      {view === "chart" || !table ? (
        <div className="flex-1">{children}</div>
      ) : (
        <div className="max-h-[320px] flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {table.headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j} className="tabular-nums">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
    </button>
  );
}
