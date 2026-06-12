import { Text as RNText, TextProps } from "react-native";
import { COLORS } from "@/constants/theme";

interface CustomTextProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  color?: string;
}

export function Text({ variant = "body", color = COLORS.text.dark, style, ...props }: CustomTextProps) {
  let fontSize = 16;
  let fontWeight: "normal" | "bold" | "500" | "600" | "700" = "normal";

  switch (variant) {
    case "h1":
      fontSize = 24;
      fontWeight = "700";
      break;
    case "h2":
      fontSize = 20;
      fontWeight = "600";
      break;
    case "h3":
      fontSize = 18;
      fontWeight = "600";
      break;
    case "caption":
      fontSize = 12;
      color = color === COLORS.text.dark ? COLORS.text.muted : color;
      break;
    default:
      fontSize = 16;
  }

  return (
    <RNText
      style={[
        {
          fontSize,
          fontWeight,
          color,
        },
        style,
      ]}
      {...props}
    />
  );
}
