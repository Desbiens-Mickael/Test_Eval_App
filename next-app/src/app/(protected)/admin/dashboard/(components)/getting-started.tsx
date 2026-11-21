"use client";

import { Button } from "@/components/ui/button";
import type { TeacherOnboarding } from "@/data/dashboard/teacher-onboarding.data";
import {
  onboardingKey,
  readOnboardingFlag,
  writeOnboardingFlag,
} from "@/lib/onboarding-storage";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Step = {
  done: boolean;
  title: string;
  text: string;
  href: string;
  cta: string;
};

const buildSteps = (o: TeacherOnboarding): Step[] => [
  {
    done: o.hasStudents,
    title: "Créez les comptes de vos élèves",
    text: "Un par un ou en important une liste. Avec l'e-mail d'un parent, son accès est créé et envoyé tout seul.",
    href: "/admin/eleves",
    cta: "Gérer les élèves",
  },
  {
    done: o.hasGroupWithStudents,
    title: "Rassemblez-les dans un groupe",
    text: "Un groupe par classe ou par niveau. Ouvrez le groupe pour y ajouter des élèves.",
    href: "/admin/groupes",
    cta: "Ouvrir les groupes",
  },
  {
    done: o.hasLessons,
    title: "Écrivez une leçon",
    text: "Le cours que vos élèves pourront relire, rangé par matière.",
    href: "/admin/lecons/creation",
    cta: "Créer une leçon",
  },
  {
    done: o.hasExercices,
    title: "Ajoutez un exercice ou un contrôle à la leçon",
    text: "Dans la liste des leçons, menu « … » d'une leçon. Exercice : pour s'entraîner, non noté. Contrôle : noté.",
    href: "/admin/lecons/francais",
    cta: "Voir mes leçons",
  },
  {
    done: o.hasAssignments,
    title: "Attribuez-les à un groupe",
    text: "Dans la fiche du groupe, « Ajouter une leçon », puis activez ses exercices et contrôles avec leur interrupteur.",
    href: "/admin/groupes",
    cta: "Ouvrir les groupes",
  },
  {
    done: o.hasSubmissions,
    title: "Suivez les premières copies",
    text: "Dès qu'un élève rend un travail, vous êtes notifié et ce tableau de bord se remplit.",
    href: "/admin/eleves",
    cta: "Voir les élèves",
  },
];

/** Premiers pas du professeur, cochés d'après ses vraies données */
export default function GettingStarted({
  teacherId,
  onboarding,
}: {
  teacherId: string;
  onboarding: TeacherOnboarding;
}) {
  const storageKey = onboardingKey("getting-started-hidden", teacherId);
  // Masqué par défaut le temps de lire le stockage (pas de localStorage côté serveur)
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(readOnboardingFlag(storageKey));
  }, [storageKey]);

  const steps = buildSteps(onboarding);
  const doneCount = steps.filter((s) => s.done).length;
  const nextIndex = steps.findIndex((s) => !s.done);

  if (hidden || nextIndex === -1) return null;

  const hide = () => {
    writeOnboardingFlag(storageKey, true);
    setHidden(true);
  };

  return (
    <section
      aria-labelledby="getting-started-title"
      className="relative rounded-xl border bg-card p-6 shadow-sm"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-8 w-8"
        onClick={hide}
        aria-label="Masquer les premiers pas"
        title="Masquer les premiers pas"
      >
        <X className="h-4 w-4" />
      </Button>
      <h2 id="getting-started-title" className="pr-10 text-lg font-semibold">
        Premiers pas
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {doneCount} étape{doneCount > 1 ? "s" : ""} sur {steps.length} terminée
        {doneCount > 1 ? "s" : ""}. Suivez-les dans l&apos;ordre : chaque étape se
        coche toute seule.
      </p>
      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={doneCount}
        aria-label="Avancement des premiers pas"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>
      <ol className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, i) => {
          const isNext = i === nextIndex;
          return (
            <li
              key={step.title}
              className={cn(
                "flex gap-3 rounded-lg border p-4",
                isNext && "border-primary ring-1 ring-primary",
                step.done && "opacity-70"
              )}
            >
              {step.done ? (
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  aria-label="Terminé"
                />
              ) : (
                <Circle
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    isNext ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-label="À faire"
                />
              )}
              <div>
                <p className="font-medium">
                  {i + 1}. {step.title}
                  {isNext && <span className="sr-only"> (étape suivante)</span>}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                {!step.done && (
                  <Link
                    href={step.href}
                    className={cn(
                      "mt-2 inline-block text-sm font-medium text-primary hover:underline",
                      isNext && "font-semibold"
                    )}
                  >
                    {step.cta} →
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
