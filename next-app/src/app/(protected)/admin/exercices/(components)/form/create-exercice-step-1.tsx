"use client";

import CustomInput from "@/components/form/custom-input";
import CustomSelect from "@/components/form/custom-select";
import CustomTextarea from "@/components/form/custom-textarea";
import useGetAllExerciceLevels from "@/hooks/queries/use-get-all-exercice-levels";
import useGetAllExerciceType from "@/hooks/queries/use-get-all-exercice-type";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { Dispatch } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ComponentType } from "./dynamic-content-components";

interface createExerciceStep1Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  setType: Dispatch<React.SetStateAction<ComponentType>>;
  setLevel: Dispatch<React.SetStateAction<string>>;
}

export default function CreateExerciceStep1({
  form,
  setType,
  setLevel,
}: createExerciceStep1Props) {
  const {
    data: exerciceTypeData,
    isLoading: isExerciceTypeLoading,
    isError: isExerciceTypeError,
    error: exerciceTypeError,
  } = useGetAllExerciceType();

  const {
    data: levelsData,
    isLoading: isLevelsLoading,
    isError: isLevelsError,
    error: levelsError,
  } = useGetAllExerciceLevels();

  const handleSelectType = (value: string) => {
    if (exerciceTypeData?.data) {
      const type = exerciceTypeData?.data.find((item) => item.id === value);
      setType(type?.name as ComponentType);
    }
  };

  const handleSelectLevel = (value: string) => {
    if (levelsData) {
      const level = levelsData.find((item) => item.id === value);
      setLevel(level?.label!);
    }
  };

  if (isExerciceTypeLoading || isLevelsLoading) return <div>Loading...</div>;

  if (isExerciceTypeError) toast.error(exerciceTypeError.message);
  if (isLevelsError) toast.error(levelsError.message);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: -20, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col space-y-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-b pb-3 border-gray-200 dark:border-gray-700">
        Étape 1: Informations globales et type de l'exercice
      </h2>

      <CustomInput
        isRequired={true}
        label="Titre"
        name="title"
        control={form.control}
        placeholder="Titre de l'exercice"
        description="Le titre de l'exercice"
      />
      <div className="w-full flex gap-4">
        <CustomSelect
          isRequired={true}
          label="Niveau de difficulté"
          options={levelsData}
          name="exerciceLevelId"
          control={form.control}
          placeholder="Choisir le niveau de difficulté"
          description="Le niveau de difficulté de l'exercice"
          className="w-full"
          onChange={handleSelectLevel}
        />
        <CustomSelect
          isRequired={true}
          label="Type d'exercice"
          options={exerciceTypeData?.data}
          name="exerciceTypeId"
          control={form.control}
          placeholder="Choisir le type d'exercice"
          description="Le type d'exercice"
          className="w-full"
          onChange={handleSelectType}
        />
      </div>
      <CustomTextarea
        isRequired={true}
        label="Description"
        name="description"
        control={form.control}
        placeholder="Description de l'exercice"
        description="La description de l'exercice"
      />
    </motion.div>
  );
}
