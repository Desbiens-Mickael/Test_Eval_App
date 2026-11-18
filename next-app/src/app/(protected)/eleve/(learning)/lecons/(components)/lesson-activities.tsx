"use client";

import { getLessonActivitiesAction } from "@/actions/lesson-activities.action";
import ExerciceKindBadge from "@/components/exercice-kind-badge";
import { NoteDisplay } from "@/components/note-display";
import SubjectLayout from "@/components/subject-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatControlDate } from "@/lib/control-period";
import type { LessonControl, LessonPractice } from "@/lib/lesson-activities";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ListChecks } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import ExerciceTypeBadge from "../../exercices/(components)/exercice-type-badge";

const PRACTICE_STATUS: Record<
  LessonPractice["summary"]["status"],
  { label: string; action: string }
> = {
  "not-started": { label: "Pas encore commencé", action: "Commencer" },
  "in-progress": { label: "En cours", action: "Réessayer" },
  "correction-seen": { label: "Terminé · correction vue", action: "Voir la correction" },
};

/** Exercices et contrôles de la leçon attribués au groupe de l'élève */
export default function LessonActivities({ lessonId }: { lessonId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["lesson-activities", lessonId],
    queryFn: async () => (await getLessonActivitiesAction(lessonId)).data,
  });

  if (isLoading) {
    return (
      <section className="mt-12 space-y-3" aria-busy="true">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </section>
    );
  }

  // Rien d'attribué pour cette leçon : la section n'apparaît pas
  if (!data || (data.practices.length === 0 && data.controls.length === 0)) {
    return null;
  }

  return (
    <section className="mt-12 border-t pt-8" aria-labelledby="lesson-activities-title">
      <h2
        id="lesson-activities-title"
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground/90"
      >
        <ListChecks className="h-6 w-6 text-primary" aria-hidden="true" />
        Pour aller plus loin
      </h2>

      <div className="space-y-8">
        {data.practices.length > 0 && (
          <ActivityGroup title="S'entraîner (non noté)">
            {data.practices.map((practice) => (
              <PracticeRow key={practice.id} practice={practice} />
            ))}
          </ActivityGroup>
        )}
        {data.controls.length > 0 && (
          <ActivityGroup title="Contrôles (notés)">
            {data.controls.map((control) => (
              <ControlRow key={control.id} control={control} />
            ))}
          </ActivityGroup>
        )}
      </div>
    </section>
  );
}

function ActivityGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function ActivityRow({
  kind,
  title,
  type,
  level,
  levelColor,
  status,
  action,
}: {
  kind: "CONTROL" | "PRACTICE";
  title: string;
  type: string;
  level: string;
  levelColor: string;
  status: ReactNode;
  action: ReactNode;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-2">
        <p className="font-semibold leading-tight">{title}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <ExerciceKindBadge kind={kind} />
          <ExerciceTypeBadge type={type} />
          <SubjectLayout label={level} color={levelColor} className="text-xs py-0.5" />
        </div>
        <div className="text-sm text-muted-foreground">{status}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </li>
  );
}

function ActionLink({ href, label, variant = "default" }: {
  href: string;
  label: string;
  variant?: "default" | "outline";
}) {
  return (
    <Button asChild variant={variant} className="w-full gap-2 sm:w-auto">
      <Link href={href}>
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Button>
  );
}

function PracticeRow({ practice }: { practice: LessonPractice }) {
  const { summary } = practice;
  const status = PRACTICE_STATUS[summary.status];
  return (
    <ActivityRow
      kind="PRACTICE"
      title={practice.title}
      type={practice.type}
      level={practice.level}
      levelColor={practice.levelColor}
      status={
        <>
          {status.label}
          {summary.attempts > 0 &&
            ` · ${summary.attempts} essai${summary.attempts > 1 ? "s" : ""}, meilleur ${summary.bestPercent} %`}
        </>
      }
      action={
        <ActionLink
          href={`/eleve/entrainements/${practice.id}`}
          label={status.action}
          variant={summary.status === "correction-seen" ? "outline" : "default"}
        />
      }
    />
  );
}

function ControlRow({ control }: { control: LessonControl }) {
  let status: ReactNode;
  let action: ReactNode = null;

  switch (control.status) {
    case "UPCOMING":
      status = control.opensAt
        ? `Ouvre le ${formatControlDate(control.opensAt)}`
        : "Pas encore ouvert";
      action = (
        <Button variant="secondary" disabled className="w-full sm:w-auto">
          Pas encore ouvert
        </Button>
      );
      break;
    case "TODO":
      status = control.closesAt
        ? `À rendre avant le ${formatControlDate(control.closesAt)}`
        : "À faire";
      action = (
        <ActionLink href={`/eleve/exercices/${control.id}`} label="Commencer le contrôle" />
      );
      break;
    case "CLOSED":
      status = "Clos";
      break;
    case "DONE":
      if (control.note !== null && control.coeficient !== null) {
        status = (
          <span className="inline-flex flex-wrap items-center gap-2">
            {control.isMissing ? "Non rendu avant la clôture" : "Rendu"}
            <NoteDisplay note={control.note} coeficient={control.coeficient} className="px-0 py-0" />
          </span>
        );
      } else if (control.pendingReview && control.canSeeCorrection) {
        status = "Rendu · en attente de correction";
      } else {
        status = control.closesAt
          ? `Rendu · note et correction le ${formatControlDate(control.closesAt)}`
          : "Rendu";
      }
      if (control.canSeeCorrection && control.studentExerciceId) {
        action = (
          <ActionLink
            href={`/eleve/exercices/correction/${control.studentExerciceId}`}
            label="Voir la correction"
            variant="outline"
          />
        );
      }
      break;
  }

  return (
    <ActivityRow
      kind="CONTROL"
      title={control.title}
      type={control.type}
      level={control.level}
      levelColor={control.levelColor}
      status={status}
      action={action}
    />
  );
}
