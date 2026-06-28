import React from 'react';
import { View, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Subject } from '@/types/academic.types';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

// Mock data for a single subject
const mockSubject: Subject = {
  id: '1',
  name: 'Mathematics',
  code: 'MATH101',
  teacher: 'Prof. Alice Smith',
  description: 'Calculus I - This course covers the fundamental concepts of differential and integral calculus, including limits, derivatives, integrals, and their applications. It is designed for students pursuing degrees in mathematics, engineering, and the physical sciences.',
  credits: 3,
};

export function SubjectDetail() {
  const { id } = useLocalSearchParams();

  // For now, we'll use mock data and simulate loading/error states.
  // TODO: wire to backend API using a useSubjectDetail hook
  const isLoading = false; // Simulate loading state
  const isError = false; // Simulate error state
  const subject: Subject | null = mockSubject; // Use mock data

  const refresh = () => {
    // TODO: implement refresh logic when wired to backend
    console.log('Refreshing subject detail...');
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Failed to load subject details.</Text>
        <Button onPress={refresh} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading || !subject) {
    return (
      <View className="p-4">
        <Stack.Screen options={{ title: 'Loading...' }} />
        <View className="items-center mb-6">
          <Skeleton className="w-24 h-24 rounded-full mb-4" />
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </View>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <Stack.Screen options={{ title: subject.name }} />
      <View className="p-4">
        <Card className="mb-4">
          <View className="flex-row items-center mb-4">
            <Avatar src={`https://api.dicebear.com/7.x/initials/png?seed=${subject.name}`} size={64} className="mr-4" />
            <View>
              <Text className="text-2xl font-bold text-card-foreground">{subject.name}</Text>
              <Text className="text-md text-muted-foreground">{subject.code}</Text>
            </View>
          </View>
          <Text className="text-base text-card-foreground mb-4">{subject.description}</Text>
          <View className="flex-row justify-between items-center border-t border-border pt-4">
            <View>
              <Text className="text-sm text-muted-foreground">Teacher</Text>
              <Text className="text-base font-medium">{subject.teacher}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-muted-foreground">Credits</Text>
              <Text className="text-base font-medium">{subject.credits}</Text>
            </View>
          </View>
        </Card>

        {/* Placeholder for Subject Feedback and Resources components */}
        {/* TODO: Integrate SubjectFeedback and SubjectResources components here */}
        <View className="mt-4">
          <Text className="text-xl font-bold mb-3">Feedback</Text>
          <Card className="p-4">
            <Text className="text-muted-foreground">Feedback section coming soon...</Text>
          </Card>
        </View>

        <View className="mt-4">
          <Text className="text-xl font-bold mb-3">Resources</Text>
          <Card className="p-4">
            <Text className="text-muted-foreground">Resources section coming soon...</Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
