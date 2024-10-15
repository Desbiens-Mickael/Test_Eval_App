import FormResetEmail from "@/app/(protected)/acount/_components/form-reset-email";
import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import { LogIn } from "lucide-react";

export default function ResetEmailPage() {
  return (
    <AuthenticationWrapper
      title="Modification de l'adresse email."
      texte="Entrez une adresse email valide."
      backButtonHref="/auth/login"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
      form={<FormResetEmail />}
    />
  );
}
