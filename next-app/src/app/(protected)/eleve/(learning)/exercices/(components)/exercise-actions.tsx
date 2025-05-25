import ButtonReset from "@/components/button-reset";
import SubmitButton from "@/components/form/submit-button";
import { motion } from "framer-motion";

/**
 * Propriétés du composant GapFillActions
 * @interface GapFillActionsProps
 * @property {string} textCount - Texte affiché avant le compteur
 * @property {number} filledCount - Nombre de champs remplis
 * @property {number} totalCount - Nombre total de champs à remplir
 * @property {() => void} onReset - Fonction appelée lors du clic sur le bouton de réinitialisation
 * @property {() => void} onSubmit - Fonction appelée lors de la soumission du formulaire
 * @property {boolean} isPending - Indique si une action est en cours
 * @property {boolean} [disabled=false] - Indique si les boutons doivent être désactivés
 */
interface ExerciseActionsProps {
  textCount?: string;
  filledCount: number;
  totalCount: number;
  onReset: () => void;
  onSubmit: () => void;
  isPending: boolean;
  disabled?: boolean;
}

/**
 * Composant qui affiche les actions disponibles pour un exercice de type "texte à trous".
 * Inclut le compteur de champs remplis et les boutons de réinitialisation et de soumission.
 *
 * @component
 * @param {ExerciseActionsProps} props - Les propriétés du composant
 * @returns {JSX.Element} Le composant d'actions de l'exercice
 */
export function ExerciseActions({
  textCount = "Accomplis",
  filledCount,
  totalCount,
  onReset,
  onSubmit,
  isPending,
  disabled = false,
}: ExerciseActionsProps) {
  return (
    <motion.div
      className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-card rounded-xl border border-border shadow-sm"
      variants={item}
    >
      <motion.div
        className="flex items-center text-sm text-muted-foreground"
        initial={{ opacity: 0, x: -10 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { delay: 0.3 },
        }}
      >
        <span className="mr-2">{textCount} :</span>
        <motion.span
          className="font-bold text-foreground"
          key={filledCount}
          initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
          animate={{ scale: 1, color: "hsl(var(--foreground))" }}
          transition={{ duration: 0.3 }}
        >
          {filledCount} / {totalCount}
        </motion.span>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.4 },
        }}
      >
        <ButtonReset
          onClick={onReset}
          isPending={isPending}
          className="w-full sm:w-auto"
          text="Réinitialiser"
        />
        <SubmitButton
          onClick={onSubmit}
          className="w-full sm:w-auto"
          texte="Soumettre"
          isLoading={isPending}
          disabled={disabled}
        />
      </motion.div>
    </motion.div>
  );
}

// Variantes d'animation pour les éléments individuels
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};
