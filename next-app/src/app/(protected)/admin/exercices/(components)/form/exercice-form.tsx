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
import { AnimatePresence, motion } from "framer-motion";
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
  exerciceData?: Exercice | null;
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

  // Configuration des étapes pour le stepper
  const stepsConfig = [
    { id: 1, label: "Informations" },
    { id: 2, label: "Contenu" },
    { id: 3, label: "Validation" },
  ];

  return (
    <div className="w-full h-full min-h-[600px] relative">
      <Form {...form}>
        <div className="mb-8">
          <Stepper
            steps={stepsConfig.map((step) => step.label)}
            currentStep={step}
          />
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col flex-1 min-h-[500px]"
        >
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full"
              >
                {step === 1 && (
                  <CreateExerciceStep1
                    isEditing={!!exerciceData}
                    form={form}
                    setType={setType}
                    setLevel={setLevel}
                  />
                )}

                {step === 2 && <CreateExerciceStep2 form={form} type={type} />}

                {step === 3 && (
                  <CreateEXerciceSTep3 form={form} type={type} level={level} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="w-full flex mt-12 pt-6 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex w-full justify-between items-center">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="min-w-[120px]"
                  >
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="min-w-[120px]"
                  >
                    Suivant
                  </Button>
                ) : (
                  <SubmitButton
                    texte={exerciceData ? "Mettre à jour" : "Créer l'exercice"}
                    isLoading={isPendingCreate || isPendingUpdate}
                    loadindText={
                      exerciceData
                        ? "Mise à jour en cours..."
                        : "Création en cours..."
                    }
                    className="min-w-[160px]"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </form>
      </Form>
    </div>
  );
}
