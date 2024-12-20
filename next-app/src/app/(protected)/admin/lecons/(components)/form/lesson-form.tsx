"use client";

import NovelEditor from "@/components/block-editor/novel-editor";
import CustomInput from "@/components/form/custom-input";
import CustomSelect from "@/components/form/custom-select";
import SubmitButton from "@/components/form/submit-button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateLesson } from "@/hooks/mutations/lesson/use-create-lesson";
import { useUpdateLesson } from "@/hooks/mutations/lesson/use-update-lesson";
import useGetAllGradeLevels from "@/hooks/queries/use-get-all-grade-levels";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { stringToSlug } from "@/lib/utils";
import {
  CreateLessonFormInput,
  createLessonFormSchema,
} from "@/shema-zod/lesson.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { JSONContent } from "novel";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import LessonContent from "../lesson-content";
import LessonFormSkeleton from "../lesson-form-skeleton";

interface EditLessonProps {
  id?: string;
  title?: string;
  content?: JSONContent | undefined;
  LessonSubjectID?: string;
  GradeLevelsID?: string;
}

export default function LessonForm({
  id,
  title,
  content,
  LessonSubjectID,
  GradeLevelsID,
}: EditLessonProps) {
  //queries
  const { data: allLessonsSubject, isLoading: isLoadingLessonsSubject } =
    useGetAllLessonsSubject();
  const { data: allGradeLevels, isLoading: isLoadingGradeLevels } =
    useGetAllGradeLevels();

  // mutations
  const { isPending: isPendingCreate, mutateAsync: mutateAsyncCreate } =
    useCreateLesson();
  const { isPending: isPendingUpdate, mutateAsync: mutateAsyncUpdate } =
    useUpdateLesson();

  const [previewContent, setPreviewContent] = useState<JSONContent | undefined>(
    content
  );

  const router = useRouter();

  const form = useForm<CreateLessonFormInput>({
    resolver: zodResolver(createLessonFormSchema),
    defaultValues: {
      title: title ?? "",
      content: content,
      LessonSubjectID: LessonSubjectID ?? "",
      GradeLevelsID: GradeLevelsID ?? "",
    },
  });

  const onSubmit = async () => {
    try {
      const values = form.getValues();
      // Sérialiser le contenu avant l'envoi
      const serializedData = {
        ...values,
        content: JSON.stringify(values.content),
      };

      let data;
      if (id) {
        data = await mutateAsyncUpdate({ lessonId: id, data: serializedData });
      } else {
        data = await mutateAsyncCreate(serializedData);
      }

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
  };

  if (isLoadingLessonsSubject || isLoadingGradeLevels) {
    return <LessonFormSkeleton />;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full flex flex-col lg:flex-row  items-center gap-8 lg:gap-16">
            {/* Input pour le titre */}
            <CustomInput
              control={form.control}
              name="title"
              label="Titre"
              placeholder="Entrez le nom de la leçon"
              description="Le titre de la leçon"
              className="w-full lg:w-fit"
            />

            {/* Select pour le sujet */}
            <CustomSelect
              control={form.control}
              name="LessonSubjectID"
              label="Sujet"
              placeholder="Selectionnez le sujet de la leçon"
              description="Le sujet dont la leçon a trait"
              options={allLessonsSubject}
              className="w-full lg:w-fit"
            />

            {/* Select pour le niveau de la leçon */}
            <CustomSelect
              control={form.control}
              name="GradeLevelsID"
              label="Niveau"
              placeholder="Séléctionnez le niveau de la leçon"
              description="Le niveau de la leçon"
              options={allGradeLevels}
              className="w-full lg:w-fit"
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
              texte={`${id ? "Modifier" : "Créer"} la leçon`}
              className="w-fit"
              isLoading={isPendingCreate || isPendingUpdate}
              loadindText={`${id ? "Modification" : "Création"} en cours...`}
            />

            {/* Preview de la leçon */}
            {previewContent && <LessonContent content={previewContent} />}
          </div>
        </form>
      </Form>
    </div>
  );
}
