import { ROUTES } from "@/constants/routes";
import "@/global.css";
import { Drawer } from "expo-router/drawer";
import { NotificationButton } from "@/components/shared/notification-button";
import {
  Home,
  Bell,
  User,
  Users,
  IdCard,
  Book,
  GraduationCap,
  CheckSquare,
  Calendar,
  FileText,
  CreditCard,
  type LucideIcon,
} from "lucide-react-native";
import { ScreenWrapper } from "@/components/shared/screen-wrapper";

const iconMap: { [key: string]: LucideIcon } = {
  home: Home,
  notification: Bell,
  user: User,
  team: Users,
  idcard: IdCard,
  book: Book,
  solution: GraduationCap,
  "check-square": CheckSquare,
  calendar: Calendar,
  form: FileText,
  profile: User,
  "credit-card": CreditCard,
};

export default function Layout() {
  return (
    <ScreenWrapper>
      <Drawer>
        {ROUTES.DRAWER_ROUTES.map((route) => {
          const Icon = iconMap[route.icon];
          return (
            <Drawer.Screen
              key={route.path}
              name={route.path}
              options={{
                drawerIcon: ({ color, size }) =>
                  Icon ? <Icon size={size} color={color} /> : null,
                drawerLabel: route.name,
                title: route.name,
                headerRight: () => <NotificationButton notificationCount={5} />,
              }}
            />
          );
        })}
      </Drawer>
    </ScreenWrapper>
  );
}
