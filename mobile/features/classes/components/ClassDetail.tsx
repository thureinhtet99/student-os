import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useClass } from '../hooks/use-class';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function ClassDetail() {
  const { id } = useLocalSearchParams();
  const classId = typeof id === 'string' ? id : '';
  const { classDetail, isLoading, isError, refresh } = useClass(classId);

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Failed to load class details.</Text>
        <Button onPress={refresh} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading || !classDetail) {
    return (
      <View className="flex-1 p-4 items-center">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-60 mb-6" />
        <View className="w-full">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-background">
      <View className="items-center mb-6">
        <Text variant="h2" className="font-bold text-foreground mb-1">
          {classDetail.name}
        </Text>
        <Text className="text-muted-foreground">{`Year: ${classDetail.year}`}</Text>
        {classDetail.teacherId && <Text className="text-muted-foreground">{`Teacher ID: ${classDetail.teacherId}`}</Text>}
      </View>

      <View className="bg-card rounded-lg p-4 shadow-sm">
        <View className="flex-row justify-between py-2 border-b border-muted-foreground/10">
          <Text className="font-medium text-foreground">Class Name</Text>
          <Text className="text-muted-foreground">{classDetail.name}</Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-muted-foreground/10">
          <Text className="font-medium text-foreground">Year</Text>
          <Text className="text-muted-foreground">{classDetail.year}</Text>
        </View>
        {classDetail.teacherId && (
            <View className="flex-row justify-between py-2">
            <Text className="font-medium text-foreground">Assigned Teacher ID</Text>
            <Text className="text-muted-foreground">{classDetail.teacherId}</Text>
            </View>
        )}
      </View>
    </View>
  );
}
