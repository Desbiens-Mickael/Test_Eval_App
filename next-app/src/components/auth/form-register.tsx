"use client";

import createNewUser from "@/actions/register";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import SubmitButton from "@/components/form/submit-button";
import { z } from "zod";

export default function FormRegister({}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      setIsLoading(true);
      const res = await createNewUser(values);
      if (res.success) toast.success(res.success);
      if (res.error) toast.error(res.error);
    } catch (error) {
      console.error(error);
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
                <Input placeholder="exemple@gmail.com" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Entrez une adresse e-mail valide</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold text-lg">Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormDescription className="text-xs text-center">{"min 12 caractères, mélange de majuscules, minuscules, chiffres, et symboles (ex. @, é, ;)"}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton texte="Créer mon compte" isLoading={isLoading} loadindText="Création en cour" />
      </form>
    </Form>
  );
}
