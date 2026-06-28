import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SubjectListItem } from './SubjectListItem';
import { Subject } from '@/types/academic.types';

// Mock data for subjects
const mockSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', code: 'MATH101', teacher: 'Prof. Alice Smith', description: 'Calculus I', credits: 3 },
  { id: '2', name: 'Physics', code: 'PHY101', teacher: 'Dr. Bob Johnson', description: 'Mechanics', credits: 4 },
  { id: '3', name: 'Chemistry', code: 'CHEM101', teacher: 'Dr. Carol White', description: 'General Chemistry', credits: 4 },
  { id: '4', name: 'Computer Science', code: 'CS101', teacher: 'Prof. David Green', description: 'Introduction to Programming', credits: 3 },
  { id: '5', name: 'Literature', code: 'ENG201', teacher: 'Ms. Emily Brown', description: 'English Literature', credits: 3 },
];

export function SubjectList() {
  // For now, we'll use mock data and simulate loading/error states.
  // TODO: wire to backend API using useSubjects hook
  const isLoading = false; // Simulate loading state
  const isError = false; // Simulate error state
  const subjects: Subject[] = mockSubjects; // Use mock data
  const hasMore = false; // Simulate pagination for now

  const refresh = () => {
    // TODO: implement refresh logic when wired to backend
    console.log('Refreshing subjects...');
  };

  const loadMore = () => {
    // TODO: implement load more logic when wired to backend
    console.log('Loading more subjects...');
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-center">Failed to load subjects.</Text>
        <Button onPress={refresh} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  if (isLoading && subjects.length === 0) {
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

  if (subjects.length === 0 && !isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-muted-foreground">No subjects found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={subjects}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SubjectListItem subject={item} />}
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
