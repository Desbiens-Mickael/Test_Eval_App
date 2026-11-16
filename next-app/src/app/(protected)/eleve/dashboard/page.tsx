import { getStudentProgressAction } from "@/actions/student-progress.action";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import BadgesSection from "./(components)/badges-section";
import ProgressHeader from "./(components)/progress-header";
import ProgressSummary from "./(components)/progress-summary";
import { RecentResults, ResultsChart } from "./(components)/results-history";
import SubjectProgress from "./(components)/subject-progress";

export const metadata: Metadata = {
  title: "Ma progression",
};

// La progression change à chaque exercice rendu : jamais de cache
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const response = await getStudentProgressAction();

  if ("error" in response) {
    return (
      <div className="rounded-xl border bg-card p-6 text-muted-foreground">
        {response.error}
      </div>
    );
  }

  const { studentName, progress } = response.data;
  const toDo = progress.summary.assigned - progress.summary.assignedDone;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <ProgressHeader studentName={studentName} progress={progress} />
        {toDo > 0 && (
          <Button asChild className="self-start lg:self-auto">
            <Link href="/eleve/exercices">
              <ListTodo className="mr-2 h-4 w-4" aria-hidden="true" />
              {toDo} exercice{toDo > 1 ? "s" : ""} à faire
            </Link>
          </Button>
        )}
      </div>

      <ProgressSummary progress={progress} />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ResultsChart history={progress.history} />
        </div>
        <div className="xl:col-span-2">
          <SubjectProgress bySubject={progress.bySubject} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <BadgesSection badges={progress.badges} />
        </div>
        <div className="xl:col-span-2">
          <RecentResults history={progress.history} />
        </div>
      </div>
    </div>
  );
}
