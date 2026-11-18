import {
  INACTIVITY_DAYS,
  StudentAlertReason,
  TeacherDashboard,
} from "@/lib/teacher-dashboard";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  PartyPopper,
  PenLine,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { formatRelative, formatScore, initials } from "./format";

const REASONS: Record<
  StudentAlertReason,
  { label: string; color: string; icon: typeof AlertTriangle }
> = {
  "low-average": {
    label: "Moyenne sous 10",
    color: "var(--viz-critical)",
    icon: AlertTriangle,
  },
  declining: {
    label: "En baisse",
    color: "var(--viz-serious)",
    icon: TrendingDown,
  },
  inactive: {
    label: `Inactif depuis ${INACTIVITY_DAYS} j`,
    color: "var(--viz-warning)",
    icon: Clock,
  },
};

const MAX_STUDENTS = 6;

/** Statut : toujours une icône et un libellé, jamais la couleur seule */
function ReasonBadge({ reason }: { reason: StudentAlertReason }) {
  const { label, color, icon: Icon } = REASONS[reason];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
      {label}
    </span>
  );
}

function Card({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="viz flex flex-col rounded-xl border bg-card p-5 shadow-sm">
      <header className="mb-3">
        <h2 className="text-base font-semibold leading-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="flex-1">{children}</div>
      {footer && <footer className="mt-3 border-t pt-3 text-sm">{footer}</footer>}
    </section>
  );
}

export function StudentsToHelp({
  students,
}: {
  students: TeacherDashboard["studentsToHelp"];
}) {
  return (
    <Card
      title="Élèves à accompagner"
      description="Moyenne basse, baisse récente ou contrôles en attente sans activité"
      footer={
        <Link href="/admin/eleves" className="font-medium text-primary hover:underline">
          {students.length > MAX_STUDENTS
            ? `Voir les ${students.length} élèves concernés`
            : "Voir tous les élèves"}
        </Link>
      }
    >
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
          <PartyPopper className="h-6 w-6" aria-hidden="true" />
          Tout le monde suit le rythme. Bravo !
        </div>
      ) : (
        <ul className="-mx-2 divide-y">
          {students.slice(0, MAX_STUDENTS).map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/eleves/${s.id}`}
                className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold"
                  aria-hidden="true"
                >
                  {initials(s.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate font-medium">{s.name}</span>
                    {s.groupName && (
                      <span className="truncate text-xs text-muted-foreground">
                        {s.groupName}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {s.reasons.map((reason) => (
                      <ReasonBadge key={reason} reason={reason} />
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold tabular-nums">
                    {formatScore(s.average)}
                    <span className="font-normal text-muted-foreground">/20</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.pending > 0
                      ? `${s.pending} à faire`
                      : formatRelative(s.lastActivity)}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function HardestExercises({
  exercises,
}: {
  exercises: TeacherDashboard["hardestExercises"];
}) {
  return (
    <Card
      title="Contrôles à revoir"
      description="Les moyennes les plus basses (au moins 2 copies)"
    >
      {exercises.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Aucun exercice ne pose de difficulté particulière.
        </div>
      ) : (
        <ul className="-mx-2 divide-y">
          {exercises.map((e) => (
            <li key={e.exerciceId}>
              <Link
                href={`/admin/exercices/${e.exerciceId}/edition`}
                className="block rounded-lg px-2 py-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-medium">{e.title}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    {formatScore(e.average)}
                    <span className="font-normal text-muted-foreground">/20</span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full"
                    style={{ background: "var(--viz-track)" }}
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(e.average / 20) * 100}%`,
                        background: "var(--viz-series)",
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {e.subject} · {e.count} copies
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/** Réponses libres à corriger : affiché seulement s'il y en a */
export function CopiesToReview({ copies }: { copies: TeacherDashboard["toReview"] }) {
  if (copies.length === 0) return null;
  const shown = copies.slice(0, 6);
  return (
    <Card
      title={`Copies à corriger (${copies.length})`}
      description="Réponses libres en attente de votre note : elles ne comptent pas encore dans les moyennes"
      footer={
        copies.length > shown.length ? (
          <span className="text-muted-foreground">
            Et {copies.length - shown.length} autre{copies.length - shown.length > 1 ? "s" : ""}…
          </span>
        ) : undefined
      }
    >
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => (
          <li key={c.id}>
            <Link
              href={`/admin/eleves/${c.studentId}/exercices/correction/${c.id}`}
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <PenLine className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{c.studentName}</span>
                <span className="block truncate text-sm text-muted-foreground">{c.title}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatRelative(c.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecentSubmissions({
  recent,
}: {
  recent: TeacherDashboard["recent"];
}) {
  return (
    <Card title="Dernières copies" description="Cliquez sur une copie pour voir la correction">
      {recent.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Aucune copie sur cette période.
        </div>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-2 pb-2 font-medium">Élève</th>
                <th className="px-2 pb-2 font-medium">Contrôle</th>
                <th className="hidden px-2 pb-2 font-medium md:table-cell">Matière</th>
                <th className="px-2 pb-2 text-right font-medium">Note</th>
                <th className="hidden px-2 pb-2 text-right font-medium sm:table-cell">Rendue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recent.map((r) => (
                <tr key={r.id} className="group relative transition-colors hover:bg-muted/60">
                  <td className="px-2 py-2.5 font-medium">
                    <Link
                      href={`/admin/eleves/${r.studentId}/exercices/correction/${r.id}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                    >
                      {r.studentName}
                    </Link>
                  </td>
                  <td className="max-w-[16rem] truncate px-2 py-2.5">{r.title}</td>
                  <td className="hidden px-2 py-2.5 text-muted-foreground md:table-cell">
                    {r.subject}
                  </td>
                  <td className="px-2 py-2.5 text-right tabular-nums">
                    <span className="font-semibold">{formatScore(r.score)}</span>
                    <span className="text-muted-foreground">/20</span>
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-2.5 text-right text-muted-foreground sm:table-cell">
                    {formatRelative(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
