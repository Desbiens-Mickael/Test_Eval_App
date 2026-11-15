"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DASHBOARD_PERIODS, DashboardPeriod } from "@/lib/teacher-dashboard";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDashboardTransition } from "./dashboard-transition";
import { PERIOD_LABELS } from "./format";

const ALL_GROUPS = "tous";

interface DashboardFiltersProps {
  period: DashboardPeriod;
  groupId: string | null;
  groupOptions: { id: string; name: string }[];
}

/** Une seule ligne de filtres, au-dessus de tout ce qu'elle filtre */
export default function DashboardFilters({
  period,
  groupId,
  groupOptions,
}: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useDashboardTransition();

  const update = (key: "periode" | "groupe", value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div
        role="radiogroup"
        aria-label="Période"
        className="inline-flex rounded-lg border bg-card p-1 shadow-sm"
      >
        {DASHBOARD_PERIODS.map((value) => {
          const selected = value === period;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => update("periode", value === "30" ? null : value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {PERIOD_LABELS[value]}
            </button>
          );
        })}
      </div>

      {groupOptions.length > 0 && (
        <Select
          value={groupId ?? ALL_GROUPS}
          onValueChange={(value) =>
            update("groupe", value === ALL_GROUPS ? null : value)
          }
        >
          <SelectTrigger className="w-[200px] bg-card" aria-label="Groupe">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_GROUPS}>Tous les groupes</SelectItem>
            {groupOptions.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
