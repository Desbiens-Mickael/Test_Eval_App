"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSendFormSchema } from "@/type/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { resetPassword } from "@/actions/reset-password";
import SubmitButton from "@/components/form/submit-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export default function PasswordResetSubmissionForm({}) {
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.error) toast.error(data.error);
      if (data.success) toast.error(data.success);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof resetPasswordSendFormSchema>>({
    resolver: zodResolver(resetPasswordSendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSendFormSchema>) {
    try {
      mutate(values);
    } catch (err) {
      console.error(err);
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
        <SubmitButton texte="Modifier" isLoading={isPending} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
