"use server";

import { closeExpiredControlsSafeData } from "@/data/exercice/control-closure.data";
import { getTeacherDashboardRawData } from "@/data/dashboard/teacher-dashboard.data";
import { getTeacherOnboardingData } from "@/data/dashboard/teacher-onboarding.data";
import { currentUser } from "@/lib/auth";
import {
  DashboardPeriod,
  buildTeacherDashboard,
  isDashboardPeriod,
} from "@/lib/teacher-dashboard";

/**
 * Tableau de bord du professeur connecté.
 * @param period - "7", "30", "90" ou "tout" (30 jours par défaut)
 * @param groupId - limite les indicateurs à un groupe du professeur
 */
export const getTeacherDashboardAction = async (
  period?: string,
  groupId?: string
) => {
  const user = await currentUser();
  if (!user?.id || user.role !== "ADMIN") {
    return { error: "Action non autoriser !" as const };
  }

  try {
    await closeExpiredControlsSafeData();
    const [raw, onboarding] = await Promise.all([
      getTeacherDashboardRawData(user.id),
      getTeacherOnboardingData(user.id),
    ]);
    const safePeriod: DashboardPeriod = isDashboardPeriod(period)
      ? period
      : "30";
    // Un groupe inconnu (ou d'un autre professeur) est simplement ignoré
    const safeGroupId =
      groupId && raw.groups.some((g) => g.id === groupId) ? groupId : null;

    const dashboard = buildTeacherDashboard({
      now: new Date(),
      period: safePeriod,
      groupId: safeGroupId,
      ...raw,
    });

    return {
      success: true as const,
      data: {
        teacherId: user.id,
        teacherName: user.name ?? null,
        groupOptions: raw.groups.map((g) => ({ id: g.id, name: g.name })),
        onboarding,
        dashboard,
      },
    };
  } catch (error) {
    console.error("Error building teacher dashboard:", error);
    return {
      error:
        "Une erreur est survenue lors du calcul du tableau de bord." as const,
    };
  }
};
