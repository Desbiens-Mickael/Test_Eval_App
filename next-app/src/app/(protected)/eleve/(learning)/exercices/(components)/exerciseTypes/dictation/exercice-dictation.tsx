"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitExerciceResponse } from "@/hooks/mutations/exercice/use-submit-exercice-response";
import { dictationWords } from "@/lib/dictation";
import { dictationAudioUrl } from "@/lib/dictation-audio-url";
import { DICTATION_ANSWER_MAX_LENGTH } from "@/shema-zod/exercice-corection.shema";
import { studentDictationContent } from "@/shema-zod/exercice.shema";
import { Headphones } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExerciseActions } from "../../exercise-actions";

interface ExerciceDictationProps {
  exerciceId: string;
  content: studentDictationContent;
}

const draftKey = (exerciceId: string) => `dictee:${exerciceId}`;

/** Brouillon gardé dans le navigateur : un rechargement ne fait pas perdre le texte */
const readDraft = (exerciceId: string) => {
  try {
    return localStorage.getItem(draftKey(exerciceId)) ?? "";
  } catch {
    return "";
  }
};

const writeDraft = (exerciceId: string, text: string | null) => {
  try {
    if (text) localStorage.setItem(draftKey(exerciceId), text);
    else localStorage.removeItem(draftKey(exerciceId));
  } catch {
    // Pas de brouillon possible (navigation privée…) : sans conséquence
  }
};

/**
 * Dictée : l'élève écoute l'enregistrement autant qu'il veut et écrit le texte.
 * La correction orthographique du navigateur est désactivée.
 */
export default function ExerciceDictation({ exerciceId, content }: ExerciceDictationProps) {
  const [text, setText] = useState("");
  const { mutateAsync, isPending, isSuccess, data } = useSubmitExerciceResponse();

  // Le brouillon n'est lu qu'après le premier rendu (pas de localStorage côté serveur)
  useEffect(() => {
    setText(readDraft(exerciceId));
  }, [exerciceId]);

  if (isSuccess && data?.data) {
    writeDraft(exerciceId, null);
    redirect(`/eleve/exercices/correction/${data.data.id}`);
  }

  const update = (value: string) => {
    setText(value);
    writeDraft(exerciceId, value);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Écris ta dictée avant de l'envoyer");
      return;
    }
    try {
      await mutateAsync({ exerciceId, response: { text } });
      // En mode exercice, l'élève reste sur la page pour un nouvel essai
      writeDraft(exerciceId, null);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la dictée :", error);
      toast.error("Une erreur est survenue lors de l'envoi de ta dictée");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section
        aria-labelledby="dictation-audio-title"
        className="space-y-3 rounded-xl border border-border/50 bg-card p-5 shadow-sm"
      >
        <h3 id="dictation-audio-title" className="flex items-center gap-2 font-medium">
          <Headphones className="h-5 w-5 text-primary" aria-hidden="true" />
          Écoute la dictée
        </h3>
        <p className="text-sm text-muted-foreground">
          Tu peux l&apos;écouter, la mettre en pause et revenir en arrière autant de fois que tu
          veux. Les accents et les majuscules comptent.
        </p>
        <audio controls preload="metadata" src={dictationAudioUrl(content.audio)} className="w-full">
          Ton navigateur ne lit pas l&apos;audio.
        </audio>
      </section>

      <div className="space-y-2 rounded-xl border border-border/50 bg-card p-5 shadow-sm">
        <Label htmlFor="dictation-answer" className="text-base font-medium">
          Ta dictée
        </Label>
        <Textarea
          id="dictation-answer"
          rows={10}
          maxLength={DICTATION_ANSWER_MAX_LENGTH}
          value={text}
          onChange={(e) => update(e.target.value)}
          // Pas d'aide du navigateur : c'est une dictée
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          aria-describedby="dictation-answer-count"
          className="text-base leading-relaxed"
        />
        <p id="dictation-answer-count" className="text-right text-xs tabular-nums text-muted-foreground">
          {text.length} / {DICTATION_ANSWER_MAX_LENGTH} caractères
        </p>
      </div>

      <ExerciseActions
        textCount="Mots écrits"
        filledCount={dictationWords(text).length}
        totalCount={content.words}
        isPending={isPending}
        onSubmit={handleSubmit}
        onReset={() => update("")}
      />
    </div>
  );
}
