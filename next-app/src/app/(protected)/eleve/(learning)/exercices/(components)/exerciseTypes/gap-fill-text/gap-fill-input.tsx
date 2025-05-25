import { inputVariants } from "@/animations/exercice-gap-fill";
import { motion } from "framer-motion";

/**
 * Propriétés du composant GapFillInput
 * @interface GapFillInputProps
 * @property {string} value - La valeur actuelle du champ
 * @property {(value: string) => void} onChange - Fonction appelée quand la valeur change
 * @property {number} width - La largeur du champ en nombre de caractères
 * @property {string} [placeholder='?'] - Le texte à afficher quand le champ est vide
 */
interface GapFillInputProps {
  value: string;
  onChange: (value: string) => void;
  width: number;
  placeholder?: string;
}

/**
 * Composant d'entrée personnalisé pour les exercices de type "texte à trous".
 * Affiche un champ de saisie avec une animation et une mise en forme personnalisée.
 *
 * @component
 * @param {GapFillInputProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant de champ de saisie personnalisé
 */
export function GapFillInput({
  value,
  onChange,
  width,
  placeholder = "?",
}: GapFillInputProps) {
  return (
    <motion.div
      className="inline-flex relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: `${Math.max(width, 2)}ch` }}
        className="min-w-[1ch] text-center bg-background border-b-2 border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 rounded-sm transition-all duration-200 text-foreground font-medium"
        placeholder={placeholder}
        autoComplete="off"
        data-variants={JSON.stringify(inputVariants)}
        data-initial="initial"
        data-while-focus="focus"
        data-while-hover="hover"
      />
      {value && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
