import { requireUser } from "@/server/auth";
import { getAnalyticsData } from "@/server/analytics";
import { InsightsClient } from "./insights-client";

export default async function InsightsPage() {
  const user = await requireUser();
  const analytics = await getAnalyticsData(user.id);

  return <InsightsClient analyticsData={analytics} />;
}
