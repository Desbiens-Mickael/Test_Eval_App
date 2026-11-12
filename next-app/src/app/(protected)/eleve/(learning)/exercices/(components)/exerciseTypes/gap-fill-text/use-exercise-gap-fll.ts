"use client";

import { useState, useCallback, useEffect } from "react";
import { useAddExerciceResponse } from "@/hooks/mutations/exercice/use-add-exercice-response";
import { gapFillTextResponseType } from "@/shema-zod/exercice-corection.shema";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export const useExerciseGapFill = ({
  exerciceId,
  content,
  level,
}: {
  exerciceId: string;
  content: contentGapFillInput;
  level: baseResponseExercice["level"];
}) => {
  const [inputs, setInputs] = useState<gapFillTextResponseType>({});

  const {
    mutateAsync: addExerciceResponse,
    isPending,
    isSuccess,
    data,
  } = useAddExerciceResponse();

  const handleInputChange = useCallback((pos: number, value: string) => {
    setInputs((prev) => ({ ...prev, [pos]: value.trim() }));
  }, []);

  const handleReset = useCallback(() => {
    setInputs({});
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      // La note est calculée côté serveur
      await addExerciceResponse({
        exerciceId,
        response: inputs,
      });
    } catch (error) {
      toast.error("Une erreur est survenue lors de la validation de l'exercice");
      console.error("Error checking answers:", error);
    }
  }, [addExerciceResponse, exerciceId, inputs]);

  // Gestion de la redirection après succès
  useEffect(() => {
    if (isSuccess && data?.data) {
      redirect(`/eleve/exercices/correction/${data.data.id}`);
    }
  }, [isSuccess, data]);

  return {
    inputs,
    isPending,
    handleInputChange,
    handleReset,
    handleSubmit,
  };
};
