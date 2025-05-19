import LinkCta from "@/components/link-cta";
import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Image from "next/image";

export default function HeroMobile() {
  return (
    <div className="w-full">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src="/assets/images/hero-1.webp"
          alt="Enfants apprenant avec EduCraft"
          fill
          priority
          className="object-cover"
          quality={90}
        />
      </div>
      <div className="p-6 bg-background">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <h1
              className={cn(
                kodchasan.className,
                "text-3xl font-black text-foreground leading-tight tracking-tight"
              )}
            >
              {" Rendez l'apprentissage amusant et interactif pour vos enfants"}
            </h1>

            <p className="text-muted-foreground text-base leading-relaxed">
              Avec{" "}
              <span
                className={cn(
                  kodchasan.className,
                  "font-extrabold text-lg bg-clip-text text-transparent bg-primary-gradient"
                )}
              >
                EduCraft
              </span>
              , créez des leçons sur mesure et des exercices interactifs adaptés
              aux besoins de vos enfants.
            </p>
          </div>

          <div className="pt-2">
            <LinkCta
              href="/auth/inscription"
              text="Essayer maintenant"
              className="px-8 py-3.5 text-base font-semibold w-full justify-center"
            />
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="text-primary">🎓</span>
              <span>5-15 ans</span>
            </span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-500">⭐</span>
              <span>4.9/5 (200+ avis)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
