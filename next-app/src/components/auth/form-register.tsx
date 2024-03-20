"use client";

import createNewUser from "@/actions/register";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SubmitButton from "@/components/form/submit-button";
import { z } from "zod";
import PasswordInput from "../form/password-input";

export default function FormRegister({}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      setIsLoading(true);
      const res = await createNewUser(values);
      if (res?.success) toast.success(res.success);
      if (res.error) toast.error(res.error);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      form.reset();
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[80%] lg:h-1/2 space-y-8">
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
                <FormDescription className="text-xs">Entrez votre prénom</FormDescription>
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
                <FormDescription className="text-xs">Entrez votre nom</FormDescription>
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
              <FormDescription className="text-xs">Entrez une adresse e-mail valide</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordInput control={form.control} name="password" label="Mot de passe" placeholder="******" description="Min 6 caractères" />
        <SubmitButton texte="Créer mon compte" isLoading={isLoading} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
