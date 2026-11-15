import { Button } from "@/components/ui/button";
import { DashboardPeriod, TeacherDashboard } from "@/lib/teacher-dashboard";
import { BookPlus, Users, UsersRound } from "lucide-react";
import Link from "next/link";
import { PERIOD_LABELS, formatInteger, formatScore } from "./format";

const greeting = (now: Date) => {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Europe/Paris",
    }).format(now)
  );
  return hour >= 18 || hour < 5 ? "Bonsoir" : "Bonjour";
};

/** Phrase de synthèse écrite à partir des chiffres de la période */
const summarySentence = (dashboard: TeacherDashboard, period: DashboardPeriod) => {
  const { summary } = dashboard;
  const when =
    period === "tout" ? "Depuis le début" : `Ces ${PERIOD_LABELS[period]}`;
  if (summary.submissions === 0) {
    return `${when}, aucune copie n'a été rendue.`;
  }
  const parts = [
    `${when}, vos élèves ont rendu ${formatInteger(summary.submissions)} copie${summary.submissions > 1 ? "s" : ""}`,
    `avec une moyenne de ${formatScore(summary.average)}/20`,
  ];
  const help =
    summary.studentsToHelp > 0
      ? ` ${summary.studentsToHelp} élève${summary.studentsToHelp > 1 ? "s ont" : " a"} besoin d'un coup de pouce.`
      : " Aucun élève ne décroche.";
  return `${parts.join(", ")}.${help}`;
};

export default function DashboardHeader({
  teacherName,
  dashboard,
  period,
}: {
  teacherName: string | null;
  dashboard: TeacherDashboard;
  period: DashboardPeriod;
}) {
  const firstName = teacherName?.split(" ")[0];
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-4 pt-2 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium capitalize text-primary">{today}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
          {greeting(new Date())}
          {firstName ? ` ${firstName}` : ""}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {summarySentence(dashboard, period)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/eleves">
            <Users className="mr-2 h-4 w-4" />
            Élèves
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/groupes">
            <UsersRound className="mr-2 h-4 w-4" />
            Groupes
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/admin/lecons/creation">
            <BookPlus className="mr-2 h-4 w-4" />
            Nouvelle leçon
          </Link>
        </Button>
      </div>
    </div>
  );
}
