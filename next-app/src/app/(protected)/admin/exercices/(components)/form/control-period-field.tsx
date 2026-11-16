"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { CalendarClock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

/** Date → valeur d'un <input type="datetime-local"> (heure locale du navigateur) */
export const toDateTimeLocal = (value: Date | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Valeur d'un <input type="datetime-local"> → Date (null si vide) */
export const fromDateTimeLocal = (value: string) =>
  value ? new Date(value) : null;

/** Dates d'ouverture et de clôture d'un contrôle */
export default function ControlPeriodField({
  form,
  isClosed,
}: {
  form: UseFormReturn<createExerciceFormInput>;
  /** Contrôle déjà clos : les dates ne peuvent plus changer */
  isClosed: boolean;
}) {
  const fields = [
    {
      name: "opensAt" as const,
      label: "Ouverture",
      description: "Vide : ouvert dès qu'il est attribué à un groupe.",
    },
    {
      name: "closesAt" as const,
      label: "Clôture",
      description: "Vide : pas de date limite, la note est visible dès l'envoi.",
    },
  ];

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm font-medium">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        Période du contrôle
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ name, label, description }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    disabled={isClosed}
                    value={toDateTimeLocal(field.value)}
                    onChange={(e) =>
                      field.onChange(fromDateTimeLocal(e.target.value))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormDescription>{description}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {isClosed
          ? "Ce contrôle est clos : ses dates ne peuvent plus être modifiées."
          : "À la clôture, les copies non rendues sont notées 0, puis les notes et les corrections deviennent visibles pour les élèves, qui reçoivent une notification."}
      </p>
    </div>
  );
}
