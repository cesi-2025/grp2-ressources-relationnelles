import { Colors } from "@/constants/colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, Text, TextProps } from "react-native";

// Styles pour les différents variantes de texte.
const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle3: {
    fontSize: 10,
    lineHeight: 16,
  },
  subtitle1: {
    fontSize: 14,
    lineHeight: 16,
  },
  subtitle2: {
    fontSize: 12,
    lineHeight: 16,
  },
  body3: {
    fontSize: 10,
    lineHeight: 16,
  },
  body1: {
    fontSize: 14,
    lineHeight: 16,
  },
  body2: {
    fontSize: 12,
    lineHeight: 16,
  },
  caption: {
    fontSize: 8,
    lineHeight: 16,
  },
});

type Props = TextProps & {
  variant?: keyof typeof styles;
  color?: keyof (typeof Colors)["light"];
};

// Composant de texte pour simplifier la gestion des couleurs et des font-sizes.
export function ThemedText({ variant, color, style, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <Text
      style={[
        styles[variant ?? "body3"],
        { color: colors[color ?? "gray900"] },
        style,
      ]}
      {...rest}
    />
  );
}
