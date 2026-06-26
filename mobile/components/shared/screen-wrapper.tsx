import { COLORS } from "@/constants/theme";
import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends ViewProps {
  children: React.ReactNode;
  bg?: string;
  color?: string;
}

export function ScreenWrapper({
  children,
  bg = COLORS.background.light,
  color = COLORS.background.light,
  style,
  ...props
}: Props) {
  const colorScheme = useColorScheme();
  // const themeTextStyle =
  //   colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar barStyle="default" />
      <View style={[{ flex: 1 }, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // text: {
  //   fontSize: 20,
  // },
  lightContainer: {
    backgroundColor: COLORS.background.light,
  },
  darkContainer: {
    backgroundColor: COLORS.background.dark,
  },
  lightThemeText: {
    color: COLORS.text.light,
  },
  darkThemeText: {
    color: COLORS.text.dark,
  },
});
