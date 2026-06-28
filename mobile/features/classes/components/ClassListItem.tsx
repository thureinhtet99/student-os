import { View, TouchableOpacity } from "react-native";
import { useRouter, Href } from "expo-router";
import { Text } from "@/components/ui/text";
import { Class } from "@/services/class-service";
import { ROUTES } from "@/constants/routes";
import { ShieldHalf } from "lucide-react-native";

interface ClassListItemProps {
  classItem: Class;
}

export function ClassListItem({ classItem }: ClassListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(ROUTES.CLASSES_DETAIL(classItem.id) as Href);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center p-4 bg-card rounded-lg shadow-sm mb-3"
    >
      <View className="mr-3 p-3 rounded-full bg-muted">
        <ShieldHalf size={24} color="black" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-card-foreground">
          {classItem.name}
        </Text>
        <Text className="text-sm text-muted-foreground">{`Year: ${classItem.year}`}</Text>
        {classItem.teacherId && (
          <Text className="text-sm text-muted-foreground">{`Teacher ID: ${classItem.teacherId}`}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
