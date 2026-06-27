import { ROUTES } from "@/constants/routes";
import "@/global.css";
import { AntDesign } from "@react-native-vector-icons/ant-design";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      {ROUTES.DRAWER_ROUTES.map((route) => (
        <Drawer.Screen
          key={route.path}
          name={route.path}
          options={{
            drawerIcon: ({ color, size }) => (
              <AntDesign name={route.icon} size={size} color={color} />
            ),
            drawerLabel: route.name,
            title: route.name,
          }}
        />
      ))}
    </Drawer>
  );
}
