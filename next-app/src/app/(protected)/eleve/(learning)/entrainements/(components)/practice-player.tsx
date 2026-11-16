"use client";

import {
  PracticeAttemptResult,
  PracticeCorrectionView,
  getPracticeAction,
  revealPracticeCorrectionAction,
} from "@/actions/exercice-practice.action";
import Loader from "@/components/loader";
import { NoteDisplay } from "@/components/note-display";
import ReviewLessonLink from "@/components/lesson/review-lesson-link";
import PageTitle from "@/components/page-title";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PracticeModeContext } from "@/hooks/practice-mode-context";
import { toPercent } from "@/lib/student-progress";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, Eye, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ExerciseByType from "../../exercices/(components)/exercise-by-type";
import CorrectionByType from "../../exercices/correction/(components)/correction-by-type";

type Phase =
  | { name: "play" }
  | { name: "result"; result: PracticeAttemptResult }
  | { name: "correction"; correction: PracticeCorrectionView };

/**
 * Exercice non noté : l'élève fait des essais et ne voit que sa note.
 * Il peut recommencer autant qu'il veut, ou afficher la correction, ce qui
 * met fin aux essais (il est prévenu avant).
 */
export default function PracticePlayer({ exerciceId }: { exerciceId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>({ name: "play" });
  const [isRevealing, setIsRevealing] = useState(false);

  // Rechargé à chaque essai : les cartes sont mélangées à nouveau
  const { data, isLoading } = useQuery({
    queryKey: ["practice", exerciceId, round],
    queryFn: async () => {
      const response = await getPracticeAction(exerciceId);
      if (response.error) toast.error(response.error);
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && !data) router.replace("/eleve/entrainements");
  }, [isLoading, data, router]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleResult = useCallback(
    (result: PracticeAttemptResult) => {
      setPhase({ name: "result", result });
      queryClient.invalidateQueries({ queryKey: ["practice-list"] });
      scrollTop();
    },
    [queryClient]
  );
  const practiceMode = useMemo(() => ({ onResult: handleResult }), [handleResult]);

  const restart = () => {
    setPhase({ name: "play" });
    setRound((n) => n + 1);
    scrollTop();
  };

  const revealCorrection = async () => {
    setIsRevealing(true);
    try {
      const response = await revealPracticeCorrectionAction(exerciceId);
      if (response.error || !response.correction) {
        toast.error(response.error ?? "Impossible d'afficher la correction");
        return;
      }
      setPhase({ name: "correction", correction: response.correction });
      queryClient.invalidateQueries({ queryKey: ["practice-list"] });
      // Recharge l'historique des essais affiché sous la correction
      queryClient.invalidateQueries({ queryKey: ["practice", exerciceId] });
      scrollTop();
    } finally {
      setIsRevealing(false);
    }
  };

  if (isLoading && !data) return <Loader />;
  if (!data) return null;

  const { exercice, summary, attempts } = data;
  const correction =
    phase.name === "correction" ? phase.correction : data.correction;

  return (
    <>
      <PageTitle title={exercice.title} />

      <div className="mx-auto mb-4 flex w-full max-w-3xl">
        <ReviewLessonLink lesson={data.lesson} className="max-w-full" />
      </div>

      <div
        role="note"
        className="mx-auto mb-8 flex w-full max-w-3xl items-start gap-3 rounded-xl border border-sky-300 bg-sky-50 p-4 text-sky-950 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white">
          <Dumbbell className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="text-sm">
          <span className="block font-semibold">Exercice : pas de note dans ta moyenne</span>
          {correction
            ? "Tu as vu la correction : cet exercice est terminé."
            : "Réessaie autant de fois que tu veux. Quand tu te sens prêt, tu peux afficher la correction, mais tu ne pourras plus faire d'essai ensuite."}
        </p>
      </div>

      {correction ? (
        <CorrectionView correction={correction} attempts={attempts} />
      ) : phase.name === "result" ? (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center shadow-sm"
        >
          <h2 className="text-lg font-semibold">Essai n° {phase.result.attempt}</h2>
          <NoteDisplay
            note={phase.result.note}
            coeficient={phase.result.coeficient}
            className="text-2xl font-bold"
          />
          <p className="text-sm text-muted-foreground">
            {phase.result.note === phase.result.coeficient
              ? "Sans faute, bravo !"
              : `Ton meilleur essai : ${phase.result.bestPercent} %. Tu peux réessayer pour t'améliorer.`}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={restart} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Recommencer
            </Button>
            <RevealButton onConfirm={revealCorrection} isPending={isRevealing} />
          </div>
        </motion.section>
      ) : (
        <div className="space-y-6">
          {summary.attempts > 0 && (
            <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm">
              <span>
                Essai n° {summary.attempts + 1} · meilleur résultat{" "}
                <span className="font-semibold">{summary.bestPercent} %</span>
              </span>
              <RevealButton onConfirm={revealCorrection} isPending={isRevealing} size="sm" />
            </div>
          )}
          <p className="mx-auto max-w-3xl whitespace-pre-wrap break-words px-4 text-foreground/90 sm:px-6">
            {exercice.description}
          </p>
          <PracticeModeContext.Provider value={practiceMode}>
            <ExerciseByType key={round} exercice={exercice} />
          </PracticeModeContext.Provider>
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/eleve/entrainements">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Mes exercices
          </Link>
        </Button>
      </div>
    </>
  );
}

/** « Voir la correction », avec confirmation : les essais seront terminés */
function RevealButton({
  onConfirm,
  isPending,
  size,
}: {
  onConfirm: () => void;
  isPending: boolean;
  size?: "sm";
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={size} className="gap-2" disabled={isPending}>
          <Eye className="h-4 w-4" aria-hidden="true" />
          Voir la correction
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voir la correction ?</AlertDialogTitle>
          <AlertDialogDescription>
            Si tu affiches la correction, tu ne pourras plus faire d&apos;essai sur cet
            exercice. Tu peux d&apos;abord réessayer autant de fois que tu veux.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuer à m&apos;entraîner</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Voir la correction</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CorrectionView({
  correction,
  attempts,
}: {
  correction: PracticeCorrectionView;
  attempts: { note: number; coeficient: number; createdAt: string }[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <section className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm">
        <h2 className="text-lg font-semibold">Correction de ton dernier essai</h2>
        <NoteDisplay
          note={correction.note}
          coeficient={correction.coeficient}
          className="text-2xl font-bold"
        />
        {attempts.length > 0 && (
          <ol className="flex flex-wrap justify-center gap-2" aria-label="Tes essais">
            {attempts.map((a, i) => {
              const percent = toPercent(a.note, a.coeficient);
              return (
                <li
                  key={a.createdAt}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs tabular-nums",
                    i === attempts.length - 1 && "border-primary font-semibold"
                  )}
                >
                  Essai {i + 1} : {percent} %
                </li>
              );
            })}
          </ol>
        )}
      </section>
      <CorrectionByType
        type={correction.type}
        content={correction.content}
        response={correction.response}
      />
    </motion.div>
  );
}
