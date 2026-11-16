import { CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

/** Premiers pas, tant que le professeur n'a pas de classe en place */
export default function GettingStarted({
  hasStudents,
  hasGroups,
  hasAssignments,
}: {
  hasStudents: boolean;
  hasGroups: boolean;
  hasAssignments: boolean;
}) {
  const steps = [
    {
      done: hasStudents,
      title: "Créez les comptes de vos élèves",
      text: "Chaque élève reçoit un identifiant et un mot de passe.",
      href: "/admin/eleves",
      cta: "Gérer les élèves",
    },
    {
      done: hasGroups,
      title: "Rassemblez-les dans un groupe",
      text: "Un groupe par classe ou par niveau.",
      href: "/admin/groupes",
      cta: "Créer un groupe",
    },
    {
      done: hasAssignments,
      title: "Attribuez leçons et exercices",
      text: "Les résultats apparaîtront ici dès les premières copies.",
      href: "/admin/groupes",
      cta: "Ouvrir les groupes",
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Mettez votre classe en place</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {doneCount} étape{doneCount > 1 ? "s" : ""} sur 3 terminée
        {doneCount > 1 ? "s" : ""}. Votre tableau de bord se remplira ensuite tout seul.
      </p>
      <ol className="mt-5 grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3 rounded-lg border p-4">
            {step.done ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-label="Terminé" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-label="À faire" />
            )}
            <div>
              <p className="font-medium">
                {i + 1}. {step.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              {!step.done && (
                <Link
                  href={step.href}
                  className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                >
                  {step.cta} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
