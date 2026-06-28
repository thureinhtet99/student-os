import { StatusBar, View } from "react-native";

interface ScreenWrapperProps {
  children: React.ReactNode;
}

export function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <View className="flex-1">
      <StatusBar barStyle="default" />
      <View className="flex-1">{children}</View>
    </View>
  );
}
