import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { useHomeFeed } from "../hooks/use-home-feed";
import { MetricCard } from "./MetricCard";

export function DashboardMetrics() {
  const { data, isLoading, isError, refetch } = useHomeFeed();

  if (isError) {
    return (
      <View className="p-4 items-center justify-center bg-background rounded-lg m-2">
        <Text className="mb-4 text-center">Failed to load dashboard data.</Text>
        <Button onPress={refetch} variant="outline">
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const metrics = data
    ? [
        { label: "Students", value: data.students },
        { label: "Teachers", value: data.teachers },
        { label: "Classes", value: data.classes },
        { label: "Subjects", value: data.subjects },
        { label: "Exams", value: data.exams },
        { label: "Announcements", value: data.announcements },
      ]
    : Array.from({ length: 6 }).map(() => ({ label: "", value: "" }));

  return (
    <View>
      <Text variant="h3" className="p-4 pb-2">
        Admin Overview
      </Text>
      <View className="flex-row flex-wrap mx-2">
        {metrics.map((metric, index) => (
          <View key={metric.label || index} className="w-1/2 p-1">
            <MetricCard
              label={metric.label}
              value={metric.value}
              isLoading={isLoading}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
