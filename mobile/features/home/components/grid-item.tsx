import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, Href } from "expo-router";
import {
  Book,
  CheckSquare,
  FileText,
  Calendar,
  Users,
  User,
  CreditCard,
  CheckCircle,
  IdCard,
  type LucideIcon,
} from "lucide-react-native";

const iconMap: { [key: string]: LucideIcon } = {
  book: Book,
  "check-square": CheckSquare,
  "file-text": FileText,
  calendar: Calendar,
  team: Users,
  form: FileText,
  profile: User,
  "credit-card": CreditCard,
  "check-circle": CheckCircle,
  idcard: IdCard,
};

interface GridItemProps {
  label: string;
  iconName: string;
  route: string;
}

export function GridItem({ label, iconName, route }: GridItemProps) {
  const router = useRouter();
  const Icon = iconMap[iconName];
  const [size, setSize] = useState<number | null>(null);

  const handlePress = () => {
    router.push(route as Href);
  };

  return (
    <TouchableOpacity
      className="items-center justify-center rounded-lg bg-card p-4 shadow-sm"
      style={size ? { width: size, height: size } : undefined}
      onLayout={(e) => {
        const { width } = e.nativeEvent.layout;
        if (width !== size) setSize(width);
      }}
      onPress={handlePress}
    >
      {Icon ? <Icon size={40} color="black" className="mb-2" /> : null}
      <Text
        className="text-center text-sm font-medium text-foreground mt-2"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
