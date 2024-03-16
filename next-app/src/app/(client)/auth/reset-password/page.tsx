import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import PasswordResetSubmissionForm from "@/components/auth/password-reset-submission-form";
import { LogIn } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <AuthenticationWrapper title="Réinitialisation du mot de passe 2" texte="Entrez votre votre email." backButtonHref="/auth/login" backButtonText="Connexion" backButtonIcon={<LogIn size={20} />}>
      <PasswordResetSubmissionForm />
    </AuthenticationWrapper>
  );
}
