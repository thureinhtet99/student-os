import "@/global.css";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-3xl font-bold text-blue-600">Student OS</Text>
      <Text className="mt-2 text-center text-gray-600">
        Welcome to your school management mobile application.
      </Text>
    </View>
  );
}
