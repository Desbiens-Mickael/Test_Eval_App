"use client";

import { Form } from "@/components/ui/form";
import { resetPasswordFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { newResetPasswordAction } from "@/actions/reset-password.action";
import SubmitButton from "@/components/form/submit-button";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../form/password-input";

export default function FormResetPassword({}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending } = useMutation({
    mutationFn: newResetPasswordAction,
    onSuccess: (data) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) toast.error(data.success);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    try {
      mutate({ token, newPassword: values });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[80%] lg:h-1/2 space-y-8">
        <PasswordInput control={form.control} name="password" label="Mot de passe" placeholder="******" />
        <SubmitButton texte="Modifier" isLoading={isPending} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
