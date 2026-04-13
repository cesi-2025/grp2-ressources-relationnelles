import { Row } from "@/components/Row";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export { FooterNavItem } from "@/components/FooterNavItem";

type Props = {
  children: ReactNode;
};

export function Footer({ children }: Props) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.gray200,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <Row style={styles.row}>{children}</Row>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: "stretch",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "stretch",
    paddingHorizontal: 4,
    paddingTop: 8,
  },
});
