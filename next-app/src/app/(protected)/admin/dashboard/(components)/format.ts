import { DashboardPeriod } from "@/lib/teacher-dashboard";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";

const decimal = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
});

export const formatScore = (value: number | null) =>
  value === null ? "—" : decimal.format(value);

export const formatInteger = (value: number) => integer.format(value);

export const formatPercent = (value: number | null) =>
  value === null ? "—" : percent.format(value);

export const formatSigned = (value: number) =>
  `${value > 0 ? "+" : value < 0 ? "−" : ""}${decimal.format(Math.abs(value))}`;

export const formatRelative = (iso: string | null) =>
  iso
    ? formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: fr })
    : "jamais";

export const PERIOD_LABELS: Record<DashboardPeriod, string> = {
  "7": "7 jours",
  "30": "30 jours",
  "90": "90 jours",
  tout: "Depuis le début",
};

export const PREVIOUS_PERIOD_LABELS: Record<DashboardPeriod, string> = {
  "7": "vs 7 jours précédents",
  "30": "vs 30 jours précédents",
  "90": "vs 90 jours précédents",
  tout: "",
};

/** Initiales pour l'avatar d'un élève */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
