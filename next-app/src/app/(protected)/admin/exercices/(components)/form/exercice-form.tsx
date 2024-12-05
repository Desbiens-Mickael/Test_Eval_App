"use client";

import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createExerciceFormInput,
  createExerciceStep1Schema,
  getStep2Shema,
} from "@/shema-zod/exercice.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CreateExerciceStep1 from "./createExerciceStep1";
import CreateExerciceStep2 from "./createExerciceStep2";

interface ExerciceFormProps {
  lessonSlug?: string;
}

export default function ExerciceForm({ lessonSlug }: ExerciceFormProps) {
  const [step, setStep] = useState<number>(1);
  const [type, setType] = useState<string>("");

  const form = useForm<createExerciceFormInput>({
    resolver: zodResolver(createExerciceStep1Schema.merge(getStep2Shema(type))),
    defaultValues: {
      title: "",
      exerciceTypeId: "",
      exerciceLevelId: "",
      content: [],
    },
  });

  // Reset du formulaire si le type change
  useEffect(() => {
    form.reset({
      ...form.getValues(),
    });
  }, [type]);

  const onSubmit = (data: createExerciceFormInput) => {
    const result = { ...data, lessonSlug };
    console.log("Formulaire soumis :", result);
  };

  const handleNextStep = async () => {
    const isValid = await form.trigger([
      "exerciceLevelId",
      "exerciceTypeId",
      "title",
    ]); // Valide les champs de l'étape actuelle
    if (isValid) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-h-[400px] flex flex-col justify-between"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <CreateExerciceStep1
                key={"step1"}
                form={form}
                setType={setType}
              />
            )}

            {step === 2 && <CreateExerciceStep2 key={"step2"} form={form} />}
          </AnimatePresence>
          <div className="w-full flex mt-4">
            {step > 1 && (
              <div className="size-min me-auto">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handlePreviousStep()}
                >
                  Prédécent
                </Button>
              </div>
            )}
            {step < 2 ? (
              <div className="size-min ms-auto">
                <Button
                  type={step === 1 ? "button" : "submit"}
                  variant="secondary"
                  onClick={() => handleNextStep()}
                >
                  Suivant
                </Button>
              </div>
            ) : (
              <div className="size-min ms-auto">
                <SubmitButton
                  texte="Créer l'exercice"
                  isLoading={false}
                  loadindText="Création en cours..."
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
