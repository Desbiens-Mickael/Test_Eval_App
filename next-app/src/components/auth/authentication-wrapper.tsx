import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface AuthenticationWraperProps {
  title: string;
  texte?: string;
  imagePath?: string;
  children: React.ReactNode;
  sociale?: boolean;
  backButtonText?: string;
  backButtonHref?: string;
  backButtonIcon?: JSX.Element;
}

export default function AuthenticationWrapper({
  title,
  texte,
  imagePath,
  children,
  backButtonText,
  backButtonHref,
  backButtonIcon,
}: AuthenticationWraperProps) {
  return (
    <div className="lg:h-full w-full flex flex-col justify-center items-center md:p-16">
      <div className="overflow-hidden w-full h-auto max-w-[1350px] flex-col items-center justify-center bg-background border shadow-md sm:w-[80%] lg:w-full lg:min-h-[650px] lg:grid lg:grid-cols-2 lg:px-0 lg:rounded-lg">
        <div className="relative min-h-[400px] max-h-[600px] lg:h-full w-full self-start">
          <Image
            src={imagePath ? imagePath : "/assets/images/register.webp"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="register"
            priority
          />
        </div>
        <div className="py-8 px-4 w-full flex flex-col justify-center items-center gap-8">
          <div className="w-full xl:w-[80%] space-y-4">
            <h1 className="text-4xl text-foreground font-bold text-center">
              🔐 {title}
            </h1>
            {texte && <p className="text-sm text-center">{texte}</p>}
          </div>
          {children}

          {backButtonText && backButtonHref && (
            <Button variant={"link"} asChild>
              <Link href={backButtonHref} className="gap-2">
                {backButtonIcon && backButtonIcon} {backButtonText}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
