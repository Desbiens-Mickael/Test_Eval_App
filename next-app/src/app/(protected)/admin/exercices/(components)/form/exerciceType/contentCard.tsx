"use client";

import { createExerciceFormInput } from "@/shema-zod/exercice.shema";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface ContentCardProps {
  form: UseFormReturn<createExerciceFormInput, any, undefined>;
  onChange: (newContent: string) => void;
}

export default function ContentCard({ form, onChange }: ContentCardProps) {
  const [content, setContent] = useState([]);

  const handleCreateColumn = (newColumn: string) => {
    // setContent((prevContent) => [...prevContent, newColumn]);
  };

  return (
    <div
      onChange={(newContent) => {
        // onChange(newContent); // Synchronise avec react-hook-form
        console.log(newContent);
      }}
    >
      test
    </div>
  );
}
