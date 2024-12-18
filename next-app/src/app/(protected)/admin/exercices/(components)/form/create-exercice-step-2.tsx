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
import { ComponentType, DynamicComponent } from "./dynamic-content-components";

interface CreateExerciceStep2Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  type: ComponentType;
}

export default function CreateExerciceStep2({
  form,
  type,
}: CreateExerciceStep2Props) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 border-gray-200 dark:border-gray-700">
        {`Étape 2: Contenu de l'exercice de type : [${type}]`}
      </h2>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Contenu de l'exercice <span className="text-red-500">*</span>
            </FormLabel>
            <Controller
              control={form.control}
              name="content"
              render={({ field }) => (
                <DynamicComponent
                  type={type}
                  initialValue={field.value}
                  onChange={(newContent) => {
                    field.onChange(newContent); // Synchronise avec react-hook-form
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
