import { getChildProgressAction } from "@/actions/parent.action";
import { getExercisesToDoAction } from "@/actions/exercice.action";
import BadgesSection from "@/app/(protected)/eleve/dashboard/(components)/badges-section";
import ProgressSummary from "@/app/(protected)/eleve/dashboard/(components)/progress-summary";
import {
  RecentResults,
  ResultsChart,
} from "@/app/(protected)/eleve/dashboard/(components)/results-history";
import SubjectProgress from "@/app/(protected)/eleve/dashboard/(components)/subject-progress";
import { formatRate } from "@/app/(protected)/eleve/dashboard/(components)/format";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChildCopies from "../../(components)/child-copies";
import UpcomingControls from "../../(components)/upcoming-controls";

export const metadata: Metadata = {
  title: "Suivi de mon enfant",
};

// La progression change à chaque copie rendue : jamais de cache
export const dynamic = "force-dynamic";

/** Suivi d'un enfant par son parent, en lecture seule */
export default async function ParentChildPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [progressResponse, toDoResponse] = await Promise.all([
    getChildProgressAction(studentId),
    getExercisesToDoAction(undefined, studentId),
  ]);
  // Enfant inconnu ou non suivi par ce parent
  if ("error" in progressResponse) notFound();

  const { studentName, progress } = progressResponse.data;
  const firstName = studentName.split(" ")[0];
  const { summary } = progress;
  const controls = (("data" in toDoResponse && toDoResponse.data) || []).map((c) => ({
    id: c.id,
    title: c.title,
    subject: c.lesson.LessonSubject?.label ?? "",
    opensAt: c.opensAt,
    closesAt: c.closesAt,
  }));

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="pt-2">
        <Link href="/parent" className="text-sm font-medium text-primary hover:underline">
          ← Mes enfants
        </Link>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">{studentName}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {summary.done === 0
            ? `${firstName} n'a pas encore de contrôle corrigé.`
            : `${firstName} a fait ${summary.done} contrôle${summary.done > 1 ? "s" : ""}, avec ${formatRate(
                summary.successRate
              )} de réussite en moyenne.`}{" "}
          Vous suivez sa progression en lecture seule.
        </p>
      </div>

      <ProgressSummary progress={progress} forParent />

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <ResultsChart history={progress.history} forParent />
        </div>
        <div className="xl:col-span-2">
          <UpcomingControls childName={studentName} controls={controls} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <SubjectProgress bySubject={progress.bySubject} forParent />
        </div>
        <div className="xl:col-span-2">
          <RecentResults
            history={progress.history}
            allHref={`/parent/enfants/${studentId}#copies`}
            copyBasePath={`/parent/enfants/${studentId}/copies/`}
            forParent
          />
        </div>
      </div>

      <BadgesSection badges={progress.badges} forParent />

      <section id="copies" aria-labelledby="child-copies-title" className="scroll-mt-20">
        <h2 id="child-copies-title" className="mb-4 text-xl font-semibold">
          Toutes les copies
        </h2>
        <ChildCopies studentId={studentId} />
      </section>
    </div>
  );
}
