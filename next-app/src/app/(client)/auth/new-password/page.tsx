import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormResetPassword from "@/components/auth/form-reset-password";
import { LogIn } from "lucide-react";

export default function NewPasswordPage() {
  return (
    <AuthenticationWrapper
      title="Réinitialisation du mot de passe"
      texte="Entrez votre nouveau mot de passe."
      backButtonHref="/auth/login"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
    >
      <FormResetPassword />
    </AuthenticationWrapper>
  );
}
