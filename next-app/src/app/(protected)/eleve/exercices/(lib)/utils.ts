import { contentGapFillInput } from "@/shema-zod/exercice.shema";

export const isInputPosition = (
  pos: number,
  answers: contentGapFillInput["answers"]
) => answers.some((a) => a.position === pos);
