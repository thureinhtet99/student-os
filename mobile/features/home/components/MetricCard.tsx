import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  label: string;
  value: number | string;
  isLoading?: boolean;
}

export function MetricCard({ label, value, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <View className="bg-card p-4 rounded-lg items-center justify-center flex-1 m-1 shadow-md">
        <Skeleton className="h-7 w-12 mb-2" />
        <Skeleton className="h-4 w-20" />
      </View>
    );
  }

  return (
    <View className="bg-card p-4 rounded-lg items-center justify-center flex-1 m-1 shadow-md">
      <Text className="text-2xl font-bold text-card-foreground">{value}</Text>
      <Text className="text-sm text-muted-foreground">{label}</Text>
    </View>
  );
}
