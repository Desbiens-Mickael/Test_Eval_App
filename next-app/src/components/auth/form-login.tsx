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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { loginUserFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import useLogin from "@/hooks/mutations/useLogin";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function FormLogin() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const urlError =
    useSearchParams().get("error") === "OAuthAccountNotLinked"
      ? "Action impossible avec cet email."
      : "";

  const { isPending, mutateAsync } = useLogin();

  useEffect(() => {
    if (urlError) {
      toast.error(urlError);
    }
  }, [urlError]);

  const form = useForm<z.infer<typeof loginUserFormSchema>>({
    resolver: zodResolver(loginUserFormSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginUserFormSchema>) {
    try {
      const result = await mutateAsync(values);
      if (result?.twoFactor) {
        setShowTwoFactor(true);
      }
    } catch (err) {
      toast.error("Une erreur c'est produite!");
    }
  }

  return (
    <Form {...form}>
      <form
        data-testid="form-login"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full xl:w-[80%] lg:h-1/2 space-y-8"
      >
        <AnimatePresence>
          {showTwoFactor && (
            <motion.div
              data-testid="two-factor-section"
              initial={{ x: 100, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring" }}
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex w-full justify-center mb-3">
                      Code de confirmation
                    </FormLabel>
                    <FormControl className="flex justify-center items-center">
                      <InputOTP
                        containerClassName="justify-center"
                        maxLength={6}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription className="text-center pt-1 text-xs">
                      Veuillez saisir le code à usage unique qui vous a été
                      envoyé par mail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!showTwoFactor && (
          <>
            <p className="text-sm text-center">
              Entrez votre email et votre mot de passe ci-dessous pour vous
              connecter
            </p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-lg">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="exemple@gmail.com" {...field} />
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
          </>
        )}

        <SubmitButton
          texte={showTwoFactor ? "Confirmer" : "Connexion"}
          isLoading={isPending}
          loadindText="Vérification en cour"
        />
      </form>
    </Form>
  );
}
