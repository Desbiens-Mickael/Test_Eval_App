"use client";

import {
  changeParentPasswordAction,
  setParentNotificationsAction,
} from "@/actions/parent.action";
import PasswordInput from "@/components/form/password-input";
import SubmitButton from "@/components/form/submit-button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ParentPasswordFormType, parentPasswordFormSchema } from "@/shema-zod/parent.shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

/** Paramètres du parent : e-mails de notes et mot de passe */
export default function ParentSettings({
  email,
  notificationsEnabled,
}: {
  email: string;
  notificationsEnabled: boolean;
}) {
  const [notifications, setNotifications] = useState(notificationsEnabled);
  const [isSaving, startSaving] = useTransition();

  const toggleNotifications = (enabled: boolean) => {
    setNotifications(enabled);
    startSaving(async () => {
      const result = await setParentNotificationsAction(enabled);
      if (result.error) {
        setNotifications(!enabled);
        toast.error(result.error);
      } else toast.success(result.success);
    });
  };

  const form = useForm<ParentPasswordFormType>({
    resolver: zodResolver(parentPasswordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ParentPasswordFormType) => {
    const result = await changeParentPasswordAction(values);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(result.success);
    form.reset();
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Notifications par e-mail</h2>
        <p className="mt-1 text-sm text-muted-foreground">Envoyées à {email}.</p>
        <div className="mt-4 flex items-center justify-between gap-4">
          <Label htmlFor="parent-notifications" className="text-sm font-normal leading-relaxed">
            Recevoir un e-mail quand une nouvelle note est disponible
          </Label>
          <Switch
            id="parent-notifications"
            checked={notifications}
            disabled={isSaving}
            onCheckedChange={toggleNotifications}
          />
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Mot de passe</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Remplacez le mot de passe provisoire reçu par e-mail par le vôtre.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
            <PasswordInput control={form.control} name="currentPassword" label="Mot de passe actuel" />
            <PasswordInput
              control={form.control}
              name="newPassword"
              label="Nouveau mot de passe"
              description="Au moins 8 caractères"
            />
            <PasswordInput
              control={form.control}
              name="confirmPassword"
              label="Confirmez le nouveau mot de passe"
            />
            <div className="flex justify-end">
              <SubmitButton texte="Changer le mot de passe" isLoading={form.formState.isSubmitting} />
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
