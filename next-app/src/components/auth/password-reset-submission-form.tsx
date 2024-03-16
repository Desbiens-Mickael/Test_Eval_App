"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSendFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { resetPassword } from "@/actions/reset-password";
import SubmitButton from "@/components/form/submit-button";
import { toast } from "sonner";
import { z } from "zod";

export default function PasswordResetSubmissionForm({}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof resetPasswordSendFormSchema>>({
    resolver: zodResolver(resetPasswordSendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSendFormSchema>) {
    try {
      setIsLoading(true);
      const res = await resetPassword(values);
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="exemple@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton texte="Modifier" isLoading={isLoading} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
