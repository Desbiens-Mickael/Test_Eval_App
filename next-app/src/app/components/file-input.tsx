"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

interface DragAndDropFileProps {
  multiple?: boolean;
}

export default function FileInput({ multiple = false }: DragAndDropFileProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);
  const imageMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  const handleChange = async (file: File | undefined) => {
    const formData = new FormData();

    if (file && imageMimeTypes.includes(file.type)) {
      formData.append("file", file);
      try {
        const res = await fetch("http://localhost:8000/uploadfile/", {
          method: "POST",
          body: formData,
        });
        const imgUrl = await res.json();
        setImageUrl(imgUrl.image_path);
      } catch (error) {
        console.error(error);
      } finally {
        ref.current?.reset();
      }
    } else {
      alert("Format d'imge non suporter");
      ref.current?.reset();
    }
  };

  const onDrop = (acceptedFiles: any) => {
    const file = acceptedFiles[0]; // Prend le premier fichier seulement
    if (file) {
      handleChange(file); // Appelle handleChange pour gérer le fichier
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused } = useDropzone({
    onDrop,
    multiple: multiple,
    accept: { "image/*": [".png", ".jpeg", ".gif", ".webp"] },
  });

  return (
    <>
      <form ref={ref} className="w-full">
        <div
          {...getRootProps({
            className: `
      flex justify-center items-center border-dashed border-2 rounded-md h-52 transition-colors cursor-pointer
      ${isDragAccept ? "border-green-500" : ""}
      ${isDragReject || (isDragActive && !isDragAccept) ? "border-red-500 animate-pulse" : ""}
      ${isFocused ? "border-blue-500" : ""}
      ${!isDragActive && !isFocused ? "border-slate-400/25" : ""}
    `,
          })}
        >
          <input {...getInputProps()} />
          {isDragAccept && <p className="text-lg text-slate-400/35 font-semibold">Glissez-déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>}
          {isDragReject && <p className="text-lg text-red-500 font-semibold">{"Ce type de fichier n'est pas autorisé !"}</p>}
          {!isDragActive && <p className="text-lg text-slate-400/35 font-semibold">Glissez-déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>}
        </div>
      </form>
      {imageUrl && (
        <div className="w-[300px] transition-all">
          <Image src={`http://upload-service:8000/image/${imageUrl}`} width={1000} height={800} alt="test" priority className="w-full h-auto mx-auto rounded-lg" />
        </div>
      )}
    </>
  );
}
