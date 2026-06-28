import { FlatList, View, ActivityIndicator } from 'react-native';
import { useTeachers } from '../hooks/use-teachers';
import { TeacherListItem } from './TeacherListItem';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function TeacherList() {
  const { teachers, isLoading, isError, hasMore, loadMore, refresh } = useTeachers();

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Failed to load teachers.</Text>
        <Button onPress={refresh} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading && teachers.length === 0) {
    return (
      <View className="p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} className="flex-row items-center p-4 bg-card rounded-lg shadow-sm mb-3">
            <Skeleton className="w-12 h-12 rounded-full mr-3" />
            <View>
              <Skeleton className="h-5 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (teachers.length === 0 && !isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground">No teachers found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={teachers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TeacherListItem teacher={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={() =>
        isLoading && hasMore ? (
          <ActivityIndicator className="my-4" size="large" color="blue" />
        ) : null
      }
      refreshing={isLoading}
      onRefresh={refresh}
      className="p-4"
    />
  );
}
