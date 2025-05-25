"use client";

import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { baseResponseExercice } from "@/type/exercice";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { GapFillActions } from "./GapFillActions";
import { GapFillContent } from "./GapFillContent";
import { useExerciseGapFill } from "./useExerciseGapFill";

interface ExerciseGapFillTextProps extends baseResponseExercice {
  content: contentGapFillInput;
}

export default function ExerciseGapFillText({
  exerciceId,
  content,
  level,
}: ExerciseGapFillTextProps) {
  const { inputs, isPending, handleInputChange, handleReset, handleSubmit } =
    useExerciseGapFill({ exerciceId, content, level });

  // Gestion des animations des champs de saisie
  useEffect(() => {
    const inputs = document.querySelectorAll("input[data-variants]");

    const handleFocus = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const variants = JSON.parse(input.dataset.variants || "{}");
      input.style.transform = `scale(${variants.focus?.scale || 1})`;
      input.style.borderColor = variants.focus?.borderColor || "";
      input.style.boxShadow = variants.focus?.boxShadow || "";
    };

    const handleBlur = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const variants = JSON.parse(input.dataset.variants || "{}");
      input.style.transform = `scale(${variants.initial?.scale || 1})`;
      input.style.borderColor = variants.initial?.borderColor || "";
      input.style.boxShadow = variants.initial?.boxShadow || "";
    };

    const handleMouseEnter = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (document.activeElement !== input) {
        const variants = JSON.parse(input.dataset.variants || "{}");
        input.style.transform = `scale(${variants.hover?.scale || 1})`;
        input.style.borderColor = variants.hover?.borderColor || "";
      }
    };

    const handleMouseLeave = (e: Event) => {
      const input = e.target as HTMLInputElement;
      if (document.activeElement !== input) {
        const variants = JSON.parse(input.dataset.variants || "{}");
        input.style.transform = `scale(${variants.initial?.scale || 1})`;
        input.style.borderColor = variants.initial?.borderColor || "";
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
      input.addEventListener("mouseenter", handleMouseEnter);
      input.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
        input.removeEventListener("mouseenter", handleMouseEnter);
        input.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [content.text]);

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GapFillContent
        content={content}
        inputs={inputs}
        onInputChange={handleInputChange}
      />

      <GapFillActions
        filledCount={Object.keys(inputs).length}
        totalCount={content.answers.length}
        onReset={handleReset}
        onSubmit={handleSubmit}
        isPending={isPending}
        disabled={Object.keys(inputs).length === 0}
      />
    </motion.div>
  );
}

// const replacePlaceholderByInputHTML = () => {
//   return content.text.map((word, index) => {
//     // Vérifie si la position actuelle correspond à un champ à remplir
//     if (isInputPosition(index, content.answers)) {
//       // Trouve la réponse correspondant à cette position
//       const answer = content.answers.find((a) => a.position === index);
//       // Vérifie si le placeholder contient des underscores (_____)
//       const match = answer?.placeholder.match(/_+/);

//       // Si pas de correspondance, retourne simplement le mot
//       if (!match) {
//         return (
//           <MotionSpan key={index} variants={item}>
//             {word}
//           </MotionSpan>
//         );
//       }

//       // Calcule la position et la largeur du champ de saisie
//       const startIndex = match.index ?? 0;
//       const width = match[0].length;

//       // Extrait le texte avant et après le placeholder
//       const beforeText = answer?.placeholder.slice(0, startIndex);
//       const afterText = answer?.placeholder.slice(startIndex + width);

//       // Retourne le champ de saisie avec le texte environnant
//       return (
//         <MotionSpan
//           key={index}
//           className="inline-flex items-baseline"
//           variants={item}
//           layout // Permet des animations de mise en page fluides
//         >
//           <span>{beforeText}</span>
//           <MotionDiv
//             className="inline-flex relative"
//             whileHover={{ scale: 1.02 }} // Effet de survol
//             whileTap={{ scale: 0.98 }} // Effet de clic
//           >
//             {/* Champ de saisie principal */}
//             <input
//               type="text"
//               value={inputs[index] || ""}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               style={{ width: `${Math.max(width, 2)}ch` }} // Largeur minimale de 2 caractères
//               className="px-2 py-1 mx-1 min-w-[40px] text-center bg-background border-b-2 border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 rounded-sm transition-all duration-200 text-foreground font-medium"
//               placeholder="?"
//               autoComplete="off"
//               // Données pour les animations personnalisées
//               data-variants={JSON.stringify(inputVariants)}
//               data-initial="initial"
//               data-while-focus="focus"
//               data-while-hover="hover"
//             />
//             {/* Ligne de soulignement animée */}
//             {inputs[index] && (
//               <MotionDiv
//                 className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/20"
//                 initial={{ scaleX: 0 }}
//                 animate={{ scaleX: 1 }}
//                 transition={{ duration: 0.3 }}
//               />
//             )}
//           </MotionDiv>
//           <span>{afterText}</span>
//         </MotionSpan>
//       );
//     } else {
//       // Retourne le texte normal sans champ de saisie
//       return (
//         <MotionSpan key={index} variants={item}>
//           {word}
//         </MotionSpan>
//       );
//     }
//   });
// };

// return (
//   <MotionDiv
//     className="w-full max-w-4xl mx-auto"
//     initial="hidden"
//     animate="show"
//     variants={container}
//   >
//     <div className="space-y-8">
//       {/* Zone de texte avec les champs à remplir */}
//       <MotionDiv
//         className="text-lg leading-relaxed p-6 bg-card rounded-xl border border-border shadow-sm"
//         style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
//         variants={item}
//       >
//         <AnimatePresence>
//           <MotionDiv
//             className="space-y-4"
//             variants={container}
//             initial="hidden"
//             animate="show"
//           >
//             {replacePlaceholderByInputHTML()}
//           </MotionDiv>
//         </AnimatePresence>
//       </MotionDiv>

//       {/* Zone des boutons d'action */}
//       <MotionDiv
//         className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-card rounded-xl border border-border shadow-sm"
//         variants={item}
//       >
//         <MotionDiv
//           className="flex items-center text-sm text-muted-foreground"
//           initial={{ opacity: 0, x: -10 }}
//           animate={{
//             opacity: 1,
//             x: 0,
//             transition: { delay: 0.3 },
//           }}
//         >
//           <span className="mr-2">Champs remplis :</span>
//           <MotionSpan
//             className="font-bold text-foreground"
//             key={Object.keys(inputs).length}
//             initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
//             animate={{ scale: 1, color: "hsl(var(--foreground))" }}
//             transition={{ duration: 0.3 }}
//           >
//             {Object.keys(inputs).length} / {content.answers.length}
//           </MotionSpan>
//         </MotionDiv>
