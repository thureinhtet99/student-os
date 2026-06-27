import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils"; // Assuming this exists for class name utility
import { AntDesign } from "@react-native-vector-icons/ant-design";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  user: {
    avatar: string;
    fullName: string;
    studentId: string;
    grade: string;
    className: string;
  };
  notificationCount?: number;
  onMenuPress: () => void;
  onNotificationPress: () => void;
}

export function Header({
  title,
  user,
  notificationCount,
  onMenuPress,
  onNotificationPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="relative bg-background">
      {/* Top Navigation Bar */}
      <View
        className="flex-row items-center justify-between px-4 pb-2 bg-white border-b border-muted-foreground/10"
        style={{ paddingTop: insets.top, height: 56 + insets.top }}
      >
        <TouchableOpacity onPress={onMenuPress} className="p-2">
          <AntDesign name="menu-unfold" size={24} color="black" />
        </TouchableOpacity>
        <Text variant="h4" className="text-foreground">
          {title}
        </Text>
        <TouchableOpacity
          onPress={onNotificationPress}
          className="p-2 relative"
        >
          <AntDesign name="bell" size={24} color="black" />
          {notificationCount && notificationCount > 0 && (
            <View className="absolute top-1 right-1">
              <Badge
                variant="destructive"
                className="px-1 min-w-[16px] h-4 justify-center items-center"
              >
                <Text className="text-white text-xs leading-none">
                  {notificationCount}
                </Text>
              </Badge>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* User Information Card */}
      <View
        className={cn(
          "absolute w-full px-4 rounded-b-2xl shadow-md",
          "bg-primary pt-12 pb-4", // pt-12 to make space for avatar overlap
        )}
        style={{
          top: 56 + insets.top - 40, // Overlap: Nav bar height + inset - (Avatar height / 2 + some margin)
          // Adjust shadow for Android
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <View className="flex-row items-end">
          {/* Avatar */}
          <View
            className="absolute -top-10 left-4 rounded-full border-4 border-white"
            style={{ width: 80, height: 80 }} // Avatar size
          >
            <Avatar src={user.avatar} size={72} />
          </View>

          {/* User Info */}
          <View className="ml-24 flex-1">
            <Badge variant="secondary" className="self-start mb-1">
              <Text className="text-secondary-foreground text-xs leading-none">
                {user.studentId}
              </Text>
            </Badge>
            <Text className="text-xl font-bold text-white leading-tight">
              {user.fullName}
            </Text>
            <Text className="text-sm text-white opacity-70">
              {user.grade} • {user.className}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
