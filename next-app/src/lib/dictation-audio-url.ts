import { mediaUrl } from "./media-url";

/** URL d'écoute d'un fichier audio de dictée, depuis le navigateur */
export const dictationAudioUrl = (name: string) => mediaUrl("dictation", name);
