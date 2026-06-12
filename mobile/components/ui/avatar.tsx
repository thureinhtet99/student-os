import { Image, View, ViewProps } from "react-native";

interface AvatarProps extends ViewProps {
  src?: string;
  size?: number;
}

export function Avatar({ src, size = 40, style, ...props }: AvatarProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#ccc",
          overflow: "hidden",
        },
        style,
      ]}
      {...props}
    >
      {src ? (
        <Image source={{ uri: src }} style={{ width: "100%", height: "100%" }} />
      ) : (
        <View style={{ flex: 1, backgroundColor: "#666" }} />
      )}
    </View>
  );
}
