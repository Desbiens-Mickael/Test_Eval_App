"use client";

import SubmitButton from "@/components/form/submit-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUserInfos } from "@/hooks/data/mutations/use-update-user-infos";
import { userInfosFormSchema } from "@/schema/shema-zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

type UserPreferencesForm = {
  name: string | null;
  email: string | null;
  role: UserRole;
  isOAuth: boolean;
};

export function UserInfosForm({ name, email, isOAuth, role }: UserPreferencesForm) {
  const { mutate, isPending } = useUpdateUserInfos();

  const [firstname, lastname] = name ? name.split(" ") : [undefined, undefined];

  const form = useForm<z.infer<typeof userInfosFormSchema>>({
    resolver: zodResolver(userInfosFormSchema),
    defaultValues: {
      firstname: firstname,
      lastname: lastname,
      email: email || undefined,
      role: role,
    },
  });

  async function onSubmit(values: z.infer<typeof userInfosFormSchema>) {
    try {
      mutate(values);
    } catch (error) {}
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Mes infos</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Akira" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Toryama" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isOAuth && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="akira.toryama@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <SubmitButton texte="Modifier" isLoading={isPending} loadindText="En cour de modification" />
        </form>
      </Form>
    </div>
  );
}
