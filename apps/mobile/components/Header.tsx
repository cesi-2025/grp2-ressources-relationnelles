import { CategoryPickerIcon } from "@/components/CategoryPickerIcon";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet } from "react-native";

export function Header() {
  const colors = useThemeColors();
  return (
    <Row
      style={[
        styles.header,
        { backgroundColor: colors.primary },
      ]}
    >
      <ThemedText
        variant="headline"
        color="gray50"
        style={styles.title}
        numberOfLines={1}
      >
        Ressource Relationnel
      </ThemedText>
      <CategoryPickerIcon />
    </Row>
  );
}

const styles = StyleSheet.create({
  header: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 5,
  },
  title: {
    flex: 1,
    fontWeight: "bold",
    marginRight: 8,
  },
});
