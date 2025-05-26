import { inputVariants } from "@/animations/exercice-gap-fill";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  answer: string;
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
  answer,
  onChange,
  width,
  placeholder = "?",
}: GapFillInputProps) {
  const [inputWidth, setInputWidth] = useState<string>(
    `${Math.max(width, 2)}ch`
  );
  const spanRef = useRef<HTMLSpanElement>(null);

  // Calcule la largeur du texte à afficher
  useEffect(() => {
    if (spanRef.current) {
      // Utilise la valeur si elle existe, sinon utilise le placeholder
      const textToMeasure = answer || placeholder;
      spanRef.current.textContent = textToMeasure;

      // Obtient la largeur du texte et ajoute une petite marge
      const textWidth = spanRef.current.getBoundingClientRect().width;
      const minWidth = Math.max(width, 2) * 8; // Approximation de la largeur d'un caractère en pixels

      // Utilise la plus grande des deux valeurs
      setInputWidth(`${Math.max(textWidth, minWidth)}px`);
    }
  }, [value, answer, placeholder, width]);

  return (
    <motion.div
      className="inline-flex relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Span invisible pour mesurer la largeur du texte */}
      <span
        ref={spanRef}
        className="absolute opacity-0 pointer-events-none font-medium whitespace-pre"
        aria-hidden="true"
      >
        {value || answer || placeholder}
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: inputWidth }}
        className="min-w-[1ch] h-5 text-center bg-background border-b-2 border-primary/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 rounded-sm transition-all duration-200 text-foreground font-medium"
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
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
