/**
 * Période de validité d'un contrôle.
 *
 * Un contrôle peut avoir une date d'ouverture et une date de clôture.
 * Sans date, il reste ouvert sans limite et la note est visible dès l'envoi
 * (comportement d'avant la période de validité).
 */

export type ControlPeriod = {
  opensAt?: Date | string | null;
  closesAt?: Date | string | null;
};

export type ControlStatus = "UPCOMING" | "OPEN" | "CLOSED";

const toDate = (value?: Date | string | null) =>
  value ? new Date(value) : null;

/** État du contrôle à l'instant `now` */
export const getControlStatus = (
  period: ControlPeriod,
  now: Date = new Date()
): ControlStatus => {
  const opensAt = toDate(period.opensAt);
  const closesAt = toDate(period.closesAt);
  if (opensAt && now < opensAt) return "UPCOMING";
  if (closesAt && now >= closesAt) return "CLOSED";
  return "OPEN";
};

/** L'élève peut-il rendre sa copie maintenant ? */
export const isControlOpen = (period: ControlPeriod, now: Date = new Date()) =>
  getControlStatus(period, now) === "OPEN";

/**
 * Les notes et corrections ne sont visibles pour l'élève qu'après la clôture.
 * Sans date de clôture, elles le sont tout de suite.
 */
export const areResultsVisible = (
  period: Pick<ControlPeriod, "closesAt">,
  now: Date = new Date()
) => {
  const closesAt = toDate(period.closesAt);
  return !closesAt || now >= closesAt;
};

// Fuseau fixe : même affichage côté serveur (UTC en Docker) et navigateur
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

/** « lundi 16 novembre à 18:00 » */
export const formatControlDate = (value: Date | string) =>
  dateFormatter.format(new Date(value));
