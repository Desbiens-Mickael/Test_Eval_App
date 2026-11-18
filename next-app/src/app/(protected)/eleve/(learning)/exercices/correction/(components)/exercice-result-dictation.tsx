import { alignDictation } from "@/lib/dictation";
import { dictationAudioUrl } from "@/lib/dictation-audio-url";
import { dictationResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentDictationInput } from "@/shema-zod/exercice.shema";

interface ExerciceResultDictationProps {
  content: contentDictationInput;
  response: dictationResponseType;
}

/**
 * Correction d'une dictée : la copie mot à mot, chaque faute signalée
 * (mot faux, oublié ou en trop), puis le texte attendu.
 */
export default function ExerciceResultDictation({ content, response }: ExerciceResultDictationProps) {
  const answer = typeof response?.text === "string" ? response.text : "";
  const steps = alignDictation(content.text, answer);
  const mistakes = steps.filter((s) => s.kind !== "ok").length;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 sm:px-0">
      <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-medium">Ta dictée corrigée</h3>
          <p className="text-sm text-muted-foreground">
            {mistakes === 0
              ? "Aucune faute, bravo !"
              : `${mistakes} faute${mistakes > 1 ? "s" : ""} sur ${
                  steps.filter((s) => s.kind !== "extra").length
                } mots`}
          </p>
        </div>

        <p className="text-base leading-loose">
          {steps.map((step, index) => {
            // Pas d'espace après une élision (« l'herbe »)
            const previous = steps[index - 1];
            const previousWord = previous ? (previous.kind === "missing" ? previous.expected : previous.got) : "";
            const space = index > 0 && !previousWord.endsWith("'") ? " " : "";
            switch (step.kind) {
              case "ok":
                return <span key={index}>{space + step.got}</span>;
              case "wrong":
                return (
                  <span key={index}>
                    {space}
                    <del className="rounded bg-destructive/10 px-0.5 text-destructive">
                      <span className="sr-only">tu as écrit </span>
                      {step.got}
                    </del>{" "}
                    <ins className="rounded bg-success/10 px-0.5 font-medium text-success no-underline">
                      <span className="sr-only">au lieu de </span>
                      {step.expected}
                    </ins>
                  </span>
                );
              case "missing":
                return (
                  <span key={index}>
                    {space}
                    <ins className="rounded border border-dashed border-success/50 px-0.5 font-medium text-success no-underline">
                      <span className="sr-only">mot oublié : </span>
                      {step.expected}
                    </ins>
                  </span>
                );
              case "extra":
                return (
                  <span key={index}>
                    {space}
                    <del className="rounded bg-destructive/10 px-0.5 text-destructive">
                      <span className="sr-only">mot en trop : </span>
                      {step.got}
                    </del>
                  </span>
                );
            }
          })}
        </p>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden="true">
          <li>
            <del className="text-destructive">barré</del> : ce que tu as écrit
          </li>
          <li>
            <span className="font-medium text-success">vert</span> : le bon mot
          </li>
          <li>
            <span className="rounded border border-dashed border-success/50 px-0.5 text-success">pointillés</span>{" "}
            : mot oublié
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Les accents et les majuscules comptent, la ponctuation n&apos;est pas notée.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-medium">Le texte de la dictée</h3>
        <audio controls preload="metadata" src={dictationAudioUrl(content.audio)} className="w-full">
          Ton navigateur ne lit pas l&apos;audio.
        </audio>
        <p className="whitespace-pre-wrap leading-relaxed">{content.text}</p>
      </section>
    </div>
  );
}
