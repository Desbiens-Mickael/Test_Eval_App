"use client";

import { cn } from "@/lib/utils";
import { kodchasan } from "@/style/fonts";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";

// Interface des props attendues par le composant
interface ScrollingSubjectBannerProps {
  subjects: string[]; // Liste des sujets à faire défiler
  baseVelocity: number; // Vitesse de base du défilement
}

// Composant principal pour créer une bannière de texte défilant
export default function ScrollingSubjectBanner({ subjects, baseVelocity }: ScrollingSubjectBannerProps) {
  const kodchasanFont = kodchasan.className;
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };
  // Création d'une motion value réactive pour la position horizontale (x)
  const baseX = useMotionValue(0);

  // Récupération de la position verticale du défilement de la page
  const { scrollY } = useScroll();

  // Extraction de la vitesse de défilement vertical
  const scrollVelocity = useVelocity(scrollY);

  // Applique un effet de ressort à la vitesse pour la rendre plus fluide
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50, // Plus la valeur est grande, plus le mouvement est amorti rapidement
    stiffness: 400, // Détermine la rapidité avec laquelle la vitesse atteint sa cible
  });

  // Transforme la vitesse de défilement vertical en un facteur de vitesse pour le texte
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false, // Ne pas limiter la valeur entre 0 et 5, mais garder les extrêmes
  });

  // Transformation de la valeur de position de base pour créer un défilement infini
  // Le wrap permet de réinitialiser la position une fois que le texte a défilé complètement hors écran
  const x = useTransform(baseX, (v) => `${wrap(-100, 0, v)}%`);

  // Ref pour conserver le sens de direction du défilement (1 = droite, -1 = gauche)
  const directionFactor = useRef<number>(1);

  // Fonction d'animation qui est appelée à chaque frame de l'animation
  useAnimationFrame((t, delta) => {
    // Calcule la distance à déplacer à chaque frame
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Change de direction si la vitesse de défilement est négative
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    // Ajuste la distance à parcourir selon la vitesse du défilement
    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    // Met à jour la position horizontale de base (baseX) pour provoquer le défilement
    baseX.set(baseX.get() + moveBy);
  });

  return (
    // Conteneur principal pour la bannière avec overflow hidden pour empêcher le débordement
    <div className="w-screen overflow-hidden">
      {/* Conteneur animé contenant le texte défilant */}
      <motion.div
        className="h-[60px] md:h-[80px] flex justify-center items-center text-3xl md:text-5xl text-primary whitespace-nowrap"
        style={{ x }} // Applique la transformation x pour provoquer le mouvement
        aria-live="polite" // Pour rendre le contenu accessible aux lecteurs d'écran
      >
        {/* Duplication des sujets pour permettre un défilement infini */}
        {[...subjects, ...subjects, ...subjects, ...subjects].map((subject, index) => (
          <span key={index} className={cn(kodchasanFont, "text-stroke font-black drop-shadow-sm px-4 md:px-8 block")}>
            {subject}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
