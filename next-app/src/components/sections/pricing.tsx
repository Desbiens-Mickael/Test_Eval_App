"use client";
import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import LinkCta from "../link-cta";

export default function Pricing() {
  const kodchasanFont = kodchasan.className;

  return (
    <section className="w-full bg-gradient-to-b from-background to-muted/30 py-16 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2
              className={cn(
                kodchasanFont,
                "text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
              )}
            >
              {"Prêt à révolutionner l'apprentissage ?"}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Rejoignez la communauté{" "}
              <span
                className={cn(
                  kodchasanFont,
                  "font-extrabold bg-clip-text text-transparent bg-primary-gradient"
                )}
              >
                EduCraft
              </span>{" "}
              et transformez chaque leçon en une aventure éducative captivante.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <LinkCta
              href="/auth/inscription"
              text="Démarrer l'aventure"
              className="px-8 py-4 text-base font-medium transition-all hover:scale-105"
            />
            <LinkCta
              href="/auth/inscription"
              text="Découvrir les offres"
              LinkType="outline"
              className="px-8 py-4 text-base font-medium transition-all hover:scale-105"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Essai gratuit de 14 jours. Aucune carte de crédit requise.
          </p>
        </div>
      </div>
    </section>
  );
}
