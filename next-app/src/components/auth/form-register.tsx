"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerUserFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createNewUserAction } from "@/actions/register.action";
import SubmitButton from "@/components/form/submit-button";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import PasswordInput from "../form/password-input";

export default function FormRegister({}) {
  const { mutate, isPending } = useMutation({
    mutationFn: createNewUserAction,
    onSuccess: (data) => {
      if (data.success) toast.success(data.success);
      if (data.error) toast.error(data.error);
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof registerUserFormSchema>>({
    resolver: zodResolver(registerUserFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerUserFormSchema>) {
    try {
      mutate(values);
    } catch (error) {
      toast.error("Une erreur c'est produite!");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full xl:w-[80%] lg:h-1/2 space-y-8"
      >
        <div className="w-full flex flex-col gap-8 md:flex-row">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel className="font-bold text-lg">Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Entrez votre prénom
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormLabel className="font-bold text-lg">Nom</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@gmail.com" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Entrez votre nom
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Email</FormLabel>
              <FormControl>
                <Input placeholder="exemple@gmail.com" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Entrez une adresse e-mail valide
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordInput
          control={form.control}
          name="password"
          label="Mot de passe"
          placeholder="******"
          description="Min 6 caractères"
        />
        <SubmitButton
          texte="Créer mon compte"
          isLoading={isPending}
          loadindText="Création en cour"
        />
      </form>
    </Form>
  );
}
