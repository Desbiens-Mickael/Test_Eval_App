import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";

const NEXT_PUBLIC_UPLOAD_API_URL = process.env.NEXT_PUBLIC_UPLOAD_API_URL;

const onUpload = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const promise = fetch(`${NEXT_PUBLIC_UPLOAD_API_URL}/lesson`, {
    method: "POST",
    body: formData,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { image_path } = (await res.json()) as { image_path: string };
          // preload the image
          const image = new Image();
          const src = `${NEXT_PUBLIC_UPLOAD_API_URL}/lesson/${image_path}`;
          image.src = src;
          image.onload = () => {
            resolve(src);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error("`NEXT_PUBLIC_UPLOAD_API_URL` environment variable not found, reading image locally instead.");
          // Unknown error
        } else {
          throw new Error("Erreur de téléchargement de l'image. Veuillez réessayer.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploader avec succès.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      }
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("Type de fichier incorrect (accepte uniquement des images).");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("Taille du fichier trop grande (max 20MB).");
      return false;
    }
    return true;
  },
});
