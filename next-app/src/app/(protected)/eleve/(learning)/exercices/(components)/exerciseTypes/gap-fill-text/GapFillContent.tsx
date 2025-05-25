import { container, item } from "@/animations/exercice-gap-fill";
import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { AnimatePresence, motion } from "framer-motion";
import { isInputPosition } from "../../../(lib)/utils";
import { GapFillWord } from "./GapFillWord";

/**
 * Propriétés du composant GapFillContent
 * @interface GapFillContentProps
 * @property {contentGapFillInput} content - Le contenu de l'exercice avec le texte et les réponses attendues
 * @property {Record<number, string>} inputs - Les valeurs actuelles des champs de saisie
 * @property {(position: number, value: string) => void} onInputChange - Fonction appelée quand une valeur change
 */
interface GapFillContentProps {
  content: contentGapFillInput;
  inputs: Record<number, string>;
  onInputChange: (position: number, value: string) => void;
}

/**
 * Composant qui affiche le contenu d'un exercice de type "texte à trous".
 * Gère l'affichage du texte avec les champs de saisie aux positions spécifiées.
 *
 * @component
 * @param {GapFillContentProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant d'affichage du contenu de l'exercice
 */
export function GapFillContent({
  content,
  inputs,
  onInputChange,
}: GapFillContentProps) {
  return (
    <motion.div variants={item}>
      <AnimatePresence>
        <motion.div
          className="leading-relaxed p-6 bg-card rounded-xl border border-border shadow-sm whitespace-pre-line break-words"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {content.text.map((word, index) => {
            const isInput = isInputPosition(index, content.answers);
            const answer = content.answers.find((a) => a.position === index);

            return (
              <GapFillWord
                key={index}
                word={word}
                isInput={isInput}
                answer={answer}
                value={inputs[index] || ""}
                onChange={(value) => onInputChange(index, value)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
