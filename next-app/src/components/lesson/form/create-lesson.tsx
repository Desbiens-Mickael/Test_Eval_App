"use client";

import NovelEditor from "@/components/block-editor/novel-editor";
import CustomInput from "@/components/form/custom-input";
import CustomSelect from "@/components/form/custom-select";
import SubmitButton from "@/components/form/submit-button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateLesson } from "@/hooks/mutations/lesson/use-create-lesson";
import useGetAllGradeLevels from "@/hooks/queries/use-get-all-grade-levels";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { stringToSlug } from "@/lib/utils";
import { createLessonSchema } from "@/shema-zod/lesson";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LessonContent from "../lesson-content";

export default function CreateLesson() {
  const { data: allLessonsSubject, isLoading: isLoadingLessonsSubject } = useGetAllLessonsSubject();
  const { data: allGradeLevels, isLoading: isLoadingGradeLevels } = useGetAllGradeLevels();
  const {isPending, mutateAsync} = useCreateLesson();

  const [previewContent, setPreviewContent] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      name: "",
      content: "",
      LessonSubjectID: "",
      GradeLevelsID: "",
    },
  });
  
  const onSubmit = async () => {
    try {
      const data = await mutateAsync(form.getValues());

      if (data?.error) toast.error(data.error);
      if (data?.success) {
        const subject = stringToSlug(data.data.LessonSubject.label);
        
        toast.success(data.success);
        form.reset();
        router.push(`/admin/lecons/${subject}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur c'est produite !");
    }
  }

  if (isLoadingLessonsSubject || isLoadingGradeLevels) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full flex justify-between items-center">

            {/* Input pour le titre */}
            <CustomInput
              control={form.control}
              name="name"
              label="Titre"
              placeholder="Entrez le nom de la leçon"
            />

            {/* Select pour le sujet */}
            <CustomSelect 
              control={form.control}
              name="LessonSubjectID"
              label="Sujet"
              placeholder="Selectionnez le sujet de la leçon"
              description="Le sujet dont la leçon a trait"
              options={allLessonsSubject}
            />

            {/* Select pour le niveau de la leçon */}
            <CustomSelect 
              control={form.control}
              name="GradeLevelsID"
              label="Niveau"
              placeholder="Séléctionnez le niveau de la leçon"
              description="Le niveau de la leçon"
              options={allGradeLevels}
            />
          </div>

          {/* Editeur Novel connecté à react-hook-form */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu de la leçon</FormLabel>
                <Controller
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <NovelEditor
                      initialValue={field.value} // Lie la valeur actuelle
                      onChange={(newContent) => {
                        field.onChange(newContent); // Synchronise avec react-hook-form
                        setPreviewContent(newContent); // Met à jour le contenu de la preview
                      }} 
                    />
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-end items-center gap-4">
            {/* Bouton de soumission */}
            <SubmitButton
              texte="Créer la leçon"
              className="w-fit"
              isLoading={isPending}
              loadindText="Création en cours..."
            />

            {/* Preview de la leçon */}
            {previewContent && 
              <LessonContent content={previewContent}/>
            }
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
}
