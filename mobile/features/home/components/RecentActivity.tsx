import { View } from 'react-native';
import { useRecentAnnouncements } from '@/features/announcement/hooks/use-recent-announcements';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { Announcement } from '@/services/announcement-service';

function AnnouncementItem({ item }: { item: Announcement }) {
  return (
    <View className="bg-muted p-3 rounded-lg mb-2">
      <Text className="font-bold">{item.title}</Text>
      <Text className="text-sm text-muted-foreground" numberOfLines={2}>{item.content}</Text>
    </View>
  )
}

export function RecentActivity() {
  const { announcements, isLoading, isError } = useRecentAnnouncements();

  if (!isLoading && !announcements.length) {
    return null;
  }

  return (
    <View>
        <Text variant="h3" className="px-6 pt-4 pb-2">Recent Announcements</Text>
        <View className="px-6">
            {isLoading && (
                <>
                    <Skeleton className="h-16 mb-2" />
                    <Skeleton className="h-16 mb-2" />
                    <Skeleton className="h-16 mb-2" />
                </>
            )}
            {!isLoading && !isError && announcements.length === 0 && (
                <Text className="text-muted-foreground text-center py-8">No recent announcements.</Text>
            )}
            {!isLoading && announcements.map((item) => (
                <AnnouncementItem key={item.id} item={item} />
            ))}
            {isError && <Text className="text-destructive text-center py-8">Could not load announcements.</Text>}
        </View>
    </View>
  );
}
