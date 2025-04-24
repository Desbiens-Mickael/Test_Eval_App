"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  loginStudentFormSchema,
  loginStudentFormType,
} from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import useStudentLogin from "@/hooks/mutations/useLoginStudent";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function FormLoginStudent() {
  const urlError =
    useSearchParams().get("error") === "OAuthAccountNotLinked"
      ? "Action impossible avec cet email."
      : "";

  const { isPending, mutateAsync } = useStudentLogin();

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  const form = useForm<loginStudentFormType>({
    resolver: zodResolver(loginStudentFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: loginStudentFormType) {
    try {
      await mutateAsync(values);
    } catch (err) {
      toast.error("Une erreur c'est produite!");
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          data-testid="form-login-student"
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full  space-y-8"
        >
          <p className="text-sm text-center">
            Entrez votre identifiant et votre mot de passe ci-dessous pour vous
            connecter
          </p>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg">Identifiant</FormLabel>
                <FormControl>
                  <Input placeholder="m.dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <PasswordInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="******"
            />
            <Button variant={"link"} asChild className="pl-0 mt-1">
              <Link href={"/auth/reset-password"}>Mot de passe oublié ?</Link>
            </Button>
          </div>

          <SubmitButton
            texte={"Connexion"}
            isLoading={isPending}
            loadindText="Vérification en cour"
          />
        </form>
      </Form>
    </div>
  );
}
