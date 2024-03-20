"use client";

import { Form } from "@/components/ui/form";
import { resetPasswordFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { newResetPassword } from "@/actions/reset-password";
import SubmitButton from "@/components/form/submit-button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import PasswordInput from "../form/password-input";

export default function FormResetPassword({}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    try {
      setIsLoading(true);
      const res = await newResetPassword(token, values);
      if (res?.error) toast.error(res.error);
      if (res?.success) toast.error(res.success);
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[80%] lg:h-1/2 space-y-8">
        <PasswordInput control={form.control} name="password" label="Mot de passe" placeholder="******" />
        <SubmitButton texte="Modifier" isLoading={isLoading} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
