import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type BackButtonProps = Omit<PressableProps, "onPress" | "style"> & {
  label?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({
  label = "Retour",
  onPress,
  disabled,
  style,
  accessibilityLabel,
  ...rest
}: BackButtonProps) {
  const colors = useThemeColors();
  const tone = disabled ? "gray400" : "foreground";

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      style={[styles.base, disabled ? styles.disabled : undefined, style]}
      {...rest}
    >
      <Ionicons name="chevron-back" size={24} color={colors[tone]} />
      <ThemedText variant="subtitle1" color={tone}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.45,
  },
});
