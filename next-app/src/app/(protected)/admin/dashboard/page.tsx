import { getTeacherDashboardAction } from "@/actions/dashboard.action";
import { Metadata } from "next";
import { ActivityChart, ScoreDistribution } from "./(components)/activity-section";
import {
  GroupProgress,
  SubjectAverages,
  WorkRhythm,
} from "./(components)/breakdown-section";
import DashboardFilters from "./(components)/dashboard-filters";
import DashboardHeader from "./(components)/dashboard-header";
import {
  DashboardContent,
  DashboardTransition,
} from "./(components)/dashboard-transition";
import {
  HardestExercises,
  RecentSubmissions,
  StudentsToHelp,
} from "./(components)/follow-up-section";
import GettingStarted from "./(components)/getting-started";
import SummaryCards from "./(components)/summary-cards";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

// Les chiffres dépendent de l'heure et des dernières copies : jamais de cache
export const dynamic = "force-dynamic";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { periode?: string; groupe?: string };
}) {
  const response = await getTeacherDashboardAction(
    searchParams.periode,
    searchParams.groupe
  );

  if ("error" in response) {
    return (
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        {response.error}
      </div>
    );
  }

  const { teacherName, groupOptions, dashboard } = response.data;
  const { summary } = dashboard;
  const isSetUp = summary.totalStudents > 0 && groupOptions.length > 0 && summary.assigned > 0;

  return (
    <DashboardTransition>
      <div className="flex flex-col gap-6 pb-10">
        <DashboardHeader
          teacherName={teacherName}
          dashboard={dashboard}
          period={dashboard.period}
        />

        {!isSetUp && (
          <GettingStarted
            hasStudents={summary.totalStudents > 0}
            hasGroups={groupOptions.length > 0}
            hasAssignments={summary.assigned > 0}
          />
        )}

        <DashboardFilters
          period={dashboard.period}
          groupId={dashboard.groupId}
          groupOptions={groupOptions}
        />

        <DashboardContent>
          <SummaryCards
            summary={summary}
            weeklyTrend={dashboard.weeklyTrend}
            period={dashboard.period}
          />

          <div className="grid gap-4 xl:grid-cols-3">
            <ActivityChart activity={dashboard.activity} period={dashboard.period} />
            <ScoreDistribution distribution={dashboard.distribution} />
          </div>

          {/* À traiter en priorité */}
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <StudentsToHelp students={dashboard.studentsToHelp} />
            <HardestExercises exercises={dashboard.hardestExercises} />
            <GroupProgress groups={dashboard.groups} />
          </div>

          {/* Comprendre */}
          <div className="grid gap-4 lg:grid-cols-2">
            <SubjectAverages bySubject={dashboard.bySubject} />
            <WorkRhythm rhythm={dashboard.rhythm} />
          </div>

          <RecentSubmissions recent={dashboard.recent} />
        </DashboardContent>
      </div>
    </DashboardTransition>
  );
}
