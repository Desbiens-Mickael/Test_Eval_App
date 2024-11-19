"use client";

import NovelEditor from "@/components/block-editor/novel-editor";
import CustomInput from "@/components/form/custom-input";
import SubmitButton from "@/components/form/submit-button";
import { Form } from "@/components/ui/form";
import { useCreateLesson } from "@/hooks/mutations/lesson/use-create-lesson";
import { useCurrentUser } from "@/hooks/use-current-user";
import { createLessonSchema } from "@/shema-zod/lesson";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LessonContent from "../lesson-content";

export default function CreateLesson() {
  const [content, setContent] = useState<string>("");
  const user = useCurrentUser();

  const {isPending, mutateAsync} = useCreateLesson("Français");

  const form = useForm<z.infer<typeof createLessonSchema>>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      name: "",
      content: content,
      authorId: user?.id,
      LessonSubjectID: "",
      GradeLevelsID: "",
    },
  });

  const onSubmit = async () => {
    try {
      const data = await mutateAsync({ ...form.getValues(), content });

      if (data?.error) toast.error(data.error);
      if (data?.success) {
        toast.success(data.success);
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur c'est produite !");
    }
  }

  if (!user || user.role !== "ADMIN") {
    toast.error("Action non autoriser !");
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full max-w-screen-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full flex justify-between items-center">
            <CustomInput
              control={form.control}
              name="name"
              label="Nom de la leçon"
              placeholder="Entrez le nom de la leçon"
            />
            {/* TODO: Ajouter pour le slug et addapter le shema prisma et zod */}
          </div>
          {content && <div className="w-fit ml-auto mb-4" >
            <LessonContent content={content}/>
          </div>}
          <NovelEditor onChange={setContent} />
          <SubmitButton
            texte="Créer la leçon"
            className="w-fit"
            isLoading={isPending}
            loadindText="Création en cours..."
          />
        </form>
      </Form>
      </div>
    </div>
  );
}
