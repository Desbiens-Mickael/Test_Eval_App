"use client";

import Stepper from "@/components/form/stepper";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateExercice } from "@/hooks/mutations/exercice/use-create-exercice";
import { useUpdateExercice } from "@/hooks/mutations/exercice/use-update-exercice";
import { stringToSlug } from "@/lib/utils";
import {
  contentInput,
  createExerciceFormInput,
  globalExerciceSchema,
} from "@/shema-zod/exercice.shema";
import { Exercice } from "@/type/exercice";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CreateExerciceStep1 from "./create-exercice-step-1";
import CreateExerciceStep2 from "./create-exercice-step-2";
import CreateEXerciceSTep3 from "./create-exercice-step-3";
import { ComponentType } from "./dynamic-content-components";

interface ExerciceFormProps {
  lessonSlug?: string;
  exerciceData?: Exercice;
}

export default function ExerciceForm({
  lessonSlug,
  exerciceData,
}: ExerciceFormProps) {
  const [step, setStep] = useState<number>(1);
  const [type, setType] = useState<ComponentType>(
    (exerciceData?.type as ComponentType) || "Carte"
  );
  const [level, setLevel] = useState<string>(exerciceData?.level || "");

  const router = useRouter();

  const { mutateAsync: createMutation, isPending: isPendingCreate } =
    useCreateExercice(type);
  const { mutateAsync: updateMutation, isPending: isPendingUpdate } =
    useUpdateExercice(type);

  const form = useForm<createExerciceFormInput>({
    resolver: zodResolver(globalExerciceSchema),
    defaultValues: {
      title: exerciceData?.title || "",
      description: exerciceData?.description || "",
      exerciceTypeId: exerciceData?.typeId || "",
      exerciceLevelId: exerciceData?.levelId || "",
      content: (exerciceData?.content as contentInput) || [],
    },
  });

  // Reset du formulaire si le type change
  useEffect(() => {
    if (exerciceData) return;
    form.reset({
      ...form.getValues(),
      content: [],
    });
  }, [type, exerciceData, form]);

  if (!exerciceData && !lessonSlug) return notFound();

  const onSubmit = async (data: createExerciceFormInput) => {
    try {
      let res;
      if (exerciceData) {
        res = await updateMutation({
          exerciceId: exerciceData.id,
          data,
        });
      } else {
        if (!lessonSlug || typeof lessonSlug !== "string") {
          toast.error("Le slug de la leçon est requis pour créer un exercice.");
          return;
        }
        res = await createMutation({
          data,
          lessonSlug,
        });
      }
      if (res.error) toast.error(res.error);
      if (res.success) {
        toast.success(res.success);
        form.reset();
        const url = stringToSlug(type);
        router.push(`/admin/exercices/${url}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleNextStep = async () => {
    switch (step) {
      case 1:
        const isValid = await form.trigger([
          "exerciceLevelId",
          "exerciceTypeId",
          "title",
          "description",
        ]);
        if (isValid) {
          setStep((prevStep) => prevStep + 1);
        }
        break;
      case 2:
        const isValid2 = await form.trigger(["content"]);
        if (isValid2) {
          setStep((prevStep) => prevStep + 1);
        }
        break;
      default:
        break;
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="w-full h-full min-h-[600px]">
      <Form {...form}>
        <Stepper steps={["1", "2", "3"]} currentStep={step} />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" w-full flex flex-col justify-between space-y-8"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <CreateExerciceStep1
                isEditing={!!exerciceData}
                key={"step1"}
                form={form}
                setType={setType}
                setLevel={setLevel}
              />
            )}

            {step === 2 && (
              <CreateExerciceStep2 key={"step2"} form={form} type={type} />
            )}

            {step === 3 && (
              <CreateEXerciceSTep3
                key={"step3"}
                form={form}
                type={type}
                level={level}
              />
            )}
          </AnimatePresence>
          <div className="w-full flex mt-auto">
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
            {step < 3 ? (
              <div className="size-min ms-auto">
                <Button
                  type={step < 3 ? "button" : "submit"}
                  variant="secondary"
                  onClick={() => handleNextStep()}
                >
                  Suivant
                </Button>
              </div>
            ) : (
              <div className="size-min ms-auto">
                <SubmitButton
                  texte={exerciceData ? "Mettre à jour" : "Créer"}
                  isLoading={isPendingCreate || isPendingUpdate}
                  loadindText={
                    exerciceData
                      ? "Mise à jour en cours..."
                      : "Création en cours..."
                  }
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
