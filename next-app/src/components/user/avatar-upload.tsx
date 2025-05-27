"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import SubmitButton from "../form/submit-button";
import { Button } from "../ui/button";

interface DragAndDropFileProps {
  handleUpload: (formData: FormData) => void;
  isPending: boolean;
  image?: string;
  mode?: "AVATAR" | "BANNER";
}

export default function AvatarUpload({
  handleUpload,
  isPending,
  image,
  mode = "AVATAR",
}: DragAndDropFileProps) {
  // states
  const [imagePreview, setImagePreview] = useState<string | null>(
    image ?? null
  );
  const [file, setFile] = useState<File>();
  const [open, setOpen] = useState<boolean>(!image); // Ouvert si pas d'image
  const ref = useRef<HTMLFormElement>(null);

  // handlers
  const onSubmit = (e: FormEvent<HTMLFormElement>, file: File | undefined) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        handleUpload(formData);
      } catch (error) {
        toast.error("une erreur c'est produite!");
      } finally {
        setFile(undefined);
        setOpen(false);
      }
    }
  };

  const handleShowformUpload = () => {
    setOpen((prev) => {
      if (prev) {
        setFile(undefined);
        setImagePreview(null);
        return prev;
      }
      return !prev;
    });
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

  // hooks
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
  });

  // styles
  const avatarStyle = "w-[150px] h-[150px] rounded-full";
  const bannerStyle = "w-full h-[300px] rounded-lg";

  const acceptText = "Déposez un fichier ici, ou cliquez pour le sélectionner.";
  const rejectText = "Ce type de fichier n'est pas autorisé !";

  return (
    <>
      {imagePreview && (
        <div
          className={cn(
            "relative mx-auto mb-5",
            mode === "AVATAR" ? avatarStyle : bannerStyle
          )}
        >
          <Button
            variant="secondary"
            onClick={() => handleShowformUpload()}
            className="absolute z-10 w-8 h-8 p-1 rounded-full top-0 right-0 cursor-pointer"
          >
            <Pencil size={20} />
          </Button>
          <div
            className={cn(
              "group relative flex justify-center items-center overflow-hidden cursor-pointer",
              mode === "AVATAR" ? avatarStyle : bannerStyle
            )}
            onClick={() => handleShowformUpload()}
          >
            <span className="absolute z-10 bg-slate-800/75 text-white px-3 py-2 rounded-3xl transition duration-300 ease-in-out opacity-0 group-hover:opacity-100">
              Changer
            </span>
            <Image
              src={imagePreview}
              width={1000}
              height={800}
              alt="test"
              priority
              className="w-full h-auto mx-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {open && (
        <AnimatePresence>
          <motion.form
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring" }}
            key="avatar-form"
            onSubmit={(e) => onSubmit(e, file)}
            ref={ref}
            className="w-full"
            id="upload"
          >
            {!file && (
              <div
                {...getRootProps({
                  className: `
      flex justify-center items-center border-dashed border-2 rounded-md h-52 transition-colors cursor-pointer
      ${isDragAccept ? "border-emerald-500" : ""}
      ${
        isDragReject || (isDragActive && !isDragAccept)
          ? "border-red-500 animate-pulse"
          : ""
      }
      ${isFocused ? "border-blue-500" : ""}
      ${!isDragActive && !isFocused ? "border-foreground/25" : ""}
    `,
                })}
              >
                <Input {...getInputProps()} disabled={isPending} />
                {isDragAccept && (
                  <p className="text-lg text-emerald-500 font-semibold">
                    {acceptText}
                  </p>
                )}
                {isDragReject && (
                  <p className="text-lg text-red-500 font-semibold">
                    {rejectText}
                  </p>
                )}
                {!isDragActive && (
                  <p className="text-lg text-accent-foreground font-semibold">
                    {acceptText}
                  </p>
                )}
              </div>
            )}
          </motion.form>
        </AnimatePresence>
      )}

      {(file || isPending) && (
        <SubmitButton
          texte="Modifier"
          loadindText="Traitement en cours"
          isLoading={isPending}
          className="mt-5"
          form="upload"
        />
      )}
    </>
  );
}
