import { ThemedText } from "@/components/ThemedText";
import {
  useCategory,
} from "@/contexts/CategoryContext";
import { useThemeColors } from "@/hooks/useThemeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CategoryPickerIcon() {
  const colors = useThemeColors();
  const {
    selectedCategoryId,
    setSelectedCategoryId,
    categoryOptions,
    relationTypeId,
    setRelationTypeId,
    relationTypeOptions,
  } = useCategory();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Filtres et tri"
        hitSlop={12}
        style={styles.iconHit}
      >
        <Ionicons name="options-outline" size={26} color={colors.gray50} />
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        transparent
        onRequestClose={close}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityLabel="Fermer"
          />
          <SafeAreaView
            edges={["bottom"]}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.gray200,
              },
            ]}
          >
            <ThemedText
              variant="subtitle1"
              color="foreground"
              style={styles.sectionLabel}
            >
              Catégorie
            </ThemedText>
            {categoryOptions.map((item) => {
              const selected = selectedCategoryId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setSelectedCategoryId(item.id)}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: pressed ? colors.gray100 : "transparent" },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={item.name}
                >
                  <ThemedText
                    variant="body1"
                    color={selected ? "primary" : "foreground"}
                    style={{ flex: 1, fontWeight: selected ? "600" : "400" }}
                  >
                    {item.name}
                  </ThemedText>
                  {selected ? (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}

            <View style={[styles.separator, { backgroundColor: colors.gray200 }]} />

            <ThemedText
              variant="subtitle1"
              color="foreground"
              style={styles.sectionLabel}
            >
              Type de relation
            </ThemedText>
            {relationTypeOptions.map((item) => {
              const selected = relationTypeId === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setRelationTypeId(item.id)}
                  style={({ pressed }) => [
                    styles.row,
                    { backgroundColor: pressed ? colors.gray100 : "transparent" },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={item.name}
                >
                  <ThemedText
                    variant="body1"
                    color={selected ? "primary" : "foreground"}
                    style={{ flex: 1, fontWeight: selected ? "600" : "400" }}
                  >
                    {item.name}
                  </ThemedText>
                  {selected ? (
                    <Ionicons name="checkmark" size={22} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}

            <View style={styles.footerActions}>
              <Pressable
                onPress={close}
                accessibilityRole="button"
                accessibilityLabel="Fermer les filtres"
                style={[styles.closeButton, { backgroundColor: colors.primary }]}
              >
                <ThemedText variant="subtitle1" color="gray50">
                  Fermer
                </ThemedText>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconHit: {
    padding: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 8,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionLabel: {
    marginBottom: 8,
    marginHorizontal: 8,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
    marginHorizontal: 8,
  },
  footerActions: {
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  closeButton: {
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
});
