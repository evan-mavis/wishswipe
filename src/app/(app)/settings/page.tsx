import { requireUser } from "@/server/auth";
import { getPreferences } from "@/server/preferences";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const user = await requireUser();
  const preferences = await getPreferences(user.id);

  return <SettingsClient initialPreferences={preferences} />;
}
