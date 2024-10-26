import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import PasswordResetSubmissionForm from "@/components/auth/password-reset-submission-form";
import { LogIn } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe",
};

export default function ResetPasswordPage() {
  return (
    <AuthenticationWrapper
      title="Réinitialiser le mot de passe"
      texte="Un lien va être envoyé à votre adresse e-mail afin de réinitialiser votre mot de passe."
      backButtonHref="/auth/connexion"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
    >
      <PasswordResetSubmissionForm />
    </AuthenticationWrapper>
  );
}
