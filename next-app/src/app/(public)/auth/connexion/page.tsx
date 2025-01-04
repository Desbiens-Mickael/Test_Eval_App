import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormLogin from "@/components/auth/form-login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <AuthenticationWrapper
      title="Connexion"
      imagePath="/assets/images/login.webp"
      backButtonHref="/auth/inscription"
      backButtonText="Pas encore de compte ? CRÉER UN COMPTE"
      sociale
    >
      <FormLogin />
    </AuthenticationWrapper>
  );
}
