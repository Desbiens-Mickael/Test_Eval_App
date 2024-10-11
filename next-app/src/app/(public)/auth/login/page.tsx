import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormLogin from "@/components/auth/form-login";

export default function LoginPage() {
  return (
    <AuthenticationWrapper
      title="Connexion"
      imagePath="/assets/images/login.webp"
      backButtonHref="/auth/register"
      backButtonText="Pas encore de compte ? CRÉER UN COMPTE"
      sociale
      form={<FormLogin />}
    />
  );
}
