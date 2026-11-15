import { cn } from "@/lib/utils";
import { Ban, CheckCircle2, Clock } from "lucide-react";

/** État du compte : désactivé, actif (déjà connecté) ou jamais connecté */
export default function AccountStatusBadge({
  isActive,
  disabledAt,
  className,
}: {
  isActive: boolean;
  disabledAt: Date | string | null;
  className?: string;
}) {
  const status = disabledAt
    ? { label: "Désactivé", icon: Ban, iconClass: "text-red-600 dark:text-red-400" }
    : isActive
      ? { label: "Actif", icon: CheckCircle2, iconClass: "text-green-600 dark:text-green-400" }
      : { label: "Jamais connecté", icon: Clock, iconClass: "text-amber-600 dark:text-amber-400" };
  const Icon = status.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", status.iconClass)} aria-hidden="true" />
      {status.label}
    </span>
  );
}
