"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { loginFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import login from "@/actions/login";
import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

export default function FormLogin({}) {
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.twoFactor) {
        setShowTwoFactor(true);
        toast.success("Un code viens de vous être envoyer.");
      }
      if (data?.success) {
        toast.success(data.success);
        form.reset();
      }
      if (data?.error) {
        toast.error(data.error);
        form.reset();
      }
    },
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string>("");
  const urlError = useSearchParams().get("error") === "OAuthAccountNotLinked" ? "Action impossible avec cet email." : "";

  useEffect(() => {
    if (urlError) {
      setError(urlError);
      toast.error(error);
    }
  }, [urlError, error]);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      mutate(values);
    } catch (err) {
      toast.error("Une erreur c'est produite!");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[80%] lg:h-1/2 space-y-8">
        <AnimatePresence>
          {showTwoFactor && (
            <motion.div initial={{ x: 100, opacity: 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: "spring" }}>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline-flex w-full justify-center mb-3">Code de comfirmation</FormLabel>
                    <FormControl className="flex justify-center items-center">
                      <InputOTP
                        maxLength={6}
                        render={({ slots }) => (
                          <>
                            <InputOTPGroup>
                              {slots.slice(0, 3).map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} />
                              ))}
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                              {slots.slice(3).map((slot, index) => (
                                <InputOTPSlot key={index + 3} {...slot} />
                              ))}
                            </InputOTPGroup>
                          </>
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-center pt-1 text-xs">Veuillez saisir le code à usage unique qui vous a été envoyé par mail.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!showTwoFactor && (
          <>
            <p className="text-sm text-center">Entrez votre email et votre mot de passe ci-dessous pour vous connecter</p>
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
              <PasswordInput control={form.control} name="password" label="Password" placeholder="******" />
              <Button variant={"link"} asChild className="pl-0 mt-1">
                <Link href={"/auth/reset-password"}>Mot de passe oublier ?</Link>
              </Button>
            </div>
          </>
        )}

        <SubmitButton texte={showTwoFactor ? "Comfirmer" : "Connexion"} isLoading={isPending} loadindText="Vérification en cour" />
      </form>
    </Form>
  );
}
