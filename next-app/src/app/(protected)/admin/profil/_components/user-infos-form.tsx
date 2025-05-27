"use client";

import { motion } from "framer-motion";
import { Mail, User as UserIcon } from "lucide-react";
import { sendResetForEmailAction } from "@/actions/reset-email.action";
import SubmitButton from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateUserInfos } from "@/hooks/mutations/use-update-user-infos";
import { userInfosFormSchema } from "@/shema-zod/auth.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

type UserPreferencesForm = {
  name: string | null;
  email: string | null;
  role: UserRole;
  isOAuth: boolean;
};

export function UserInfosForm({
  name,
  email,
  isOAuth,
  role,
}: UserPreferencesForm) {
  const { mutate, isPending } = useUpdateUserInfos();

  const [firstname, lastname] = name ? name.split(" ") : [undefined, undefined];

  const form = useForm<z.infer<typeof userInfosFormSchema>>({
    resolver: zodResolver(userInfosFormSchema),
    defaultValues: {
      firstname: firstname,
      lastname: lastname,
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
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {!isOAuth && (
        <motion.div 
          variants={fadeIn}
          className="relative"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Adresse e-mail</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Un lien de modification sécurisé sera envoyé à votre adresse e-mail actuelle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="relative p-3 bg-muted/30 rounded-md">
                  <span className="text-xs font-medium text-muted-foreground absolute -top-2 left-3 bg-background px-2">
                    Adresse e-mail actuelle
                  </span>
                  <p className="text-sm font-medium pt-1">{email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto self-end"
                  onClick={() => handleSendResetEmail(email as string)}
                  disabled={isPending}
                >
                  Envoyer le lien de modification
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeIn}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Votre prénom" 
                              {...field} 
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
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
                            <Input 
                              placeholder="Votre nom" 
                              {...field} 
                              className="bg-background"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-2">
                    <SubmitButton
                      className="w-full sm:w-auto"
                      texte="Mettre à jour"
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
