"use client";

import { Input } from "@/components/ui/input";
import { useUpdateUserAvatar } from "@/hooks/data/mutations/use-update-user-avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, UserRound } from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import SubmitButton from "../form/submit-button";
import { Button } from "../ui/button";

interface DragAndDropFileProps {
  image?: string;
}

export default function AvatarUpload({ image }: DragAndDropFileProps) {
  const { isPending, mutate } = useUpdateUserAvatar();
  const [imagePreview, setImagePreview] = useState<string | null>(image ?? null);
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>, file: File | undefined) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        mutate(formData);
      } catch (error) {
        toast.error("une erreur c'est produite!");
      } finally {
        setOpen(false);
      }
    }
  };

  const handleShowformUpload = () => {
    setOpen((prev) => !prev);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        try {
          setFile(acceptedFiles[0]);
          setImagePreview(URL.createObjectURL(acceptedFiles[0]));
        } catch (error) {
          toast.error("une erreur c'est produite!");
          console.error(error);
        }
      }
    },
    [setImagePreview, setFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, isFocused } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
  });

  const acceptText = "Déposez un fichier ici, ou cliquez pour le sélectionner.";
  const rejectText = "Ce type de fichier n'est pas autorisé !";

  return (
    <>
      <div className="relative w-[150px] h-[150px] mx-auto mb-5">
        <Button variant={"ghost"} onClick={() => handleShowformUpload()} className="absolute z-10 w-8 h-8 bg-slate-50 p-1 rounded-full top-0 right-0 cursor-pointer hover:bg-slate-200">
          <Pencil size={20} />
        </Button>
        <div className="group relative w-[150px] h-[150px] flex justify-center items-center rounded-full overflow-hidden cursor-pointer" onClick={() => handleShowformUpload()}>
          <span className="absolute z-10 bg-slate-800/75 text-white px-3 py-2 rounded-3xl transition duration-300 ease-in-out opacity-0 group-hover:opacity-100">Changer</span>
          {imagePreview ? (
            <Image src={imagePreview} width={1000} height={800} alt="test" priority className="w-full h-auto mx-auto rounded-lg" />
          ) : (
            <UserRound className="w-full h-full bg-primary text-primary-foreground" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.2 } }}
            key="avatar"
            transition={{ type: "spring" }}
            onSubmit={(e) => onSubmit(e, file)}
            ref={ref}
            className="w-full"
          >
            <div
              {...getRootProps({
                className: `
      flex justify-center items-center border-dashed border-2 rounded-md h-52 transition-colors cursor-pointer
      ${isDragAccept ? "border-emerald-500" : ""}
      ${isDragReject || (isDragActive && !isDragAccept) ? "border-red-500 animate-pulse" : ""}
      ${isFocused ? "border-blue-500" : ""}
      ${!isDragActive && !isFocused ? "border-slate-400/25" : ""}
    `,
              })}
            >
              <Input {...getInputProps()} disabled={isPending} />
              {isDragAccept && <p className="text-lg text-emerald-500 font-semibold">{acceptText}</p>}
              {isDragReject && <p className="text-lg text-red-500 font-semibold">{rejectText}</p>}
              {!isDragActive && <p className="text-lg text-slate-400/35 font-semibold">{acceptText}</p>}
            </div>
            <SubmitButton texte="Modifier" loadindText="Traitement en cour" isLoading={isPending} className="mt-5" />
          </motion.form>
        )}
      </AnimatePresence>
    </>
  );
}
