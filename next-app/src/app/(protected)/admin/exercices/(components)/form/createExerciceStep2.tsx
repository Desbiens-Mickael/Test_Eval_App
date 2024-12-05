"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { Controller, UseFormReturn } from "react-hook-form";

interface CreateExerciceStep2Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
}

export default function CreateExerciceStep2({
  form,
}: CreateExerciceStep2Props) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Étape 2: Contenu de l'exercice</h2>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contenu de l'exercice</FormLabel>
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <div
                  onChange={(newContent) => {
                    field.onChange(newContent); // Synchronise avec react-hook-form
                    console.log(newContent);
                  }}
                />
              )}
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
