"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import AnswerList from "./answer-list";
import AnswerSelector from "./answerSelector";
import ShowContentGapFillPreview from "./show-content-gap-fill-preview";
import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";
import TextEditorWithAlert from "./textEditorWithAlert";

export interface AnswerInput {
  answer: string;
  placeholder: string;
  position: number;
}

export interface contentGapFillInput {
  text: string[];
  answers: AnswerInput[];
}

interface ContentFillGapTextFormProps {
  initialValue?: contentGapFillInput;
  onChange?: (newValue: contentGapFillInput) => void;
  isEditing?: boolean;
  className?: string;
}

export default function ContentFillGapTextForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentFillGapTextFormProps) {
  const { content, setInitialValues } = useContentGapFillTextStore();
  const [toggleMode, setToggleMode] = useState<boolean>(false);

  useEffect(() => {
    // Vérifie si initialValue est défini et valide
    const defaultValue = initialValue || { text: [], answers: [] };

    // Initialise uniquement si le contenu n'est pas déjà configuré
    setInitialValues(defaultValue, onChange);

    return () => {
      setInitialValues({ text: [], answers: [] }); // Vide les valeurs
    };
  }, [initialValue, onChange, setInitialValues]);

  useEffect(() => {
    if (initialValue?.text?.length) {
      setToggleMode(true);
    }
  }, [initialValue?.text?.length]);

  // Fonction pour générer le placeholder
  const replaceAllTextWithPlaceholder = useCallback(() => {
    if (!content?.text || content.text.length === 0) return ""; // Protection contre undefined
    const updatedText = [...content.text]; // Copie sécurisée
    for (let i = 0; i < content.answers?.length; i++) {
      if (updatedText[content.answers[i].position] !== undefined) {
        updatedText[content.answers[i].position] =
          content.answers[i].placeholder;
      }
    }
    return updatedText.join(""); // Retourne le texte modifié
  }, [content]);

  const handleToggleMode = () => {
    setToggleMode(!toggleMode);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait" initial={false}>
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex flex-col gap-6 p-6 bg-background rounded-xl",
              "border shadow-sm"
            )}
          >
            {!toggleMode ? (
              <TextEditorWithAlert handleToggleMode={handleToggleMode} />
            ) : (
              <div className="space-y-6">
                <AnswerSelector
                  handleToggleMode={handleToggleMode}
                  modifiedText={replaceAllTextWithPlaceholder()}
                />
                
                {content.answers?.length > 0 && (
                  <motion.div
                    key="answer-list-container"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <AnswerList />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ShowContentGapFillPreview
              modifiedText={replaceAllTextWithPlaceholder()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
