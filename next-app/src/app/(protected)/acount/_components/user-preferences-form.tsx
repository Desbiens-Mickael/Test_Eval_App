"use client";

import FileInput from "@/components/file-input";
import SubmitButton from "@/components/form/submit-button";
import { Form } from "@/components/ui/form";
import { useUpdateUserPreferences } from "@/hooks/data/mutations/use-update-user-preferences";
import { userPreferencesFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserPreferencesForm = {
  imgPath: string | null;
};

export function UserPreferencesForm({ imgPath }: UserPreferencesForm) {
  const { mutate, isPending } = useUpdateUserPreferences();

  const form = useForm<z.infer<typeof userPreferencesFormSchema>>({
    resolver: zodResolver(userPreferencesFormSchema),
    defaultValues: {
      imgPath: imgPath || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof userPreferencesFormSchema>) {
    try {
      mutate(values);
    } catch (error) {}
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Mes préférences</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FileInput />
          <SubmitButton texte="Modifier" isLoading={isPending} loadindText="En cour de modification" />
        </form>
      </Form>
    </div>
  );
}
