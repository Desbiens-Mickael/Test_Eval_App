import FormResetEmail from "@/app/(protected)/admin/profil/_components/form-reset-email";
import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import { LogIn } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modification de l'adresse email",
};

export default function ResetEmailPage() {
  return (
    <AuthenticationWrapper
      title="Modification de l'adresse email."
      texte="Entrez une adresse email valide."
      backButtonHref="/auth/connexion"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
    >
      <FormResetEmail />
    </AuthenticationWrapper>
  );
}
