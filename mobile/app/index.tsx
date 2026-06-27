import { ScreenWrapper } from "@/components/shared/screen-wrapper";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function Index() {
  return (
    <ScreenWrapper>
      <View className="flex-1 items-center justify-center">
        <Text variant="h1">Home</Text>
      </View>
    </ScreenWrapper>
  );
}
