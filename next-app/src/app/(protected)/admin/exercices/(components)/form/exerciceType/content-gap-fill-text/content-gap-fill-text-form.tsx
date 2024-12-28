"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import { contentGapFillInput } from "@/shema-zod/exercice.shema";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AnswerInput {
  answer: string;
  placeholder: string;
  position: number;
}

interface contentGapFillInput {
  text: string[];
  answers: AnswerInput[];
}

interface ContentFillGapTextFormProps {
  initialValue?: contentGapFillInput;
  onChange?: (newValue: contentGapFillInput) => void;
  isEditing?: boolean;
}

export default function ContentFillGapTextForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentFillGapTextFormProps) {
  const [content, setContent] = useState<contentGapFillInput>(initialValue!);
  const [answers, setAnswers] = useState<AnswerInput[]>(
    initialValue?.answers ?? []
  );
  const [inputAnswer, setInputAnswer] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content]);

  useEffect(() => {
    if (initialValue?.text?.length) {
      setIsPreviewMode(true);
    }
  }, []);

  const generatePlaceholder = (answer: string, selectedText: string) => {
    // Trouver la position de selectedText dans answer
    const startIndex = answer.indexOf(selectedText);

    if (startIndex === -1) {
      // Si selectedText n'est pas trouvé, retourner l'answer tel quel
      return answer;
    }

    // Générer le placeholder pour la sélection
    const placeholder =
      answer.substring(0, startIndex) + // Partie avant la sélection
      "_".repeat(selectedText.length) + // Remplacer la sélection
      answer.substring(startIndex + selectedText.length); // Partie après la sélection

    return placeholder;
  };

  const handleQuestionChange = (value: string) => {
    const words = value.match(/[\wÀ-ÿ]+(?:['’-][\wÀ-ÿ]+)*|[.,!?;:]|\s+/g) || [];

    setContent({
      text: words,
      answers: [],
    });
    setAnswers([]);
  };

  const handleAnswerAdd = () => {
    const inputAnswerTrimmed = inputAnswer.trim();
    if (!inputAnswerTrimmed) {
      toast.error("La réponse ne peut pas être vide.");
      return;
    }

    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    if (!selection || !range) {
      toast.error("Sélection invalide.");
      return;
    }

    const selectedText = selection.toString().trim(); // Texte sélectionné

    // Calculer l'index en utilisant uniquement les mots
    let currentIndex = 0;
    let foundIndex = -1;

    for (let i = 0; i < content.text.length; i++) {
      const word = content.text[i];

      // Vérifier si la sélection correspond au mot ou partie d'un mot
      if (
        word.includes(selectedText) && // Correspondance trouvée dans ce mot
        range.startOffset >= currentIndex && // Commence à l'intérieur de ce mot
        range.startOffset <= currentIndex + word.length // Se termine dans ce mot
      ) {
        foundIndex = i;
        break;
      }

      // Avancer l'index (en tenant compte des espaces)
      currentIndex += word.length;
    }

    if (foundIndex === -1) {
      toast.error("Mot non trouvé dans le texte.");
      return;
    }

    const wordToReplace = content.text[foundIndex]; // Mot complet sélectionné

    // Vérifier si le mot est déjà ajouté
    if (answers.some((answer) => answer.position === foundIndex)) {
      toast.error("Ce mot a déjà été ajouté comme réponse.");
      return;
    }

    // Générer un placeholder pour tout le mot sélectionné
    const placeholder = generatePlaceholder(wordToReplace, selectedText);

    // Ajouter la réponse
    const newAnswers: AnswerInput[] = [
      ...answers,
      { answer: wordToReplace, placeholder, position: foundIndex },
    ];

    // Mettre à jour le contenu avec la réponse ajoutée
    setContent({
      ...content,
      answers: newAnswers,
    });
    setAnswers(newAnswers);
    setInputAnswer("");
  };

  const handleAnswerRemove = (position: number) => {
    const removedAnswer = answers.find(
      (answer) => answer.position === position
    );
    if (!removedAnswer) return;

    // Restaurer le mot original dans content.text
    const updatedText = [...content.text];
    updatedText[position] = removedAnswer.answer;

    const newAnswers = answers.filter((answer) => answer.position !== position);

    setContent({
      text: updatedText,
      answers: newAnswers,
    });
    setAnswers(newAnswers);
  };

  const handleSelection = () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      setInputAnswer(selectedText);
    } else {
      setInputAnswer("");
    }
  };

  const generateFullText = () => {
    const updatedText = [...content.text];
    const simboles = [",", "."];
    const text: string[] = updatedText.map((word, index) =>
      simboles.includes(word) || index === 0 ? word : " " + word
    );

    return text.join("");
  };

  const replaceAllTextWithPlaceholder = () => {
    const updatedText = [...content.text];
    for (let i = 0; i < answers.length; i++) {
      updatedText[answers[i].position] = answers[i].placeholder;
    }
    return updatedText.join("");
  };

  return (
    <>
      {isEditing ? (
        <div className="flex flex-col gap-4 border border-dashed border-primary-200 p-4 rounded-lg">
          <div className="flex flex-col gap-1">
            {!isPreviewMode ? (
              <>
                {answers.length > 0 && (
                  <Alert variant={"warning"}>
                    <AlertTitle>Attention !</AlertTitle>
                    <AlertDescription>
                      Modifier le texte réinitialisera définitivement toutes les
                      réponses, y compris celles déjà sauvegardées.
                    </AlertDescription>
                  </Alert>
                )}
                <Label className="mb-1" htmlFor="baseText">
                  Texte
                </Label>
                <Textarea
                  id="baseText"
                  className="min-h-[200px] w-full resize-none"
                  placeholder="Entrer le contenu de l'exercice..."
                  value={content.text && content.text.join("")}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  onMouseUp={handleSelection}
                  onKeyUp={handleSelection}
                />
                <Button onClick={() => setIsPreviewMode(true)}>Valider</Button>
              </>
            ) : (
              <>
                <p
                  onMouseUp={handleSelection}
                  className="min-h-[200px] w-full p-4 border rounded-md whitespace-pre-wrap"
                >
                  {replaceAllTextWithPlaceholder()}
                </p>
                <Button onClick={() => setIsPreviewMode(false)}>
                  Modifier
                </Button>
              </>
            )}
          </div>
          {answers.length > 0 && (
            <div>
              <span className="font-semibold">Réponses : </span>
              {answers.map((answer) => (
                <div key={answer.position} className="flex items-center gap-1">
                  <Button
                    type="button"
                    className="size-fit p-1 ms-2 text-destructive bg-transparent hover:bg-destructive/30 hover:text-destructive focus:text-destructive transition-colors"
                    onClick={() => handleAnswerRemove(answer.position)}
                  >
                    <X size={16} />
                  </Button>
                  <span>{`${answer.answer}`}</span>
                </div>
              ))}
            </div>
          )}
          {inputAnswer && isPreviewMode && (
            <div className="w-fit flex items-center gap-2 bg-background-200 rounded-lg p-2 shadow-md">
              <span className="font-semibold">{inputAnswer}</span>
              <Button size={"sm"} type="button" onClick={handleAnswerAdd}>
                Remplacer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Texte modifier
            </h3>
            <p className="w-full p-4 whitespace-pre-wrap">
              {replaceAllTextWithPlaceholder()}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">
              Reponses à trouver
            </h3>
            <div className="flex items-center gap-2">
              {answers.map((answer) => (
                <div key={answer.position} className="flex items-center gap-1">
                  <span>
                    {`[ ${answer.position} ] ${answer.answer}`}
                    {answer.position !== answers.length && " -"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
