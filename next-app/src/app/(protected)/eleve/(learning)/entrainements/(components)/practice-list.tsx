"use client";

import { getPracticeListAction } from "@/actions/exercice-practice.action";
import { container, item } from "@/animations/exercice-and-lesson-list";
import SubjectLayout from "@/components/subject-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PracticeSummary } from "@/lib/practice";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Dumbbell, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LearningDashboard } from "../../(components)/learning-dashboard";
import ExerciceListSkeleton from "../../exercices/(components)/exercice-list-skeleton";
import ExerciceTypeBadge from "../../exercices/(components)/exercice-type-badge";

const STATUS: Record<PracticeSummary["status"], { label: string; action: string }> = {
  "not-started": { label: "Pas encore commencé", action: "Commencer" },
  "in-progress": { label: "En cours", action: "Réessayer" },
  "correction-seen": { label: "Terminé · correction vue", action: "Voir la correction" },
};

export default function PracticeList() {
  const [subject, setSubject] = useState<string | undefined>();
  const { data, isLoading } = useQuery({
    queryKey: ["practice-list", subject],
    queryFn: async () => {
      const response = await getPracticeListAction(subject);
      if (response.error) toast.error(response.error);
      return response.data ?? [];
    },
  });

  return (
    <LearningDashboard
      title="Mes exercices"
      description="Exerce-toi sans être noté : tu peux réessayer autant de fois que tu veux."
      selectedSubject={subject}
      onSubjectChange={setSubject}
    >
      {isLoading ? (
        <ExerciceListSkeleton count={4} />
      ) : !data?.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold">Aucun exercice</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            {subject
              ? `Ton professeur ne t'a pas encore donné d'exercice en ${subject}.`
              : "Ton professeur ne t'a pas encore donné d'exercice."}
          </p>
        </div>
      ) : (
        <motion.ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {data.map((practice) => {
            const { summary } = practice;
            const status = STATUS[summary.status];
            const Icon =
              summary.status === "correction-seen"
                ? Eye
                : summary.status === "in-progress"
                  ? RotateCcw
                  : Dumbbell;
            return (
              <motion.li key={practice.id} variants={item} className="h-full">
                <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-center text-lg">{practice.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col items-center gap-3 pb-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      <SubjectLayout label={practice.subject} color={practice.subjectColor} />
                      <ExerciceTypeBadge type={practice.type} />
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        summary.status === "correction-seen" ? "text-muted-foreground" : "text-primary"
                      )}
                    >
                      {status.label}
                    </p>
                    {summary.attempts > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {summary.attempts} essai{summary.attempts > 1 ? "s" : ""} · meilleur{" "}
                        <span className="font-semibold text-foreground">{summary.bestPercent} %</span>
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    <Button
                      asChild
                      variant={summary.status === "correction-seen" ? "outline" : "default"}
                      className="w-full gap-2"
                    >
                      <Link href={`/eleve/entrainements/${practice.id}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {status.action}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </LearningDashboard>
  );
}
