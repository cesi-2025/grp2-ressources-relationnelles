import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

type Props = ViewProps & {
  title?: string;
  children?: ReactNode;
};

const platformShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  android: { elevation: 2 },
  default: {},
});

export function Card({ title, children, style, ...rest }: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.shell,
        platformShadow,
        { backgroundColor: colors.background, borderColor: colors.gray200 },
        style,
      ]}
      {...rest}
    >
      {title ? (
        <ThemedText variant="subtitle1" color="foreground" style={styles.title}>
          {title}
        </ThemedText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  title: {
    fontWeight: "600",
    marginBottom: 8,
  },
});
