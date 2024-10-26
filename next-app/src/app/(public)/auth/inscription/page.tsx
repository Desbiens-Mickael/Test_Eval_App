import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormRegister from "@/components/auth/form-register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription",
};

export default function RegisterPage() {
  return (
    <AuthenticationWrapper
      title="Inscription"
      texte="Renseignez les champs ci-dessous pour créer votre compte"
      backButtonHref="/auth/connexion"
      backButtonText="Vous avez déjà un compte ? SE CONNECTER"
    >
      <FormRegister />
    </AuthenticationWrapper>
  );
}
