import { TouchableOpacity } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { ROUTES } from "@/constants/routes";
import { Bell } from "lucide-react-native";

export function NotificationButton({
  notificationCount,
}: {
  notificationCount: number;
}) {
  const router = useRouter();
  const handlePress = () => router.push(ROUTES.ANNOUNCEMENT);

  return (
    <TouchableOpacity onPress={handlePress} className="p-2 relative mr-2">
      <Bell />

      {notificationCount && notificationCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute top-2 right-1 px-1 justify-center items-center rounded-full"
        >
          <Text className="text-xs leading-none">
            {notificationCount > 99 ? "99+" : notificationCount}
          </Text>
        </Badge>
      )}
    </TouchableOpacity>
  );
}
