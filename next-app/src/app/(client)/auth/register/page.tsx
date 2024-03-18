import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormRegister from "@/components/auth/form-register";
import { LogIn } from "lucide-react";

export default function RegisterPage() {
  return (
    <AuthenticationWrapper
      title="Créer un compte"
      texte="Entrez votre email et un mot de passe ci-dessous pour créer votre compte"
      backButtonHref="/auth/login"
      backButtonText="Connexion"
      backButtonIcon={<LogIn size={20} />}
      form={<FormRegister />}
    />
  );
}
