"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import GoogleSIgnInButton from "./google-signin-button";

interface AuthenticationWraperProps {
  title: string;
  texte?: string;
  imagePath?: string;
  form: JSX.Element;
  sociale?: boolean;
  backButtonText: string;
  backButtonHref: string;
  backButtonIcon?: JSX.Element;
}

export default function AuthenticationWrapper({ title, texte, imagePath, form, backButtonText, backButtonHref, backButtonIcon, sociale = false }: AuthenticationWraperProps) {
  return (
    <div className="lg:h-full w-full flex flex-col justify-center items-center md:p-16">
      <div className="overflow-hidden w-full h-auto max-w-[1350px] flex-col items-center justify-center bg-background border shadow-md sm:w-[80%] lg:w-full lg:min-h-[650px] lg:grid lg:grid-cols-2 lg:px-0 lg:rounded-lg">
        <div className="relative min-h-[400px] lg:h-full w-full">
          <Image src={imagePath ? imagePath : "/assets/images/register.webp"} fill alt="register" priority className="w-auto h-full" />
        </div>
        <div className="py-8 px-4 w-full flex flex-col justify-center items-center gap-8">
          <div className="w-full xl:w-[80%] space-y-4">
            <h1 className="text-4xl text-foreground font-bold text-center">🔐 {title}</h1>
            {texte && <p className="text-sm text-center">{texte}</p>}
          </div>
          {form}
          {sociale && (
            <div className="w-full xl:w-[80%] flex flex-col gap-4">
              <div className="w-full flex items-center gap-4">
                <Separator className="shrink" />
                <p className="w-full text-center text-xs uppercase">ou continuer avec</p>
                <Separator className="shrink" />
              </div>
              <GoogleSIgnInButton />
            </div>
          )}
          <Button variant={"link"} asChild>
            <Link href={backButtonHref} className="gap-2">
              {backButtonIcon && backButtonIcon} {backButtonText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
