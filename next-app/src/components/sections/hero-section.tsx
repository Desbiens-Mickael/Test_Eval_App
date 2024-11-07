import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import Image from "next/image";
import LinkCta from "../link-cta";

export default function HeroSection() {
  const kodchasanFont = kodchasan.className;
  return (
    <div className="w-full flex flex-col items-center relative">
      <Image src="/assets/images/hero-1.webp" alt="hero" width={1000} height={500} priority className="w-full h-auto object-cover" />
      <div className="bg-white/20 backdrop-blur-sm w-full py-4 px-6 rounded-lg flex flex-col items-center justify-center gap-6 text-center lg:absolute lg:bottom-[10%] lg:left-auto lg:w-[90%]">
        <h1 className={cn(kodchasanFont, "text-foreground text-xl lg:text-4xl font-black")}>Rendez l'apprentissage amusant et interactif pour vos enfants</h1>
        <p className="text-foreground text-sm text-justify lg:text-lg font-semibold">
          Avec <span className="text-lg lg:text-xl font-extrabold bg-clip-text text-transparent bg-primary-gradient drop-shadow">EduCraft</span>, créez des leçons sur mesure et des exercices
          interactifs adaptés aux besoins de vos enfants. Suivez facilement leur progression et transformez leur éducation en une expérience engageante
        </p>
        <LinkCta href="/auth/inscription" text="Essayer maintenant" />
      </div>
    </div>
  );
}
