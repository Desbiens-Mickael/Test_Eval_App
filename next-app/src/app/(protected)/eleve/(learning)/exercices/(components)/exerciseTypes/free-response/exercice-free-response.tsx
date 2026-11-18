"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitExerciceResponse } from "@/hooks/mutations/exercice/use-submit-exercice-response";
import { FREE_RESPONSE_ANSWER_MAX_LENGTH } from "@/shema-zod/exercice-corection.shema";
import { studentFreeResponseContent } from "@/shema-zod/exercice.shema";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExerciseActions } from "../../exercise-actions";

interface ExerciceFreeResponseProps {
  exerciceId: string;
  content: studentFreeResponseContent;
}

const draftKey = (exerciceId: string) => `reponse-libre:${exerciceId}`;

/** Brouillon gardé dans le navigateur : un rechargement ne fait pas perdre le texte */
const readDraft = (exerciceId: string, count: number): string[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey(exerciceId)) ?? "null");
    if (Array.isArray(saved) && saved.length === count && saved.every((a) => typeof a === "string")) {
      return saved;
    }
  } catch {
    // Stockage indisponible ou brouillon illisible : on repart de zéro
  }
  return Array(count).fill("");
};

const writeDraft = (exerciceId: string, answers: string[] | null) => {
  try {
    if (answers) localStorage.setItem(draftKey(exerciceId), JSON.stringify(answers));
    else localStorage.removeItem(draftKey(exerciceId));
  } catch {
    // Pas de brouillon possible (navigation privée…) : sans conséquence
  }
};

/**
 * Contrôle « Réponse libre » : l'élève rédige une réponse par question.
 * La copie est corrigée ensuite par le professeur.
 */
export default function ExerciceFreeResponse({ exerciceId, content }: ExerciceFreeResponseProps) {
  const [answers, setAnswers] = useState<string[]>(() => Array(content.length).fill(""));
  // Un premier envoi avec des réponses vides demande confirmation
  const [confirmEmpty, setConfirmEmpty] = useState(false);
  const { mutateAsync, isPending, isSuccess, data } = useSubmitExerciceResponse();

  // Le brouillon n'est lu qu'après le premier rendu (pas de localStorage côté serveur)
  useEffect(() => {
    setAnswers(readDraft(exerciceId, content.length));
  }, [exerciceId, content.length]);

  if (isSuccess && data?.data) {
    writeDraft(exerciceId, null);
    redirect(`/eleve/exercices/correction/${data.data.id}`);
  }

  const update = (index: number, value: string) => {
    setConfirmEmpty(false);
    const next = answers.map((a, i) => (i === index ? value : a));
    setAnswers(next);
    writeDraft(exerciceId, next);
  };

  const filledCount = answers.filter((a) => a.trim() !== "").length;
  const totalPoints = content.reduce((sum, q) => sum + q.points, 0);

  const handleSubmit = async () => {
    if (filledCount < content.length && !confirmEmpty) {
      setConfirmEmpty(true);
      toast.warning("Certaines réponses sont vides", {
        description: "Clique de nouveau sur « Soumettre » pour envoyer ta copie quand même.",
      });
      return;
    }
    try {
      await mutateAsync({
        exerciceId,
        response: answers.map((answer, index) => ({ index, answer: answer.trim() })),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de la copie :", error);
      toast.error("Une erreur est survenue lors de l'envoi de ta copie");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-muted-foreground">
        Rédige ta réponse à chaque question. Ton professeur corrigera ta copie : ta note
        apparaîtra une fois qu&apos;elle sera corrigée. Total : {totalPoints} points.
      </p>

      {content.map((q, index) => {
        const isEmpty = confirmEmpty && answers[index].trim() === "";
        return (
          <div
            key={index}
            className={`space-y-3 rounded-xl border bg-card p-5 shadow-sm ${
              isEmpty ? "border-destructive/50" : "border-border/50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <Label
                htmlFor={`free-answer-${index}`}
                className="flex items-start gap-3 text-base font-medium leading-relaxed"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="whitespace-pre-wrap pt-1">{q.question}</span>
              </Label>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                {q.points} pt{q.points > 1 ? "s" : ""}
              </span>
            </div>
            <Textarea
              id={`free-answer-${index}`}
              rows={5}
              maxLength={FREE_RESPONSE_ANSWER_MAX_LENGTH}
              value={answers[index] ?? ""}
              onChange={(e) => update(index, e.target.value)}
              aria-describedby={`free-answer-count-${index}`}
              aria-invalid={isEmpty}
            />
            <p
              id={`free-answer-count-${index}`}
              className="text-right text-xs tabular-nums text-muted-foreground"
            >
              {(answers[index] ?? "").length} / {FREE_RESPONSE_ANSWER_MAX_LENGTH} caractères
            </p>
          </div>
        );
      })}

      <ExerciseActions
        textCount="Questions répondues"
        filledCount={filledCount}
        totalCount={content.length}
        isPending={isPending}
        onSubmit={handleSubmit}
        onReset={() => {
          setAnswers(Array(content.length).fill(""));
          setConfirmEmpty(false);
          writeDraft(exerciceId, null);
        }}
      />
    </div>
  );
}
