import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

interface HeaderProps {
  user: {
    avatar: string;
    fullName: string;
    studentId: string;
    grade: string;
    className: string;
  };
}

const HEADER_HEIGHT = 160;
const AVATAR_SIZE = 64;

export function Header({ user }: HeaderProps) {
  return (
    <View className="bg-background">
      <View
        className="w-full px-4 rounded-b-2xl bg-primary justify-center"
        // style={{
        //   height: HEADER_HEIGHT,
        //   elevation: 5,
        //   shadowColor: "#000",
        //   shadowOffset: { width: 0, height: 2 },
        //   shadowOpacity: 0.25,
        //   shadowRadius: 6,
        // }}
      >
        <View className="flex-row items-center gap-2">
          {/* Avatar */}
          <View
            className="items-center justify-center"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          >
            <Avatar
              alt="Zach Nugent's Avatar"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            >
              <AvatarImage
                source={{ uri: "https://github.com/mrzachnugent.png" }}
              />
              <AvatarFallback>
                <Text>ZN</Text>
              </AvatarFallback>
            </Avatar>
          </View>

          {/* User Info */}
          <View className="flex-1">
            <Badge variant="secondary" className="self-start mb-1">
              <Text className="text-primary text-xs leading-none">
                {user.studentId}
              </Text>
            </Badge>
            <Text
              className="text-xl font-bold text-white leading-tight"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {user.fullName}
            </Text>
            <Text className="text-sm text-white opacity-70">
              Grade: {user.grade}, Class: {user.className}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
