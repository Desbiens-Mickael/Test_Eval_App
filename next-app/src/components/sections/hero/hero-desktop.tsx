import LinkCta from "@/components/link-cta";
import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Image from "next/image";

export default function HeroDesktop() {
  return (
    <>
      <div className="flex-col items-center relative overflow-hidden rounded-xl shadow-xl min-h-[60vh]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/images/hero-1.webp"
            alt="Enfants apprenant avec EduCraft"
            fill
            priority
            className="object-cover"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/60" />
        </div>
        <div className="flex w-full min-h-[60vh] items-center justify-center p-6">
          <div className="bg-background/60 backdrop-blur-sm w-full max-w-4xl p-8 rounded-xl border border-border/30 shadow-lg flex flex-col items-center gap-6 text-center">
            <h1
              className={cn(
                kodchasan.className,
                "text-4xl font-black text-foreground leading-tight"
              )}
            >
              Rendez l'apprentissage amusant et interactif pour vos enfants
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl">
              Avec{" "}
              <span
                className={cn(
                  kodchasan.className,
                  "font-extrabold bg-clip-text text-transparent bg-primary-gradient"
                )}
              >
                EduCraft
              </span>
              , créez des leçons sur mesure et des exercices interactifs adaptés
              aux besoins de vos enfants. Suivez facilement leur progression et
              transformez leur éducation en une expérience engageante.
            </p>

            <div className="mt-4">
              <LinkCta
                href="/auth/inscription"
                text="Essayer maintenant"
                className="px-8 py-4 text-base font-semibold transition-transform hover:scale-105"
              />
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <span>🎓 Pour les 5-15 ans</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>⭐ 4.9/5 sur 200+ avis</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
