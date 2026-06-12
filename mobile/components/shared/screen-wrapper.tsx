import { SafeAreaView, View, ViewProps, StatusBar } from "react-native";
import { COLORS } from "@/constants/theme";

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  bg?: string;
}

export function ScreenWrapper({ children, bg = COLORS.background, style, ...props }: ScreenWrapperProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle="light-content" />
      <View style={[{ flex: 1 }, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
