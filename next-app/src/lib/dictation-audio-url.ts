/** URL d'écoute d'un fichier audio de dictée, depuis le navigateur */
export const dictationAudioUrl = (name: string) =>
  `${process.env.NEXT_PUBLIC_CLIENT_DOMAIN_API ?? ""}/dictation/${encodeURIComponent(name)}`;
