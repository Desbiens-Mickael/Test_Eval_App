import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormResetPassword from "@/components/auth/form-reset-password";
import { LogIn } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
};

export default function NewPasswordPage() {
  return (
    <AuthenticationWrapper
      title="Créer un nouveau mot de passe"
      texte="Pour protéger votre compte, choisissez un mot de passe de plus de 6 caractères."
      backButtonHref="/auth/connexion"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
    >
      <FormResetPassword />
    </AuthenticationWrapper>
  );
}
