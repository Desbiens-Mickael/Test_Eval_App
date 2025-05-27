"use client";

import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { GapFillContent } from "./gap-fill-content";
import { useExerciseGapFill } from "./use-exercise-gap-fll";
import { ExerciseActions } from "../../exercise-actions";

interface ExerciseGapFillTextProps extends baseResponseExercice {
  content: contentGapFillInput;
}

export default function ExerciseGapFillText({
  exerciceId,
  content,
  level,
}: ExerciseGapFillTextProps) {
  const { inputs, isPending, handleInputChange, handleReset, handleSubmit } =
    useExerciseGapFill({ exerciceId, content, level });

  // Gestion des animations des champs de saisie
  useEffect(() => {
    const inputs = document.querySelectorAll("input[data-variants]");

    const handleFocus = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const variants = JSON.parse(input.dataset.variants || "{}");
      input.style.transform = `scale(${variants.focus?.scale || 1})`;
      input.style.borderColor = variants.focus?.borderColor || "";
      input.style.boxShadow = variants.focus?.boxShadow || "";
    };

    const handleBlur = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const variants = JSON.parse(input.dataset.variants || "{}");
      input.style.transform = `scale(${variants.initial?.scale || 1})`;
      input.style.borderColor = variants.initial?.borderColor || "";
      input.style.boxShadow = variants.initial?.boxShadow || "";
    };

    const handleMouseEnter = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (document.activeElement !== input) {
        const variants = JSON.parse(input.dataset.variants || "{}");
        input.style.transform = `scale(${variants.hover?.scale || 1})`;
        input.style.borderColor = variants.hover?.borderColor || "";
      }
    };

    const handleMouseLeave = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (document.activeElement !== input) {
        const variants = JSON.parse(input.dataset.variants || "{}");
        input.style.transform = `scale(${variants.initial?.scale || 1})`;
        input.style.borderColor = variants.initial?.borderColor || "";
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
      input.addEventListener("mouseenter", handleMouseEnter);
      input.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
        input.removeEventListener("mouseenter", handleMouseEnter);
        input.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [content.text]);

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GapFillContent
        content={content}
        inputs={inputs}
        onInputChange={handleInputChange}
      />

      <ExerciseActions
        filledCount={Object.keys(inputs).length}
        totalCount={content.answers.length}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isPending={isPending}
        disabled={Object.keys(inputs).length === 0}
      />
    </motion.div>
  );
}
