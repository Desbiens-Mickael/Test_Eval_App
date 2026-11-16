"use client";

import { motion } from "framer-motion";
import { AlertCircle, Award, BookOpen, Type } from "lucide-react";
import { Dispatch } from "react";
import { UseFormReturn } from "react-hook-form";

import CustomInput from "@/components/form/custom-input";
import CustomSelect from "@/components/form/custom-select";
import CustomTextarea from "@/components/form/custom-textarea";
import Loader from "@/components/loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetAllExerciceLevels from "@/hooks/queries/use-get-all-exercice-levels";
import useGetAllExerciceType from "@/hooks/queries/use-get-all-exercice-type";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { ComponentType } from "./dynamic-content-components";
import ExerciceKindBadge from "@/components/exercice-kind-badge";
import ExerciceKindField from "./exercice-kind-field";

interface createExerciceStep1Props {
  form: UseFormReturn<createExerciceFormInput>;
  setType: Dispatch<React.SetStateAction<ComponentType>>;
  setLevel: Dispatch<React.SetStateAction<string>>;
  isEditing: boolean;
  /** Usage déjà choisi (création depuis « Ajouter un contrôle / un exercice ») */
  isKindFixed?: boolean;
}

export default function CreateExerciceStep1({
  form,
  setType,
  setLevel,
  isEditing,
  isKindFixed = false,
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

  if (isExerciceTypeLoading || isLevelsLoading) {
    return <Loader />;
  }

  const hasError = isExerciceTypeError || isLevelsError;
  const errorMessage = isExerciceTypeError
    ? exerciceTypeError?.message
    : isLevelsError
    ? levelsError?.message
    : "Une erreur inconnue est survenue";

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="h-full space-y-6"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {" Informations générales"}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {isKindFixed
            ? `Renseignez les informations générales de votre ${form.getValues("kind") === "PRACTICE" ? "exercice" : "contrôle"}.`
            : "Renseignez les informations générales de votre exercice ou contrôle."}
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Titre et description
            </CardTitle>
            <CardDescription>
              Donnez un titre clair et une description précise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CustomInput
              isRequired={true}
              label="Titre"
              name="title"
              control={form.control}
              placeholder="Ex: Les fractions niveau débutant"
              description="Un titre clair et descriptif"
            />
            <CustomTextarea
              isRequired={true}
              label="Description détaillée"
              name="description"
              control={form.control}
              placeholder="Décrivez les objectifs et les consignes..."
              description="Décrivez précisément les objectifs et les consignes à suivre"
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              {isKindFixed
                ? "Définissez le niveau de difficulté et le format."
                : "Définissez l'usage, le niveau de difficulté et le format."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isKindFixed ? (
              <p className="flex items-center gap-2 text-sm">
                Usage :
                <ExerciceKindBadge kind={form.getValues("kind")} />
              </p>
            ) : (
              <ExerciceKindField form={form} isEditing={isEditing} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                isRequired={true}
                label="Niveau de difficulté"
                options={levelsData}
                name="exerciceLevelId"
                control={form.control}
                placeholder="Sélectionnez un niveau"
                description="Définissez la difficulté"
                onChange={handleSelectLevel}
              />
              <CustomSelect
                disabled={isEditing}
                isRequired={true}
                label="Format"
                options={exerciceTypeData?.data}
                name="exerciceTypeId"
                control={form.control}
                placeholder="Sélectionnez un format"
                description="Cartes, vrai ou faux, texte à trou ou choix multiple"
                onChange={handleSelectType}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
