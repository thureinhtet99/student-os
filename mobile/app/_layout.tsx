import "@/global.css";
import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "@/components/shared/drawer-content";

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ headerShown: false, swipeEnabled: false }}
    />
  );
}
