"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dictationAudioUrl } from "@/lib/dictation-audio-url";
import { DICTATION_TEXT_MAX_LENGTH, contentDictationInput } from "@/shema-zod/exercice.shema";
import { Loader2, Mic, Square, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface ContentDictationFormProps {
  initialValue?: contentDictationInput | unknown[];
  isEditing?: boolean;
  onChange?: (newContent: contentDictationInput) => void;
}

// Un enregistrement s'arrête tout seul au bout de 10 minutes
const MAX_RECORDING_MS = 10 * 60 * 1000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Premier format d'enregistrement que le navigateur sait produire */
const recordingMimeType = () => {
  if (typeof MediaRecorder === "undefined") return null;
  return (
    ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"].find((type) =>
      MediaRecorder.isTypeSupported(type)
    ) ?? ""
  );
};

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** Envoie l'audio au service ; renvoie le nom du fichier enregistré */
const uploadAudio = async (file: Blob, name: string) => {
  const body = new FormData();
  body.append("file", file, name);
  const response = await fetch("/api/upload/dictation", { method: "POST", body });
  const data = (await response.json().catch(() => ({}))) as {
    image_path?: string;
    message?: string;
    detail?: string;
  };
  if (!response.ok || !data.image_path) {
    throw new Error(data.message ?? data.detail ?? "L'envoi de l'audio a échoué.");
  }
  return data.image_path;
};

/**
 * Saisie d'une dictée : l'audio (enregistré au micro ou importé) et le texte
 * exact, qui sert à corriger la copie de l'élève mot à mot.
 */
export default function ContentDictationForm({
  initialValue,
  onChange,
  isEditing = true,
}: ContentDictationFormProps) {
  const [content, setContent] = useState<contentDictationInput>(() =>
    initialValue && !Array.isArray(initialValue)
      ? (initialValue as contentDictationInput)
      : { audio: "", text: "" }
  );
  const [recordingSince, setRecordingSince] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onChange?.(content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Chronomètre de l'enregistrement, arrêt automatique à la durée maximale
  useEffect(() => {
    if (recordingSince === null) return;
    const timer = setInterval(() => {
      const ms = Date.now() - recordingSince;
      setElapsed(ms);
      if (ms >= MAX_RECORDING_MS) recorderRef.current?.stop();
    }, 250);
    return () => clearInterval(timer);
  }, [recordingSince]);

  // Micro libéré si le formulaire est quitté pendant un enregistrement
  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
    },
    []
  );

  const saveAudio = async (file: Blob, name: string) => {
    setIsUploading(true);
    try {
      const audio = await uploadAudio(file, name);
      setContent((prev) => ({ ...prev, audio }));
      toast.success("Audio enregistré.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "L'envoi de l'audio a échoué.");
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    const mimeType = recordingMimeType();
    if (mimeType === null || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Ce navigateur ne permet pas d'enregistrer : importez un fichier audio.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error("Micro inaccessible : autorisez-le dans le navigateur, ou importez un fichier.");
      return;
    }

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      setRecordingSince(null);
      const type = recorder.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunks, { type });
      if (blob.size === 0) {
        toast.error("L'enregistrement est vide.");
        return;
      }
      const extension = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
      void saveAudio(blob, `dictee.${extension}`);
    };
    recorderRef.current = recorder;
    recorder.start();
    setElapsed(0);
    setRecordingSince(Date.now());
  };

  const importFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Fichier audio trop volumineux (10 Mo maximum).");
      return;
    }
    void saveAudio(file, file.name);
  };

  const isRecording = recordingSince !== null;

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {content.audio ? (
          <audio controls preload="metadata" src={dictationAudioUrl(content.audio)} className="w-full">
            Votre navigateur ne lit pas l&apos;audio.
          </audio>
        ) : (
          <p className="text-sm text-muted-foreground">Pas d&apos;audio.</p>
        )}
        <p className="whitespace-pre-wrap rounded-lg border bg-card p-4">{content.text || "—"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Enregistrez la dictée au micro ou importez un fichier audio (10 Mo maximum), puis écrivez
        le texte exact. La copie de l&apos;élève est corrigée mot à mot : les accents et les
        majuscules comptent, la ponctuation n&apos;est pas notée. Vous pourrez ajuster la note de
        chaque copie.
      </p>

      <fieldset className="space-y-3 rounded-lg border bg-card p-4">
        <legend className="px-1 font-medium">Audio</legend>

        {content.audio && !isRecording && (
          <audio
            key={content.audio}
            controls
            preload="metadata"
            src={dictationAudioUrl(content.audio)}
            className="w-full"
          >
            Votre navigateur ne lit pas l&apos;audio.
          </audio>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {isRecording ? (
            <>
              <Button type="button" variant="destructive" onClick={() => recorderRef.current?.stop()}>
                <Square className="mr-2 h-4 w-4" aria-hidden="true" />
                Arrêter l&apos;enregistrement
              </Button>
              <span className="flex items-center gap-2 text-sm tabular-nums" aria-live="polite">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-destructive" aria-hidden="true" />
                Enregistrement : {formatDuration(elapsed)}
              </span>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={startRecording} disabled={isUploading}>
                <Mic className="mr-2 h-4 w-4" aria-hidden="true" />
                {content.audio ? "Réenregistrer" : "Enregistrer au micro"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                {content.audio ? "Remplacer par un fichier" : "Importer un fichier"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
                onChange={(e) => {
                  importFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {isUploading && (
                <span className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Envoi de l&apos;audio…
                </span>
              )}
            </>
          )}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <Label htmlFor="dictation-text">Texte de la dictée (la correction)</Label>
        <Textarea
          id="dictation-text"
          rows={6}
          maxLength={DICTATION_TEXT_MAX_LENGTH}
          placeholder="Écrivez exactement le texte lu dans l'audio."
          value={content.text}
          onChange={(e) => setContent((prev) => ({ ...prev, text: e.target.value }))}
        />
      </div>
    </div>
  );
}
