"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { loginFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import login from "@/actions/login";
import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

export default function FormLogin({}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
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
      setIsLoading(true);
      const res = await login(values);
      if (res?.error) {
        toast.error(res.error);
        form.reset();
      }
      if (res?.success) {
        toast.error(res.success);
        form.reset();
      }
      if (res?.twoFactor) setShowTwoFactor(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full xl:w-[80%] lg:h-1/2 space-y-8">
        {showTwoFactor && (
          <>
            <Button type="button" variant={"secondary"} onClick={() => setShowTwoFactor(false)} className="hover:bg-primary hover:text-primary-foreground">
              {"<- Retout"}
            </Button>
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
          </>
        )}
        {!showTwoFactor && (
          <>
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

        <SubmitButton texte={showTwoFactor ? "Comfirmer" : "Connexion"} isLoading={isLoading} loadindText="Vérification en cour" />
      </form>
    </Form>
  );
}
