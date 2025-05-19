// hooks/use-lesson-form-submission.ts
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateLesson } from "@/hooks/mutations/lesson/use-create-lesson";
import { useUpdateLesson } from "@/hooks/mutations/lesson/use-update-lesson";
import { stringToSlug } from "@/lib/utils";
import {
  CreateLessonFormInput,
  createLessonFormSchema,
} from "@/shema-zod/lesson.shema";
import { JSONContent } from "novel";

/**
 * Interface des propriétés d'entrée du hook de soumission de formulaire de leçon
 * @interface UseLessonFormSubmissionProps
 */
interface UseLessonFormSubmissionProps {
  id?: string;
  title?: string;
  imageBanner?: string;
  content?: JSONContent;
  LessonSubjectID?: string;
  GradeLevelsID?: string;
}

/**
 * Hook personnalisé pour gérer la soumission du formulaire de leçon
 * @param props - Propriétés d'initialisation du formulaire
 * @returns Un objet avec les méthodes et états du formulaire
 */
export const useLessonFormSubmission = ({
  id,
  title,
  imageBanner,
  content,
  LessonSubjectID,
  GradeLevelsID,
}: UseLessonFormSubmissionProps) => {
  const router = useRouter();

  /**
   * Memoize certaines valeurs coûteuses
   * @type {Object}
   */
  const defaultFormValues = useMemo(
    () => ({
      title: title ?? "",
      imageBanner: imageBanner ?? "",
      content: content,
      LessonSubjectID: LessonSubjectID ?? "",
      GradeLevelsID: GradeLevelsID ?? "",
    }),
    [title, imageBanner, content, LessonSubjectID, GradeLevelsID]
  );

  const form = useForm<CreateLessonFormInput>({
    resolver: zodResolver(createLessonFormSchema),
    defaultValues: defaultFormValues,
  });

  const [imageBannerFile, setImageBannerFile] = useState({
    formData: null as FormData | null,
    preview: defaultFormValues.imageBanner,
  });

  const [previewContent, setPreviewContent] = useState<JSONContent | undefined>(
    defaultFormValues.content
  );

  const { mutateAsync: mutateAsyncCreate, isPending: isPendingCreate } =
    useCreateLesson();
  const { mutateAsync: mutateAsyncUpdate, isPending: isPendingUpdate } =
    useUpdateLesson();

  const handleImageBanner = (formData: FormData) => {
    const file = formData.get("file") as File;
    const preview = URL.createObjectURL(file);
    setImageBannerFile({
      formData: formData,
      preview: preview,
    });
  };

  const resetForm = () => {
    form.reset();
    setImageBannerFile({ formData: null, preview: "" });
    setPreviewContent(undefined);
  };

  /**
   * Soumet le formulaire avec gestion de la création/mise à jour de leçon
   * Gère le téléchargement d'image, la sérialisation et la navigation
   * @throws {Error} En cas d'erreur lors de la soumission
   */
  const onSubmit = async () => {
    try {
      const clientDomainApi = process.env.NEXT_PUBLIC_CLIENT_DOMAIN_API;
      const serverDomainApi = process.env.NEXT_PUBLIC_SERVER_DOMAIN_API;

      // Suppression de l'ancienne image si nécessaire
      if (imageBanner && imageBannerFile.formData !== null) {
        try {
          const img = imageBanner.split("/").pop();
          const response = await fetch(`${clientDomainApi}/lesson/${img}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            toast.error(
              "Une erreur c'est produite lors de la suppression de l'image !"
            );
            return;
          }
        } catch (error) {
          toast.error(
            "Une erreur c'est produite lors de la suppression de l'image !"
          );
          console.error(error);
          return;
        }
      }
      // Upload de l'image de la banière
      if (imageBannerFile.formData) {
        try {
          const response = await fetch(`${clientDomainApi}/lesson`, {
            method: "POST",
            body: imageBannerFile.formData,
          });
          if (!response.ok) {
            toast.error(
              "Une erreur c'est produite lors du l'upload de l'image !"
            );
            return;
          }
          const { image_path } = (await response.json()) as {
            image_path: string;
          };
          const src = `${serverDomainApi}/lesson/${image_path}`;
          form.setValue("imageBanner", src);
          setImageBannerFile({ formData: null, preview: "" });
        } catch (error) {
          toast.error(
            "Une erreur c'est produite lors du l'upload de l'image !"
          );
          console.error(error);
          return;
        }
      }

      // Sérialisation des données du formulaire
      const values = form.getValues();
      const serializedData = {
        ...values,
        content: JSON.stringify(values.content),
      };

      // Création ou mise à jour de la leçon
      let data;
      if (id) {
        data = await mutateAsyncUpdate({ lessonId: id, data: serializedData });
      } else {
        data = await mutateAsyncCreate(serializedData);
      }

      // Gestion des erreurs et succès
      if (data?.error) toast.error(data.error);
      if (data?.success) {
        // Génération d'un slug pour la navigation
        const subject = stringToSlug(data.data.LessonSubject.label);

        toast.success(data.success);
        resetForm();
        router.push(`/admin/lecons/${subject}`);
      }
    } catch (error) {
      // Gestion des erreurs inattendues
      toast.error("Une erreur c'est produite !");
      console.error(error);
    }
  };

  /**
   * Retourne tous les états et méthodes nécessaires pour le formulaire de leçon
   * @returns {Object} Un objet contenant les propriétés du formulaire
   */
  return {
    form, // Formulaire React Hook Form
    imageBannerFile, // Fichier et prévisualisation de l'image de bannière
    previewContent, // Contenu de prévisualisation
    handleImageBanner, // Méthode de gestion du téléchargement d'image
    onSubmit, // Méthode de soumission du formulaire
    setPreviewContent, // Méthode de mise à jour du contenu de prévisualisation
    isPendingCreate, // État de chargement pour la création
    isPendingUpdate, // État de chargement pour la mise à jour
  };
};
