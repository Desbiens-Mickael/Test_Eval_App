import { getParentSettingsAction } from "@/actions/parent.action";
import PageTitle from "@/components/page-title";
import { Metadata } from "next";
import ParentSettings from "./parent-settings";

export const metadata: Metadata = {
  title: "Paramètres",
};

export const dynamic = "force-dynamic";

export default async function ParentSettingsPage() {
  const response = await getParentSettingsAction();
  if ("error" in response) {
    return <div className="rounded-xl border bg-card p-6 text-muted-foreground">{response.error}</div>;
  }
  return (
    <div className="flex flex-col gap-6 pb-10">
      <PageTitle title="Paramètres" />
      <ParentSettings
        email={response.data.email ?? ""}
        notificationsEnabled={response.data.parentEmailNotifications}
      />
    </div>
  );
}
