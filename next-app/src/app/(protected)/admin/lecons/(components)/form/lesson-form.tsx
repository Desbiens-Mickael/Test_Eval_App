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
import AvatarUpload from "@/components/user/avatar-upload";
import useGetAllGradeLevels from "@/hooks/queries/use-get-all-grade-levels";
import useGetAllLessonsSubject from "@/hooks/queries/use-get-all-lesson-subjects";
import { JSONContent } from "novel";
import { Controller } from "react-hook-form";
import LessonFormSkeleton from "../lesson-form-skeleton";
import LessonPreview from "../lesson-preview";
import { useLessonFormSubmission } from "./hook/useLessonFormSubmission";

interface EditLessonProps {
  id?: string;
  title?: string;
  imageBanner?: string;
  content?: JSONContent | undefined;
  LessonSubjectID?: string;
  GradeLevelsID?: string;
}

export interface ImageBanner {
  formData: FormData | null;
  preview: string;
}

export default function LessonForm({
  id,
  title,
  imageBanner,
  content,
  LessonSubjectID,
  GradeLevelsID,
}: EditLessonProps) {
  //hooks
  const {
    onSubmit,
    form,
    imageBannerFile,
    handleImageBanner,
    isPendingCreate,
    isPendingUpdate,
    previewContent,
    setPreviewContent,
  } = useLessonFormSubmission({
    id,
    title,
    imageBanner,
    content,
    LessonSubjectID,
    GradeLevelsID,
  });

  //queries
  const { data: allLessonsSubject, isLoading: isLoadingLessonsSubject } =
    useGetAllLessonsSubject();
  const { data: allGradeLevels, isLoading: isLoadingGradeLevels } =
    useGetAllGradeLevels();

  if (isLoadingLessonsSubject || isLoadingGradeLevels) {
    return <LessonFormSkeleton />;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <AvatarUpload
        handleUpload={handleImageBanner}
        isPending={isPendingCreate || isPendingUpdate}
        image={imageBanner}
        mode="BANNER"
      />

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
            {previewContent && (
              <LessonPreview
                content={previewContent}
                imageBanner={imageBannerFile?.preview}
              />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
