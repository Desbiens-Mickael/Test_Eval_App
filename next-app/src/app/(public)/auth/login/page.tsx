"use client";

import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import FormLogin from "@/components/auth/form-login";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  const urlError = useSearchParams().get("error") === "OAuthAccountNotLinked" ? "Action impossible avec cet email." : "";

  useEffect(() => {
    if (urlError) {
      setError(urlError);
      toast.error(error);
    }
  }, [urlError, error]);

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
