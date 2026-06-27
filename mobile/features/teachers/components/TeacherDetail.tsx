import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTeacher } from '../hooks/use-teacher';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function TeacherDetail() {
  const { id } = useLocalSearchParams();
  const teacherId = typeof id === 'string' ? id : '';
  const { teacher, isLoading, isError, refresh } = useTeacher(teacherId);

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Failed to load teacher details.</Text>
        <Button onPress={refresh} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading || !teacher) {
    return (
      <View className="flex-1 p-4 items-center">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-60 mb-6" />
        <View className="w-full">
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
        <Avatar src={teacher.avatar} size={96} className="mb-4" />
        <Text variant="h2" className="font-bold text-foreground mb-1">
          {`${teacher.firstName} ${teacher.lastName}`}
        </Text>
        <Text className="text-muted-foreground">{`ID: ${teacher.employeeId}`}</Text>
      </View>

      <View className="bg-card rounded-lg p-4 shadow-sm">
        <View className="flex-row justify-between py-2 border-b border-muted-foreground/10">
          <Text className="font-medium text-foreground">Email</Text>
          <Text className="text-muted-foreground">{teacher.email}</Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="font-medium text-foreground">Department</Text>
          <Text className="text-muted-foreground">{teacher.department}</Text>
        </View>
      </View>
    </View>
  );
}
