import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";

type Props = ViewProps & {
  visible: boolean;
  message: string;
  accessibilityLabel?: string;
  blockHardwareBack?: boolean;
};

export function FullScreenLoadingOverlay({
  visible,
  message,
  accessibilityLabel = "Chargement",
  blockHardwareBack = true,
  style,
  ...rest
}: Props) {
  const colors = useThemeColors();

  useEffect(() => {
    if (!visible || !blockHardwareBack) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [visible, blockHardwareBack]);

  if (!visible) return null;

  return (
    <View
      style={[styles.overlay, { backgroundColor: colors.gray50 }, style]}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <ThemedText variant="subtitle1" color="gray600" style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  message: {
    marginTop: 4,
  },
});
