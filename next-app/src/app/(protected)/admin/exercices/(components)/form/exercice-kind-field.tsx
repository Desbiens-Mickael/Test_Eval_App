"use client";

import { EXERCICE_KIND_LABELS } from "@/components/exercice-kind-badge";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { EXERCICE_KINDS, createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { Check } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

/** Choix entre exercice (non noté) et contrôle (noté) */
export default function ExerciceKindField({
  form,
  isEditing,
  practiceDisabledReason,
}: {
  form: UseFormReturn<createExerciceFormInput>;
  isEditing: boolean;
  /** Raison pour laquelle le format choisi ne peut pas être un exercice */
  practiceDisabledReason?: string;
}) {
  return (
    <FormField
      control={form.control}
      name="kind"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Usage de l&apos;exercice <span className="text-destructive">*</span>
          </FormLabel>
          <FormControl>
            <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
              {EXERCICE_KINDS.map((kind) => {
                const { label, description, icon: Icon } = EXERCICE_KIND_LABELS[kind];
                const selected = field.value === kind;
                const disabled = kind === "PRACTICE" && !!practiceDisabledReason;
                return (
                  <button
                    key={kind}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={disabled}
                    onClick={() => field.onChange(kind)}
                    className={cn(
                      "relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                      disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{label}</span>
                      <span className="block text-sm text-muted-foreground">{description}</span>
                    </span>
                    {selected && (
                      <Check className="absolute right-3 top-3 h-4 w-4 text-primary" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormDescription>
            {practiceDisabledReason ??
              (isEditing
              ? "L'usage ne peut plus être changé une fois que des élèves l'ont fait."
              : "Un exercice permet à l'élève de s'entraîner sans être noté ; un contrôle compte dans sa moyenne.")}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
