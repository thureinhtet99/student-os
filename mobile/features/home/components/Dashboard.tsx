import { ScrollView } from 'react-native';
import { DashboardMetrics } from './DashboardMetrics';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { ScreenWrapper } from '@/components/shared/screen-wrapper';

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
