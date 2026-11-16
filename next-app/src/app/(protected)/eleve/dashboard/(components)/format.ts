const percentFormat = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
});

/** 72 → « 72 % » (espace insécable), « — » sans valeur */
export const formatRate = (value: number | null) =>
  value === null ? "—" : percentFormat.format(value / 100);

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/Paris",
});
const longDateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export const formatShortDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatLongDate = (iso: string) => longDateFormat.format(new Date(iso));

/** Couleur du texte selon la réussite (mêmes seuils que l'affichage des notes) */
export const rateTone = (value: number | null) => {
  if (value === null) return "text-muted-foreground";
  if (value >= 80) return "text-green-700 dark:text-green-400";
  if (value >= 60) return "text-yellow-700 dark:text-yellow-400";
  if (value >= 40) return "text-orange-700 dark:text-orange-400";
  return "text-red-700 dark:text-red-400";
};
