"use client";

import { useContentGapFillTextStore } from "./store/store-content-gap-fill-test";

interface ShowPReviewMUltipleChoiceProps {
  modifiedText: string;
}

export default function ShowContentGapFillPreview({
  modifiedText,
}: ShowPReviewMUltipleChoiceProps) {
  const { content } = useContentGapFillTextStore();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Texte modifier
        </h3>
        <p className="w-full p-4 whitespace-pre-wrap">{modifiedText}</p>
      </div>
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">
          Reponses à trouver
        </h3>
        <div className="flex items-center gap-2">
          {content.answers?.map((answer, index) => (
            <div key={answer.position} className="flex items-center gap-1">
              <span>
                {`${answer.answer}`}
                {index !== content.answers?.length - 1 && " -"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
