import { ThemedText } from "@/components/ThemedText";
import { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  StyleSheet,
  View,
} from "react-native";

type Props = Omit<PressableProps, "children"> & {
  children: ReactNode;
  label?: string;
};

export function FooterNavItem({ children, label, style, ...rest }: Props) {
  return (
    <Pressable
      style={(state: PressableStateCallbackType) => [
        styles.item,
        state.pressed && styles.pressed,
        typeof style === "function" ? style(state) : style,
      ]}
      accessibilityRole="tab"
      {...rest}
    >
      <View style={styles.inner}>
        {children}
        {label ? (
          <ThemedText variant="subtitle3" color="gray500" style={styles.label}>
            {label}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minWidth: 44,
    minHeight: 44,
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    marginTop: 2,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.65,
  },
});
