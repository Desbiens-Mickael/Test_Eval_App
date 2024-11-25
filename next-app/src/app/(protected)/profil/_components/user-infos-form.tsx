"use client";

import { sendResetForEmailAction } from "@/actions/reset-email.action";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUserInfos } from "@/hooks/mutations/use-update-user-infos";
import { userInfosFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
      // email: email || undefined,
      role: role,
    },
  });

  const handleSendResetEmail = async (email: string) => {
    try {
      const res = await sendResetForEmailAction({ email });
      if (res.error) toast.error(res.error);
      if (res.success) toast.success(res.success);
    } catch (error) {
      toast.error("Une erreur c'est produite !");
    }
  };

  async function onSubmit(values: z.infer<typeof userInfosFormSchema>) {
    try {
      mutate(values);
    } catch (error) {}
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-center">Mes infos</h2>
      {!isOAuth && (
        <div className="relative flex flex-col gap-8 p-4 my-4 border rounded-md ">
          <span className="absolute -top-3 left-4 text-slate-400 px-2 bg-white">{"Adresse e-mail"}</span>
          <p className="text-[.8rem] text-slate-500">
            Une fois que vous aurez cliqué sur le bouton ci-dessous, un lien sécurisé contenant des instructions sur la manière de modifier votre adresse e-mail sera envoyé à votre boîte mail.
          </p>
          <div className="flex flex-col lg:flex-row justify-between items-end gap-4">
            <div className="relative w-full px-4 py-3 border rounded-md">
              <span className="absolute -top-3 left-4 text-slate-400 text-sm px-2 bg-white">Adresse e-mail actuelle</span>
              {email}
            </div>
            <Button className="w-full" onClick={() => handleSendResetEmail(email as string)}>
              {"ENVOYER LE LIEN DE MODIFICATION D'E-MAIL"}
            </Button>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Toryama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <SubmitButton texte="MODIFIER" isLoading={isPending} loadindText="En cour de modification" />
        </form>
      </Form>
    </div>
  );
}
