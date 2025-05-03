"use client";

import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Form } from "@/components/ui/form";
import { useUpdateStudentSecurity } from "@/hooks/mutations/student/use-update-student-security";
import {
  studentSecurityFormSchema,
  studentSecurityFormType,
} from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function StudentSecurityForm() {
  const { mutateAsync, isPending } = useUpdateStudentSecurity();

  const form = useForm<studentSecurityFormType>({
    resolver: zodResolver(studentSecurityFormSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  async function onSubmit(values: studentSecurityFormType) {
    try {
      const result = await mutateAsync(values);
      if (result.success) {
        form.reset();
      }
    } catch (error) {}
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="relative flex flex-col space-y-4 border-dashed border-2 border-gray-300 rounded-md p-4">
            <span className="absolute -top-4 left-2 text-xl font-bold text-gray-400 bg-background px-1">
              Modification du mot de passe
            </span>
            <PasswordInput
              control={form.control}
              name="password"
              label="Mot de passe"
              placeholder="******"
            />
            <PasswordInput
              control={form.control}
              name="newPassword"
              label="Nouveau mot de passe"
              placeholder="******"
            />
          </div>

          <SubmitButton
            texte="Modifier"
            isLoading={isPending}
            loadindText="En cour de modification"
          />
        </form>
      </Form>
    </div>
  );
}
