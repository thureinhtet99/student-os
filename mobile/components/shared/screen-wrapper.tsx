import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { usePathname } from "expo-router";
import { StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "./header";

interface ScreenWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.ONBOARDING,
  ROUTES.ONBOARDING_WELCOME,
  ROUTES.ONBOARDING_SETUP_PROFILE,
  ROUTES.ONBOARDING_SELECT_INTEREST,
];

export function ScreenWrapper({ children, title }: ScreenWrapperProps) {
  const pathname = usePathname();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const isAuthOrOnboardingScreen = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Mock user and notification data
  const mockUser = {
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    fullName: "John Doe",
    studentId: "STU-0001",
    grade: "Grade 10",
    className: "Class A",
  };
  const mockNotificationCount = 5;

  return (
    <View
      className={cn(
        "flex-1 bg-background",
        isAuthOrOnboardingScreen ? `pt-[${insets.top}px]` : "",
      )}
    >
      <StatusBar barStyle="default" />
      {!isAuthOrOnboardingScreen && (
        <Header
          title={title || "Home"}
          user={mockUser}
          notificationCount={mockNotificationCount}
          onMenuPress={openDrawer}
          onNotificationPress={() => console.log("Notification pressed")}
        />
      )}
      <View className="flex-1">{children}</View>
    </View>
  );
}
