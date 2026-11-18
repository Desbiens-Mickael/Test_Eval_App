"use client";

import { setStudentParentEmailAction } from "@/actions/parent-access.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface ParentAccessCardProps {
  studentId: string;
  studentName: string;
  parentEmail: string | null;
}

/**
 * E-mail du parent d'un élève, facultatif.
 * Renseigné (à tout moment), l'espace parent est créé et ses accès envoyés
 * automatiquement ; effacé, l'accès est retiré.
 */
export default function ParentAccessCard({
  studentId,
  studentName,
  parentEmail,
}: ParentAccessCardProps) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(parentEmail ?? "");
  const [confirmRemoval, setConfirmRemoval] = useState(false);

  useEffect(() => setValue(parentEmail ?? ""), [parentEmail]);

  const mutation = useMutation({
    mutationFn: (email: string) => setStudentParentEmailAction(studentId, email),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.success);
      queryClient.invalidateQueries({ queryKey: ["studentById", studentId] });
    },
    onError: () => toast.error("Une erreur est survenue lors de l'enregistrement."),
  });

  const trimmed = value.trim();
  const changed = trimmed.toLowerCase() !== (parentEmail ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!changed) return;
    // Effacer l'adresse retire l'accès : on demande confirmation
    if (!trimmed && parentEmail) {
      setConfirmRemoval(true);
      return;
    }
    mutation.mutate(trimmed);
  };

  return (
    <section
      aria-labelledby="parent-access-title"
      className="mt-4 w-full rounded-xl border bg-card p-5 shadow-sm"
    >
      <h2 id="parent-access-title" className="flex items-center gap-2 text-lg font-semibold">
        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
        Espace parent
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {parentEmail
          ? `${parentEmail} suit la progression de ${studentName}, en lecture seule.`
          : `Facultatif. Renseignez l'e-mail d'un parent pour qu'il suive la progression de ${studentName} : son espace est créé et ses accès lui sont envoyés automatiquement. Laissez vide si vous suivez vous-même l'élève.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[16rem] flex-1 space-y-1.5">
          <Label htmlFor="parent-email">E-mail du parent</Label>
          <Input
            id="parent-email"
            type="email"
            autoComplete="off"
            placeholder="parent@exemple.fr"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={!changed || mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {parentEmail && !trimmed ? "Retirer l'accès" : "Enregistrer"}
        </Button>
      </form>

      <AlertDialog open={confirmRemoval} onOpenChange={setConfirmRemoval}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer l&apos;accès parent ?</AlertDialogTitle>
            <AlertDialogDescription>
              {parentEmail} ne pourra plus suivre {studentName}. Son compte reste actif pour ses
              autres enfants, s&apos;il en a.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => mutation.mutate("")}>Retirer l&apos;accès</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
