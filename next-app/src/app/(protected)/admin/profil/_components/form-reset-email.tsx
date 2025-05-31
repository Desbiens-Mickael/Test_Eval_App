"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetEmailFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import useResetEmail from "@/hooks/mutations/use-reset-email";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function FormResetEmail() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending } = useResetEmail();

  const form = useForm<z.infer<typeof resetEmailFormSchema>>({
    resolver: zodResolver(resetEmailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetEmailFormSchema>) {
    try {
      mutate({ token, newEmail: values });
      update({});
    } catch (err) {
      toast.error("Une erreur est survenue !");
    } finally {
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full xl:w-[80%] lg:h-1/2 space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">
                Nouvelle adresse email
              </FormLabel>
              <FormControl>
                <Input placeholder="exemple@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          texte="Modifier"
          isLoading={isPending}
          loadindText="Modification en cour"
        />
      </form>
    </Form>
  );
}
