"use client";

import { motion } from "framer-motion";
import { Key, Shield, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useUpdateUserSecurity } from "@/hooks/mutations/use-update-user-security";
import { userSecurityFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

type UserSecurityFormProps = {
  isTwoFactorEnabled: boolean;
};

export function UserSecurityForm({ isTwoFactorEnabled }: UserSecurityFormProps) {
  const { mutate, isPending } = useUpdateUserSecurity();

  const form = useForm<z.infer<typeof userSecurityFormSchema>>({
    resolver: zodResolver(userSecurityFormSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: isTwoFactorEnabled || undefined,
    },
  });

  function onSubmit(values: z.infer<typeof userSecurityFormSchema>) {
    try {
      mutate(values);
    } catch (error) {}
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Paramètres de sécurité</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Gérez les paramètres de sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                      <Key className="w-5 h-5 text-muted-foreground" />
                      <div className="space-y-1">
                        <h3 className="font-medium">Changer de mot de passe</h3>
                        <p className="text-xs text-muted-foreground">
                          Créez un nouveau mot de passe sécurisé
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pl-8">
                      <PasswordInput 
                        control={form.control} 
                        name="password" 
                        label="Mot de passe actuel" 
                        placeholder="••••••••" 
                      />
                      <PasswordInput 
                        control={form.control} 
                        name="newPassword" 
                        label="Nouveau mot de passe" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <FormField
                      control={form.control}
                      name="isTwoFactorEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" />
                              Authentification à deux facteurs (2FA)
                            </FormLabel>
                            <p className="text-xs text-muted-foreground">
                              Ajoutez une couche de sécurité supplémentaire à votre compte
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <SubmitButton 
                      className="w-full sm:w-auto"
                      texte="Enregistrer les modifications" 
                      isLoading={isPending} 
                      loadindText="Enregistrement..." 
                    />
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
