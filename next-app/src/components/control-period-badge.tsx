import {
  ControlPeriod,
  formatControlDate,
  getControlStatus,
} from "@/lib/control-period";
import { cn } from "@/lib/utils";
import { CalendarCheck, CalendarClock, Lock } from "lucide-react";

/** État de la période d'un contrôle, vu par le professeur */
export default function ControlPeriodBadge({
  opensAt,
  closesAt,
  className,
}: ControlPeriod & { className?: string }) {
  if (!opensAt && !closesAt) {
    return (
      <span className={cn("text-sm text-muted-foreground", className)}>
        Sans limite
      </span>
    );
  }

  const status = getControlStatus({ opensAt, closesAt });
  const { icon: Icon, text, tone } =
    status === "UPCOMING" && opensAt
      ? {
          icon: Lock,
          text: `Ouvre le ${formatControlDate(opensAt)}`,
          tone: "text-muted-foreground",
        }
      : status === "CLOSED" && closesAt
        ? {
            icon: CalendarCheck,
            text: `Clos le ${formatControlDate(closesAt)}`,
            tone: "text-muted-foreground",
          }
        : {
            icon: CalendarClock,
            text: closesAt
              ? `Ouvert jusqu'au ${formatControlDate(closesAt)}`
              : "Ouvert, sans date limite",
            tone: "text-green-700 dark:text-green-400",
          };

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", tone, className)}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {text}
    </span>
  );
}
