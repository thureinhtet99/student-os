import { ScreenWrapper } from "@/components/shared/screen-wrapper";
import { ScrollView } from "react-native";
import { DashboardMetrics } from "./DashboardMetrics";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";

export function Dashboard() {
  return (
    <ScreenWrapper>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <DashboardMetrics />
        <QuickActions />
        <RecentActivity />
      </ScrollView>
    </ScreenWrapper>
  );
}
