"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentRole } from "@/hooks/use-current-role";
import { cn } from "@/lib/utils";
import { gapFillTextResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { isInputPosition } from "../../(lib)/utils";

interface ExerciseResultTextProps {
  content?: contentGapFillInput;
  response: gapFillTextResponseType;
}

export default function ExerciseResultGapFillText({
  content,
  response,
}: ExerciseResultTextProps) {
  const userRole = useCurrentRole();
  const isAdmin = userRole === "ADMIN";

  if (!content || !response) {
    return (
      <div className="text-center p-8 bg-card rounded-xl shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Info className="w-12 h-12 text-primary" />
          <p className="text-lg font-medium text-foreground">
            {isAdmin
              ? "Le contenu de cet exercice n'est plus disponible."
              : "Oups ! Cet exercice a été supprimé par votre professeur."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl shadow-lg p-6 space-y-6"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {"Correction de l'exercice"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isAdmin
              ? "Correction des réponses de l'élève"
              : "Vos réponses sont mises en évidence ci-dessous"}
          </p>
        </div>

        <Alert className="border-primary/20  text-primary">
          <Info className="h-5 w-5 stroke-primary" />
          <AlertTitle>Comment voir les corrections ?</AlertTitle>
          <AlertDescription className="flex items-center gap-1 text-foreground">
            Passez votre souris sur les réponses incorrectes{" "}
            <span className="p-0.5 rounded border bg-destructive/10 border-destructive/20 text-destructive">
              <XCircle className="h-4 w-4" />
            </span>{" "}
            pour afficher la bonne réponse.
          </AlertDescription>
        </Alert>
      </div>

      <div className="bg-card p-4 border rounded-lg whitespace-pre-line break-words leading-8 text-foreground">
        {content.text.map((word, index) => {
          if (!isInputPosition(index, content.answers)) {
            return <span key={index}>{word}</span>;
          }

          const correctAnswer = content.answers.find(
            (a) => a.position === index
          );
          const userAnswer = response[index];
          const isCorrect = userAnswer === correctAnswer?.answer;

          return (
            <span
              key={index}
              className={cn(
                "inline-flex flex-col items-start mx-0.5 relative group",
                isCorrect ? "text-success" : "text-destructive cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center h-5 px-1.5 py-3 rounded border transition-all duration-200",
                  isCorrect
                    ? "bg-success/10 dark:bg-success/20 border-success/20 dark:border-success/40"
                    : "bg-destructive/10 border-destructive/20 group-hover:bg-destructive/20"
                )}
              >
                {userAnswer || "____"}
                {isCorrect ? (
                  <CheckCircle2 className="ml-1 w-4 h-4" />
                ) : (
                  <XCircle className="ml-1 w-4 h-4" />
                )}
              </span>

              {!isCorrect && (
                <span className="absolute -top-8 left-0 z-10 bg-primary text-primary-foreground text-xs px-2 py-1.5 rounded whitespace-nowrap flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Bonne réponse :</span>
                  <span className="font-semibold ml-1.5">
                    {correctAnswer?.answer}
                  </span>
                </span>
              )}
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground pt-2">
        <div className="flex items-center space-x-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>Bonne réponse</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg">
          <XCircle className="w-4 h-4 text-destructive" />
          <span>Réponse incorrecte</span>
          <span className="ml-1.5 text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full">
            Survolez
          </span>
        </div>
      </div>
    </motion.div>
  );
}
