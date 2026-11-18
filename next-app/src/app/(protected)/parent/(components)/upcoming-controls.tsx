import { formatControlDate, getControlStatus } from "@/lib/control-period";
import { CalendarClock } from "lucide-react";

type UpcomingControl = {
  id: string;
  title: string;
  subject: string;
  opensAt?: Date | null;
  closesAt?: Date | null;
};

/** Contrôles attribués à l'enfant et pas encore faits */
export default function UpcomingControls({
  childName,
  controls,
}: {
  childName: string;
  controls: UpcomingControl[];
}) {
  const firstName = childName.split(" ")[0];
  const list = controls;

  return (
    <section
      aria-labelledby="upcoming-controls-title"
      className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm"
    >
      <h2 id="upcoming-controls-title" className="text-base font-semibold leading-tight">
        Contrôles à faire
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Les contrôles que {firstName} n&apos;a pas encore rendus
      </p>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Aucun contrôle en attente. 🎉
        </p>
      ) : (
        <ul className="mt-3 divide-y">
          {list.map((control) => {
            const status = getControlStatus(control);
            return (
              <li key={control.id} className="flex items-start gap-3 py-3">
                <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{control.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {control.subject}
                    {status === "UPCOMING" && control.opensAt
                      ? ` · ouvre le ${formatControlDate(control.opensAt)}`
                      : control.closesAt
                      ? ` · à rendre avant le ${formatControlDate(control.closesAt)}`
                      : " · sans date limite"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
