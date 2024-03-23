"use client";

import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useUpdateUserSecurity } from "@/hooks/data/mutations/use-update-user-security";
import { userSecurityFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Sécurité</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <PasswordInput control={form.control} name="password" label="Mot de passe" placeholder="******" />
          <PasswordInput control={form.control} name="newPassword" label="Nouveau mot de passe" placeholder="******" />

          <FormField
            control={form.control}
            name="isTwoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex gap-4 items-center">
                <FormLabel>Authentification à deux facteurs</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="!mt-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton texte="Modifier" isLoading={isPending} loadindText="En cour de modification" />
        </form>
      </Form>
    </div>
  );
}
