import { StudentProgress } from "@/lib/student-progress";
import { formatRate } from "./format";

const greeting = (now: Date) => {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "Europe/Paris",
    }).format(now)
  );
  return hour >= 18 || hour < 5 ? "Bonsoir" : "Bonjour";
};

/** Phrase d'encouragement écrite à partir des chiffres */
const summarySentence = ({ summary, badges }: StudentProgress) => {
  if (summary.done === 0) {
    return "Fais ton premier contrôle pour voir ta progression ici.";
  }
  const earned = badges.filter((b) => b.earnedAt).length;
  const parts = [
    `Tu as fait ${summary.done} contrôle${summary.done > 1 ? "s" : ""}`,
    `avec ${formatRate(summary.successRate)} de réussite en moyenne`,
  ];
  let trend = "";
  if (summary.recentRate !== null && summary.previousRate !== null) {
    const delta = summary.recentRate - summary.previousRate;
    if (delta >= 5) trend = " Tes derniers résultats sont en hausse, continue !";
    else if (delta <= -5) trend = " Tes derniers résultats sont un peu en baisse : relis tes leçons.";
  }
  return `${parts.join(" ")} et gagné ${earned} badge${earned > 1 ? "s" : ""}.${trend}`;
};

export default function ProgressHeader({
  studentName,
  progress,
}: {
  studentName: string;
  progress: StudentProgress;
}) {
  const firstName = studentName.split(" ")[0];
  const today = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date());

  return (
    <div className="pt-2">
      <p className="text-sm font-medium capitalize text-primary">{today}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
        {greeting(new Date())}
        {firstName ? ` ${firstName}` : ""}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{summarySentence(progress)}</p>
    </div>
  );
}
