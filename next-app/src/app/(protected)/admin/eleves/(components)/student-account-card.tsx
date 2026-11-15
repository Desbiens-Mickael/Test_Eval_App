"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  useResetStudentPassword,
  useSetStudentDisabled,
} from "@/hooks/mutations/student/use-student-account";
import { Ban, Check, Copy, KeyRound, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AccountStatusBadge from "./account-status-badge";

interface StudentAccountCardProps {
  studentId: string;
  name: string;
  identifier: string;
  isActive: boolean;
  disabledAt: Date | string | null;
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type Credentials = { identifier: string; password: string; emailSent: boolean };

/** Gestion du compte d'un élève par son professeur */
export default function StudentAccountCard({
  studentId,
  name,
  identifier,
  isActive,
  disabledAt,
}: StudentAccountCardProps) {
  const reset = useResetStudentPassword(studentId);
  const setDisabled = useSetStudentDisabled(studentId);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const isDisabled = !!disabledAt;

  const handleReset = async () => {
    const result = await reset.mutateAsync();
    if (result?.data) setCredentials(result.data);
  };

  return (
    <section
      aria-labelledby="student-account-title"
      className="w-full rounded-xl border bg-card p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="student-account-title" className="text-lg font-semibold">
            Compte de l&apos;élève
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifiant : <span className="font-mono font-medium text-foreground">{identifier}</span>
          </p>
          {disabledAt && (
            <p className="mt-1 text-sm text-muted-foreground">
              Désactivé le {dateFormat.format(new Date(disabledAt))} : {name} ne peut plus se
              connecter.
            </p>
          )}
        </div>
        <AccountStatusBadge isActive={isActive} disabledAt={disabledAt} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {/* Réinitialisation du mot de passe */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={reset.isPending}>
              {reset.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Réinitialiser le mot de passe
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Réinitialiser le mot de passe ?</AlertDialogTitle>
              <AlertDialogDescription>
                Un nouveau mot de passe va être créé pour {name}. L&apos;ancien ne fonctionnera
                plus. Il vous sera affiché une seule fois et envoyé par email.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Réinitialiser</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Désactivation / réactivation */}
        {isDisabled ? (
          <Button
            variant="outline"
            size="sm"
            disabled={setDisabled.isPending}
            onClick={() => setDisabled.mutate(false)}
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Réactiver le compte
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={setDisabled.isPending}>
                <Ban className="mr-2 h-4 w-4" aria-hidden="true" />
                Désactiver le compte
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Désactiver le compte de {name} ?</AlertDialogTitle>
                <AlertDialogDescription>
                  {name} ne pourra plus se connecter, et sa session en cours ne permettra plus
                  de rien faire. Ses copies et ses notes sont conservées, et vous pourrez
                  réactiver le compte à tout moment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => setDisabled.mutate(true)}>
                  Désactiver
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Nouveaux identifiants, affichés une seule fois */}
      <AlertDialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau mot de passe de {name}</AlertDialogTitle>
            <AlertDialogDescription>
              Notez-le ou transmettez-le à l&apos;élève : il ne sera plus affiché ensuite.
              {credentials?.emailSent && " Une copie vous a aussi été envoyée par email."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {credentials && (
            <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
              <CredentialRow label="Identifiant" value={credentials.identifier} />
              <CredentialRow label="Mot de passe" value={credentials.password} />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction>J&apos;ai noté le mot de passe</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function CredentialRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copie impossible, sélectionnez le texte à la main.");
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="select-all break-all font-mono text-lg font-semibold">{value}</div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copy}
        aria-label={`Copier : ${label.toLowerCase()}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
