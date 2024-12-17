"use client";

import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { ComponentType, DynamicComponent } from "./dynamic-content-components";

interface CreateEXerciceSTep3Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  type: ComponentType;
  level: string;
}

export default function CreateEXerciceSTep3({
  form,
  type,
  level,
}: CreateEXerciceSTep3Props) {
  const content = form.getValues("content");

  const ContentCardForm = dynamic(
    () => import("./exerciceType/content-card/content-card-form"),
    { ssr: false }
  );

  const TrueFalseForm = dynamic(
    () => import("./exerciceType/true-or-false/content-true-or-false-form"),
    { ssr: false }
  );

  // Vérification et assertion du type de contenu
  return (
    <motion.div
      initial={{ x: 20, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 border-gray-200 dark:border-gray-700">
        Étape 3: Récapitulatif et création de l'exercice
      </h2>

      <div className="w-fit mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {form.getValues("title")}
          </h3>
          <p className="w-[80%] text-gray-600 dark:text-gray-400">
            {form.getValues("description")}
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Type:
            </span>
            <p className="text-gray-800 dark:text-gray-200">{type}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Niveau:
            </span>
            <p className="text-gray-800 dark:text-gray-200">{level}</p>
          </div>
        </div>
        <div className="space-y-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300 block">
            Contenu:
          </span>
          <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <DynamicComponent
              initialValue={content}
              type={type}
              isEditing={false}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
