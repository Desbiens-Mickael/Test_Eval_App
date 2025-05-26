import { item } from "@/animations/exercice-gap-fill";
import { motion } from "framer-motion";
import { GapFillInput } from "./gap-fill-input";

/**
 * Propriétés du composant GapFillWord
 * @interface GapFillWordProps
 * @property {string} word - Le mot à afficher ou le texte du placeholder si c'est un champ de saisie
 * @property {boolean} isInput - Indique si ce mot doit être affiché comme un champ de saisie
 * @property {Object} [answer] - Les informations sur la réponse attendue (optionnel)
 * @property {number} answer.position - La position de la réponse dans le texte
 * @property {string} answer.answer - La réponse attendue
 * @property {string} value - La valeur actuelle du champ de saisie
 * @property {(value: string) => void} onChange - Fonction appelée quand la valeur du champ change
 */
interface GapFillWordProps {
  word: string;
  isInput: boolean;
  answer?: {
    position: number;
    answer: string;
    placeholder: string;
  };
  value: string;
  onChange: (value: string) => void;
}

/**
 * Composant qui affiche un mot dans un exercice de type "texte à trous".
 * Peut afficher un mot normal ou un champ de saisie selon la propriété isInput.
 *
 * @component
 * @param {GapFillWordProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant d'affichage d'un mot ou d'un champ de saisie
 */
export function GapFillWord({
  word,
  isInput,
  answer,
  value,
  onChange,
}: GapFillWordProps) {
  if (!isInput || !answer) {
    return <motion.span variants={item}>{word} </motion.span>;
  }

  const match = answer.placeholder.match(/_+/);
  if (!match) {
    return <motion.span variants={item}>{word} </motion.span>;
  }

  const startIndex = match.index ?? 0;
  const width = match[0].length;
  const beforeText = answer.placeholder.slice(0, startIndex);
  const afterText = answer.placeholder.slice(startIndex + width);

  return (
    <motion.span variants={item} className="inline-flex items-baseline" layout>
      {beforeText && <span>{beforeText}</span>}
      <GapFillInput
        value={value}
        answer={answer.answer}
        onChange={onChange}
        width={width}
      />
      {afterText && <span>{afterText} </span>}
    </motion.span>
  );
}
