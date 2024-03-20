import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormRegister from "@/components/auth/form-register";

export default function RegisterPage() {
  return (
    <AuthenticationWrapper
      title="Créer un compte"
      texte="Renseignez les champs ci-dessous pour créer votre compte"
      backButtonHref="/auth/login"
      backButtonText="Vous avez déjà un compte ? SE CONNECTER"
      form={<FormRegister />}
    />
  );
}
