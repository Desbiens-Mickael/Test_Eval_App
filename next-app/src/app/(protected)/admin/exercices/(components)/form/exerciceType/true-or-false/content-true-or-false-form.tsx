"use client";

import { trueOrFalseInput } from "@/shema-zod/exercice.shema";

export interface TrueFalseFormProps {
  initialValue?: trueOrFalseInput[];
  isEditing?: boolean;
}

export default function TrueFalseForm({
  initialValue,
  isEditing,
}: TrueFalseFormProps) {
  return <h1>True_falseContent</h1>;
}
