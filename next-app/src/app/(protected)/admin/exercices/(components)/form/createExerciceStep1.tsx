"use client";

import CustomInput from "@/components/form/custom-input";
import CustomSelect from "@/components/form/custom-select";
import useGetAllExerciceLevels from "@/hooks/queries/use-get-all-exercice-levels";
import useGetAllExerciceType from "@/hooks/queries/use-get-all-exercice-type";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { motion } from "framer-motion";
import { Dispatch } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface createExerciceStep1Props {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  setType: Dispatch<React.SetStateAction<string>>;
}

export default function CreateExerciceStep1({
  form,
  setType,
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
      setType(type?.name!);
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
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Étape 1</h2>

      <CustomInput
        label="Titre"
        name="title"
        control={form.control}
        placeholder="Titre de l'exercice"
        description="Le titre de l'exercice"
      />
      <CustomSelect
        label="Niveau de difficulté"
        options={levelsData}
        name="exerciceLevelId"
        control={form.control}
        placeholder="Choisir le niveau de difficulté"
        description="Le niveau de difficulté de l'exercice"
      />
      <CustomSelect
        label="Type d'exercice"
        options={exerciceTypeData?.data}
        name="exerciceTypeId"
        control={form.control}
        placeholder="Choisir le type d'exercice"
        description="Le type d'exercice"
        onChange={handleSelectType}
      />
    </motion.div>
  );
}
