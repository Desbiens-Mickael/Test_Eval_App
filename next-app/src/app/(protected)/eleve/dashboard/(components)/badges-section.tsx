import { BadgeIcon, StudentProgress } from "@/lib/student-progress";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Compass,
  Crown,
  Footprints,
  Lock,
  LucideIcon,
  Mountain,
  Rocket,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { formatLongDate } from "./format";

const ICONS: Record<BadgeIcon, LucideIcon> = {
  footprints: Footprints,
  rocket: Rocket,
  mountain: Mountain,
  star: Star,
  sparkles: Sparkles,
  compass: Compass,
  calendar: CalendarCheck,
  crown: Crown,
  "trending-up": TrendingUp,
};

export default function BadgesSection({
  badges,
  forParent = false,
}: {
  badges: StudentProgress["badges"];
  /** Textes pour un parent (pas de tutoiement) */
  forParent?: boolean;
}) {
  const earned = badges.filter((b) => b.earnedAt).length;

  return (
    <section className="viz h-full rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <header className="mb-4">
        <h2 className="text-base font-semibold leading-tight">
          {forParent ? "Badges" : "Mes badges"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {earned === 0
            ? forParent
              ? "Pas encore de badge gagné."
              : "Fais des contrôles pour gagner tes premiers badges."
            : `${earned} badge${earned > 1 ? "s" : ""} gagné${earned > 1 ? "s" : ""} sur ${badges.length}`}
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {badges.map((badge) => {
          const Icon = ICONS[badge.icon];
          const isEarned = badge.earnedAt !== null;
          const ratio = badge.progress ? badge.progress.current / badge.progress.target : 0;

          return (
            <li
              key={badge.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3",
                isEarned ? "border-primary/30 bg-primary/5" : "border-dashed"
              )}
            >
              <span
                className={cn(
                  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  isEarned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
                aria-hidden="true"
              >
                <Icon className="h-5 w-5" />
                {!isEarned && (
                  <Lock className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-card p-0.5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold", !isEarned && "text-muted-foreground")}>
                  {badge.title}
                  <span className="sr-only">{isEarned ? " (obtenu)" : " (à gagner)"}</span>
                </p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {badge.earnedAt ? (
                  <p className="mt-1 text-xs font-medium text-primary">
                    Obtenu le {formatLongDate(badge.earnedAt)}
                  </p>
                ) : (
                  badge.progress && (
                    <div className="mt-2 flex items-center gap-2">
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full"
                        style={{ background: "var(--viz-track)" }}
                        role="meter"
                        aria-label={`Avancement du badge ${badge.title}`}
                        aria-valuemin={0}
                        aria-valuemax={badge.progress.target}
                        aria-valuenow={badge.progress.current}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${ratio * 100}%`, background: "var(--viz-series)" }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {badge.progress.current}/{badge.progress.target}
                      </span>
                    </div>
                  )
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
