"use client";

import FormLogin from "@/components/auth/form-login";
import GoogleSIgnInButton from "@/components/auth/google-signin-button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
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
    <div className="lg:h-full w-full flex flex-col justify-center items-center md:p-16">
      <div className="overflow-hidden w-full h-auto max-w-[1350px] flex-col items-center justify-center bg-background border shadow-md md:w-[80%] lg:w-full lg:min-h-[650px] lg:grid lg:grid-cols-2 lg:px-0 lg:rounded-lg">
        <div className="relative min-h-[400px] lg:h-full w-full">
          <Image src={"/assets/images/register.webp"} fill alt="register" priority className="w-auto h-full" />
        </div>
        <div className="py-8 px-4 w-full flex flex-col justify-center items-center gap-8">
          <div className="w-full xl:w-[80%] space-y-4">
            <h1 className="text-4xl text-foreground font-bold text-center">Connexion</h1>
            <p className="text-sm text-center">Entrez votre email et votre mot de passe ci-dessous pour vous connecter</p>
          </div>
          <FormLogin />
          <div className="w-full xl:w-[80%] flex items-center gap-4">
            <Separator className="shrink" />
            <p className="w-full text-center text-xs uppercase">ou continuer avec</p>
            <Separator className="shrink" />
          </div>
          <GoogleSIgnInButton />
        </div>
      </div>
    </div>
  );
}
